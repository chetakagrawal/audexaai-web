# Deployment Guide

This Next.js application uses static export (`output: "export"`) and is deployed to S3 + CloudFront.

## Static Export Configuration

The application is configured for static export in `next.config.mjs`:
- Static export is enabled when `NEXT_EXPORT=true` environment variable is set
- `trailingSlash: true` ensures proper routing
- Images are unoptimized for static export compatibility

## CloudFront Configuration for Deep Links

The application uses client-side routing for deep links like `/portal/projects/<uuid>` without pre-generating routes. To support these routes in CloudFront, you need to configure URL rewriting.

### Option A: CloudFront Function (Recommended)

Create a CloudFront Function that rewrites requests for portal routes to serve the appropriate HTML file.

**Function Code:**
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
            // For /portal/dashboard, rewrite to /portal/dashboard/index.html
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

**Configuration Steps:**
1. In CloudFront console, go to **Functions**
2. Create a new function with the code above
3. Associate the function with your CloudFront distribution
4. Set the function to run on **Viewer Request** event type
5. Publish the function

**Pseudocode Logic:**
```
if uri starts with /portal/ and uri does not contain . then
    if uri ends with / then
        set request.uri = uri + "index.html"
    else
        // Extract route segment: /portal/projects/<uuid> -> /portal/projects/index.html
        parts = split uri by "/"
        if parts.length >= 3 then
            set request.uri = "/" + parts[1] + "/" + parts[2] + "/index.html"
        else
            set request.uri = "/portal/index.html"
        end if
    end if
end if
```

### Option B: CloudFront Custom Error Responses

If you prefer not to use CloudFront Functions, you can configure custom error responses:

1. In CloudFront distribution settings, go to **Error Pages**
2. Create custom error responses for:
   - **HTTP Error Code:** 403 (Forbidden)
   - **Response Page Path:** `/portal/index.html`
   - **HTTP Response Code:** 200 (OK)
   - **Error Caching Minimum TTL:** 0 (or very low value)
3. Repeat for HTTP Error Code 404
4. Apply the same settings

**Note:** This approach may have slightly higher latency as it requires CloudFront to first attempt to fetch the non-existent file before serving the fallback.

## Static Export Output Structure

When building with `NEXT_EXPORT=true`, the build outputs:
- `/portal/index.html` - Portal root page
- `/portal/projects/index.html` - Projects list page (handles both list and detail views client-side)
- `/portal/dashboard/index.html` - Dashboard page
- Other portal routes as static HTML files

The projects page (`/portal/projects/index.html`) uses client-side routing to handle both:
- List view: `/portal/projects`
- Detail view: `/portal/projects/<uuid>`

## Verification Checklist

After deployment, verify the following:

### ✅ Basic Navigation
- [ ] Visiting `/portal/projects` works and shows the projects list
- [ ] Navigating from the list to a project detail (clicking a project card) works
- [ ] The URL updates to `/portal/projects/<uuid>` when viewing a project detail
- [ ] The back button returns to the projects list

### ✅ Deep Link Support
- [ ] Directly visiting `/portal/projects/<uuid>` (where `<uuid>` is a valid project ID) works
- [ ] Refreshing the page on `/portal/projects/<uuid>` works (doesn't show 404)
- [ ] The project detail view loads correctly when accessed via direct URL

### ✅ Error Handling
- [ ] Visiting `/portal/projects/invalid-id` shows a friendly "Project not found" message
- [ ] The "Back to Projects" button works from the error state
- [ ] Invalid UUIDs are properly rejected

### ✅ Static Export
- [ ] Build completes successfully with `NEXT_EXPORT=true`
- [ ] No `generateStaticParams()` functions exist for project IDs
- [ ] All portal routes are accessible without server-side rendering

### ✅ CloudFront Configuration
- [ ] CloudFront Function (Option A) or Custom Error Responses (Option B) is configured
- [ ] Deep links work without 404 errors
- [ ] Page refreshes on deep links work correctly

## Testing Locally

To test the static export locally:

```bash
# Build with static export
NEXT_EXPORT=true pnpm build

# Serve the out directory
pnpm serve out
# or
npx serve out
```

Then test the routes:
- `http://localhost:3000/portal/projects`
- `http://localhost:3000/portal/projects/<some-uuid>`

## Build Command

For production builds:

```bash
NEXT_EXPORT=true pnpm build
```

The output will be in the `out/` directory, ready to be uploaded to S3.
