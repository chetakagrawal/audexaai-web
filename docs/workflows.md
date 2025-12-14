# Frontend Workflows Documentation

This document describes the key user workflows implemented in the Audexa AI frontend application.

---

## Workflow 1: User Signup (Join Pilot)

### Overview
When a user clicks "Join Free Pilot" from various entry points (landing page, header, login page), they are guided through a 2-step signup process that creates a signup request in the backend with a "pending review" status.

### Entry Points
Users can initiate this workflow from:
- Landing page: "Join Free Pilot" button (Hero section, Waitlist section, Pilot Pricing section)
- Header navigation: "Join Free Pilot" button
- Login page: "Join Free Pilot" link
- Other pages: Various "Join Pilot" links throughout the application

### Flow Steps

#### Step 1: Navigate to Signup Page
1. User clicks "Join Free Pilot" button/link
2. Navigation: Redirects to `/pilot/` route
3. Page: `src/app/pilot/page.tsx`
4. Component: Renders `PilotSignupForm` component

#### Step 2: Email Entry (Step 1 of Form)
1. User enters email address
2. Client-side validation:
   - Email format validation (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
   - Required field check
   - Real-time validation on blur
3. Form state: Stores email in `formData.email`
4. UI: Shows inline error if validation fails
5. User clicks "Continue" button

#### Step 3: Additional Information (Step 2 of Form)
1. User can optionally provide:
   - Full Name (optional)
   - Company Name (optional, if not individual)
   - Individual toggle: User can mark themselves as an individual (not part of a company)
2. Auth mode selection:
   - If company name is provided: User can check "Request SSO authentication for my company"
   - If checked: `requested_auth_mode` = `'sso'`
   - If unchecked or individual: `requested_auth_mode` = `'direct'`
3. Email confirmation: Displays the email entered in step 1 (read-only)
4. User clicks "Join Pilot" button

#### Step 4: Form Submission
1. Frontend prepares signup data:
   ```typescript
   {
     email: string (trimmed, lowercased),
     full_name?: string (if provided),
     company_name?: string (if company, not individual),
     company_domain?: string (extracted from email domain if not individual),
     requested_auth_mode?: 'sso' | 'direct'
   }
   ```
2. API call: `signupApi.createSignup(signupData)`
   - Endpoint: `POST /api/v1/signups`
   - Method: Uses `apiRequest()` helper from `src/lib/api.ts`
   - Request body: JSON containing signup data
3. Backend processing:
   - Creates record in `signups` table
   - Sets status to `"pending_review"`
   - Stores all provided information
   - Returns: `{ id: string, status: string }`

#### Step 5: Success State
1. On successful API response:
   - Shows success message
   - Displays: "Welcome to the Pilot!" with thank you message
   - Shows email address where confirmation will be sent
   - Option to "Submit another application"
2. User is informed they will receive next steps via email

### Error Handling

#### Client-Side Validation Errors
- Email format: "Please enter a valid email address"
- Required field: "Email is required"
- Displayed inline below the input field

#### API Errors
- Network errors: "Network error. Please check your connection and try again."
- Backend connection: "Cannot connect to backend. Make sure the backend is running."
- Invalid email: "Invalid email address. Please check and try again."
- Generic errors: Error message from backend or "Something went wrong. Please try again."
- Displayed in red banner at top of form

### User Experience Features
1. **Progress Indicator**: Visual step indicator (1 of 2, 2 of 2)
2. **Inline Validation**: Real-time feedback on email format
3. **Back Navigation**: User can go back to step 1 from step 2
4. **Individual Toggle**: Easy way to indicate not part of a company
5. **Auth Mode Selection**: Clear checkbox for SSO request (only shown for companies)
6. **Email Confirmation**: Displays email in step 2 for verification
7. **Loading States**: Button shows "Joining..." with spinner during submission
8. **Success Feedback**: Clear confirmation with next steps
9. **Privacy Note**: "No spam. Unsubscribe anytime. We respect your privacy."

### Next Steps (After Signup)
1. User's signup record is created with `status: "pending_review"` in backend
2. Admin reviews the signup request via admin panel
3. Admin can approve or reject the signup
4. If approved and SSO was requested:
   - User receives email with setup token link
   - User completes SSO onboarding flow
5. If approved and direct auth was requested:
   - User can use direct login immediately

### Related Workflows
- **SSO Onboarding**: If `requested_auth_mode: 'sso'`, user will go through SSO setup after approval
- **Admin Approval**: Admin reviews and approves/rejects signup (backend/admin workflow)
- **Direct Login**: If `requested_auth_mode: 'direct'`, user can login directly after approval

---

## Additional Workflows

_More workflows will be documented here as they are implemented._
