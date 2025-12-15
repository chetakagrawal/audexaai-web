# AudexaAI Web Application

Next.js frontend application for AudexaAI, deployed as a static site to S3 + CloudFront.

## Features

- Static export for optimal performance
- Client-side routing for deep links (no pre-generated routes)
- Supports dynamic routes like `/portal/projects/<uuid>`, `/portal/controls/<uuid>`, etc.
- Scalable architecture for adding new entity detail pages

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **React**
- **Tailwind CSS**
- **pnpm** (package manager)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production (static export)
pnpm build:export

# Test static export locally
pnpm test:export
```

## Development

### Running Locally

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

**Note:** In dev mode, clicking on dynamic routes (like project details) may show 404 errors. This is expected - Next.js tries to match routes to files. Test the actual functionality using the static export build (`pnpm test:export`).

### Project Structure

```
src/
├── app/
│   ├── portal/
│   │   ├── projects/
│   │   │   └── page.tsx      # Handles both list and detail views
│   │   ├── controls/
│   │   ├── applications/
│   │   └── ...
│   └── ...
├── components/
└── lib/
    └── api/                   # API client modules
```

### Client-Side Routing Pattern

The application uses client-side routing for entity detail pages. Each route (projects, controls, etc.) has a single `page.tsx` that:

1. Uses `usePathname()` to detect if viewing list or detail
2. Extracts entity ID from URL path
3. Renders appropriate view (list or detail) based on pathname

**Example:** `/portal/projects/page.tsx` handles both:
- List view: `/portal/projects`
- Detail view: `/portal/projects/<uuid>`

This pattern is scalable - add new entity types by creating `portal/<entity>/page.tsx` following the same pattern.

## Deployment

### Build for Production

```bash
# Build static export
NEXT_EXPORT=true pnpm build

# Output will be in the `out/` directory
```

### CloudFront Function Configuration (Required)

**IMPORTANT:** Deep links require CloudFront configuration to work in production.

The application uses client-side routing, so URLs like `/portal/projects/<uuid>` don't have corresponding static files. CloudFront must be configured to rewrite these requests.

#### Step-by-Step CloudFront Setup

1. **Go to AWS CloudFront Console** → Select your distribution

2. **Create CloudFront Function:**
   - Navigate to **Functions** → **Create function**
   - Name: `portal-routing-rewrite`
   - Paste the function code (see below)

3. **Function Code:**
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

4. **Publish the Function:**
   - Click **Publish** after saving

5. **Associate with Distribution:**
   - Go to your distribution → **Behaviors** tab
   - Edit the behavior (usually default `*`)
   - Scroll to **Function associations**
   - Under **Viewer request**, select **CloudFront Function**
   - Choose `portal-routing-rewrite`
   - Save changes

6. **Wait for Deployment:**
   - Changes take 5-15 minutes to propagate
   - Status will show "Deploying..." then "Deployed"

#### How It Works

The CloudFront Function automatically rewrites:
- `/portal/projects/<uuid>` → `/portal/projects/index.html`
- `/portal/controls/<uuid>` → `/portal/controls/index.html`
- `/portal/applications/<uuid>` → `/portal/applications/index.html`
- Any `/portal/<route>/<uuid>` → `/portal/<route>/index.html`

The client-side router then handles displaying the correct view based on the URL.

#### Alternative: Custom Error Responses

If CloudFront Functions aren't available, use Custom Error Responses:
1. Distribution → **Error Pages**
2. Create error response for **404**:
   - Response page path: `/portal/index.html`
   - HTTP response code: **200**
   - Error caching TTL: **0**
3. Repeat for **403** errors

**Note:** This approach is slower (requires 404 first) but works if Functions aren't an option.

### Deploy to S3

Upload the `out/` directory contents to your S3 bucket:

```bash
# Using AWS CLI
aws s3 sync out/ s3://your-bucket-name --delete

# Or use your existing deployment script
./deploy.sh
```

## Architecture Notes

### Why Client-Side Routing?

- **No pre-generation needed:** Don't need to know all entity IDs at build time
- **Scalable:** Works for any number of entities (projects, controls, etc.)
- **Fast:** No server-side rendering required
- **Simple:** One CloudFront Function handles all routes

### Adding New Entity Types

To add a new entity detail page (e.g., `/portal/test-attributes/<uuid>`):

1. Create `src/app/portal/test-attributes/page.tsx`
2. Follow the same pattern as `projects/page.tsx`:
   - Use `usePathname()` to detect list vs detail
   - Extract ID from URL
   - Render appropriate view
3. **No CloudFront changes needed** - the function already handles it!

## Testing

### Verification Checklist

After deployment, verify:

- [ ] Visiting `/portal/projects` shows the list
- [ ] Clicking a project navigates to detail view
- [ ] URL updates to `/portal/projects/<uuid>`
- [ ] Refreshing on detail page works (no 404)
- [ ] Direct deep link access works
- [ ] Invalid IDs show "not found" message

### Local Testing

```bash
# Test static export
pnpm build:export
pnpm serve:export

# Then test:
# http://localhost:3000/portal/projects
# http://localhost:3000/portal/projects/<some-uuid>
```

## Troubleshooting

### 404 Errors on Deep Links

- **Check CloudFront Function:** Ensure it's associated with Viewer Request
- **Clear Cache:** Create invalidation for `/*` in CloudFront
- **Verify Function Code:** Check function logs in CloudWatch

### Dev Mode 404s

404s in dev mode when clicking entities are expected. Test with static export build instead.

## Additional Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions and CloudFront configuration.
