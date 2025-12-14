# API Client Usage

## Setup

1. Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_DEV_MODE=true  # Set to 'true' to bypass login/auth when backend is not available
```

2. For production, update the URL to your deployed backend.

## Authentication

### Login

```typescript
import { authApi } from '@/lib/api';

// Login with email and tenant slug
const response = await authApi.devLogin('user@example.com', 'company-name');
// Token is automatically stored in localStorage
```

### Get Current User

```typescript
import { authApi } from '@/lib/api';

// Get current authenticated user
const user = await authApi.getMe();
console.log(user.email, user.name, user.role);
```

### Logout

```typescript
import { authApi } from '@/lib/api';

authApi.logout();
```

## Making Authenticated API Calls

```typescript
import { apiRequest } from '@/lib/api';

// The token is automatically included in the Authorization header
const data = await apiRequest('/v1/tenants');
const users = await apiRequest('/v1/users');
```

## Check Authentication Status

```typescript
import { isAuthenticated, logout } from '@/lib/auth';

if (!isAuthenticated()) {
  // Redirect to login
  window.location.href = '/login/';
}
```

## Example: Protected Component

```typescript
'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login/');
      return;
    }

    // Fetch user data
    authApi.getMe()
      .then(setUser)
      .catch(() => router.push('/login/'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Welcome, {user.name}!</div>;
}
```

