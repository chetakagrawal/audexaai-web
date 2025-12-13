# Authentication Flow - Visual Guide

## 🔐 Complete Authentication Flow

```
┌─────────────┐                    ┌─────────────┐
│   Browser   │                    │   Backend   │
│  (Frontend) │                    │  (FastAPI)  │
└──────┬──────┘                    └──────┬──────┘
       │                                   │
       │  1. POST /api/v1/auth/dev-login  │
       │     { email, tenant_slug }       │
       ├─────────────────────────────────>│
       │                                   │
       │                                   │ 2. Create/Find Tenant
       │                                   │    Create/Find User
       │                                   │
       │                                   │ 3. Generate JWT Token
       │                                   │    { sub: user_id,
       │                                   │      tenant_id, role }
       │                                   │
       │  4. Response: { access_token }    │
       │<─────────────────────────────────┤
       │                                   │
       │  5. Store token in localStorage  │
       │     (auth_token)                  │
       │                                   │
       │  6. Redirect to /portal/dashboard│
       │                                   │
       │  7. GET /api/v1/me               │
       │     Header: Authorization: Bearer│
       │<─────────────────────────────────>│
       │                                   │
       │                                   │ 8. get_current_user():
       │                                   │    - Decode JWT
       │                                   │    - Load User from DB
       │                                   │    - Validate active
       │                                   │
       │  9. Response: { user data }      │
       │<─────────────────────────────────┤
       │                                   │
```

## 📁 Key Files & Their Roles

### Backend (audexaai-backend)

#### `config.py`
- **Purpose**: Configuration settings
- **Added**: `JWT_SECRET`, `JWT_ALGORITHM`
- **Why**: Secret key to sign/verify JWT tokens

#### `api/deps.py` (NEW)
- **Purpose**: FastAPI dependencies
- **Key Functions**:
  - `get_db()`: Database session dependency
  - `get_current_user()`: Authentication dependency
    - Reads `Authorization: Bearer <token>` header
    - Decodes JWT
    - Loads user from database
    - Validates user is active

#### `api/v1/auth.py` (NEW)
- **Purpose**: Authentication endpoints
- **Endpoint**: `POST /api/v1/auth/dev-login`
  - Creates/finds tenant
  - Creates/finds user
  - Generates JWT token
  - Returns token to frontend

#### `api/v1/me_stub.py` (UPDATED)
- **Before**: Returned stub data
- **After**: Uses `get_current_user` dependency
- **Returns**: Real user data from database

#### `main.py` (UPDATED)
- **Added**: CORS middleware
- **Why**: Allows frontend (localhost:3001) to make requests
- **Configuration**: Allows specific origins, credentials, all methods

### Frontend (audexaai-web)

#### `src/lib/api.ts` (NEW)
- **Purpose**: API client for backend communication
- **Key Functions**:
  - `getAuthToken()`: Gets token from localStorage
  - `setAuthToken()`: Stores token in localStorage
  - `apiRequest()`: Makes authenticated requests
    - Automatically adds `Authorization: Bearer <token>` header
  - `authApi.devLogin()`: Calls login endpoint
  - `authApi.getMe()`: Gets current user

#### `src/lib/auth.ts` (NEW)
- **Purpose**: Authentication utilities
- **Functions**:
  - `isAuthenticated()`: Checks if user is logged in
  - `logout()`: Removes token and redirects
  - `extractTenantSlugFromEmail()`: Auto-detects tenant from email

#### `src/app/login/page.tsx` (UPDATED)
- **Before**: Stub form with alerts
- **After**: 
  - Real form with state management
  - Calls `authApi.devLogin()`
  - Handles errors and loading states
  - Redirects on success

## 🔑 Key Concepts

### JWT Token Structure
```json
{
  "sub": "user-uuid",      // Standard JWT claim (subject = user_id)
  "tenant_id": "tenant-uuid",
  "role": "admin"
}
```

### Token Storage
- **Location**: Browser's `localStorage`
- **Key**: `auth_token`
- **Lifetime**: Until user logs out or clears storage

### Authentication Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Security Flow
1. **Login**: Backend validates credentials → generates signed JWT
2. **Request**: Frontend sends JWT in header
3. **Validation**: Backend decodes JWT → verifies signature → loads user
4. **Response**: Backend returns user data

## 🚀 How to Use

### Login
```typescript
import { authApi } from '@/lib/api';

await authApi.devLogin('user@example.com', 'company-name');
// Token automatically stored in localStorage
```

### Get Current User
```typescript
import { authApi } from '@/lib/api';

const user = await authApi.getMe();
// Automatically includes token in request
```

### Make Authenticated Request
```typescript
import { apiRequest } from '@/lib/api';

const data = await apiRequest('/v1/tenants');
// Token automatically included
```

### Check Authentication
```typescript
import { isAuthenticated } from '@/lib/auth';

if (!isAuthenticated()) {
  // Redirect to login
}
```

