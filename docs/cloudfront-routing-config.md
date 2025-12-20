# CloudFront Routing Configuration

This document explains how CloudFront is configured to support client-side routing for deep links in the AudexaAI web application.

## Overview

The application uses **client-side routing** for entity detail pages (e.g., `/portal/projects/<uuid>`, `/portal/controls/<uuid>`). These URLs don't have corresponding static HTML files - instead, the client-side router handles displaying the correct view.

**Problem:** When a user visits or refreshes a deep link like `/portal/projects/<uuid>`, CloudFront looks for that file in S3, doesn't find it, and returns a 404.

**Solution:** Configure CloudFront to rewrite these requests to the appropriate `index.html` file, which then loads the React app and handles routing client-side.

## CloudFront Function (Recommended)

### What It Does

The CloudFront Function intercepts requests and rewrites URLs:
- `/portal/projects/<uuid>` → `/portal/projects/index.html`
- `/portal/controls/<uuid>` → `/portal/controls/index.html`
- `/portal/applications/<uuid>` → `/portal/applications/index.html`
- Any `/portal/<route>/<uuid>` → `/portal/<route>/index.html`

### Function Code

```javascript
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Rewrite requests under /portal/ with no file extension
    if (uri.startsWith('/portal/') && !uri.includes('.')) {
        if (uri.endsWith('/')) {
            // Directory path: append index.html
            request.uri = uri + 'index.html';
        } else {
            // File path without extension: find the route segment and append /index.html
            // For /portal/projects/<uuid>, rewrite to /portal/projects/index.html
            // For /portal/controls/<uuid>, rewrite to /portal/controls/index.html
            var parts = uri.split('/');
            if (parts.length >= 3) {
                // Keep /portal/<route>/ and append index.html
                request.uri = '/' + parts[1] + '/' + parts[2] + '/index.html';
            } else {
                // Fallback to /portal/index.html
                request.uri = '/portal/index.html';
            }
        }
    }
    
    return request;
}
```

### Setup Instructions

1. **Navigate to CloudFront Console**
   - Go to AWS Console → CloudFront
   - Select your distribution

2. **Create Function**
   - Click **Functions** in left sidebar
   - Click **Create function**
   - Name: `portal-routing-rewrite`
   - Description: "Rewrites portal deep links to index.html files"

3. **Add Function Code**
   - Paste the function code above into the editor
   - Click **Save changes**

4. **Publish Function**
   - Click **Publish** button
   - Confirm publishing

5. **Associate with Distribution**
   - Go back to your distribution
   - Click **Behaviors** tab
   - Select the behavior (usually default `*`)
   - Click **Edit**
   - Scroll to **Function associations**
   - Under **Viewer request**, select **CloudFront Function**
   - Choose `portal-routing-rewrite` from dropdown
   - Click **Save changes**

6. **Wait for Deployment**
   - Distribution status will show "Deploying..."
   - Wait 5-15 minutes for changes to propagate
   - Status changes to "Deployed" when ready

### How It Works

1. User requests `/portal/projects/123e4567-e89b-12d3-a456-426614174000`
2. CloudFront Function intercepts the request
3. Function detects it's a `/portal/` route with no file extension
4. Function extracts route segment: `projects`
5. Function rewrites to: `/portal/projects/index.html`
6. CloudFront serves `/portal/projects/index.html` from S3
7. React app loads and `usePathname()` detects the full URL
8. Component renders detail view for project ID `123e4567-e89b-12d3-a456-426614174000`

### Benefits

- **Fast:** No 404 error first - direct rewrite
- **Scalable:** Works for any `/portal/<route>/<uuid>` pattern automatically
- **No code changes:** Add new entity types without touching CloudFront
- **Low cost:** CloudFront Functions are free (included in distribution)

## Alternative: Custom Error Responses

If CloudFront Functions aren't available or you prefer a simpler approach:

### Setup

1. **Go to Distribution → Error Pages**
2. **Create Custom Error Response for 404:**
   - HTTP error code: `404`
   - Response page path: `/portal/index.html`
   - HTTP response code: `200` (OK)
   - Error caching minimum TTL: `0`
3. **Create Custom Error Response for 403:**
   - HTTP error code: `403`
   - Response page path: `/portal/index.html`
   - HTTP response code: `200` (OK)
   - Error caching minimum TTL: `0`

### How It Works

1. User requests `/portal/projects/<uuid>`
2. CloudFront looks for file in S3
3. File doesn't exist → 404 error
4. Custom Error Response catches 404
5. Serves `/portal/index.html` with HTTP 200
6. React app loads and handles routing client-side

### Trade-offs

- **Slower:** Requires 404 first, then fallback
- **Less precise:** All 404s go to `/portal/index.html` (not route-specific)
- **Simpler:** Easier to set up, no code to write

## Testing

After configuration, test:

1. **Direct Deep Link:**
   ```
   https://your-domain.com/portal/projects/<valid-uuid>
   ```
   Should load project detail page (not 404)

2. **Refresh on Detail Page:**
   - Navigate to project detail
   - Refresh browser
   - Should stay on detail page (not 404)

3. **Invalid ID:**
   ```
   https://your-domain.com/portal/projects/invalid-id
   ```
   Should show "Project not found" message (not 404)

## Troubleshooting

### Deep Links Still Return 404

**Check:**
- [ ] Function is published (not just saved)
- [ ] Function is associated with **Viewer Request** (not Viewer Response)
- [ ] Distribution has finished deploying (status = "Deployed")
- [ ] Function code matches exactly (no typos)

**Fix:**
- Create CloudFront invalidation for `/*` to clear cache
- Check CloudWatch logs for function errors
- Verify function is associated with the correct behavior

### Function Not Executing

**Check:**
- Function association is set to **Viewer Request**
- Function is in **Published** state
- Distribution behavior matches the request path

**Fix:**
- Re-publish the function
- Re-associate with distribution
- Wait for deployment to complete

### Wrong Route Being Served

**Check:**
- Function code logic (parts array indexing)
- URL structure matches expected pattern

**Fix:**
- Test function code with different URL patterns
- Verify `parts[1]` and `parts[2]` are correct indices

## Maintenance

### Adding New Routes

**No CloudFront changes needed!** The function automatically handles:
- `/portal/projects/<uuid>`
- `/portal/controls/<uuid>`
- `/portal/applications/<uuid>`
- Any future `/portal/<route>/<uuid>` pattern

Just create the corresponding `page.tsx` file following the client-side routing pattern.

### Updating Function

1. Go to CloudFront → Functions
2. Select `portal-routing-rewrite`
3. Edit code
4. Save changes
5. **Publish** (important - saved changes don't take effect until published)
6. Wait for deployment

### Monitoring

- **CloudWatch Logs:** Check function execution logs
- **CloudFront Metrics:** Monitor 404 errors (should decrease after setup)
- **Real User Monitoring:** Test deep links from different locations

## Related Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Full deployment guide
- [README.md](../README.md) - Project overview and setup

## Support

If you encounter issues:
1. Check CloudWatch logs for function errors
2. Verify function code syntax
3. Test with CloudFront invalidation
4. Review AWS CloudFront Function documentation
