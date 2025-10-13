# Convex Auth Implementation Plan

## Project Context

This Shadowdark GM Tools application uses:
- **Frontend**: TanStack Start with custom router configuration
- **Backend**: Convex
- **Router**: Custom setup with `ConvexProvider` wrapped in router's `Wrap` component
- **Current State**: No authentication implemented

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install @convex-dev/auth @auth/core@0.37.0
```

**What this does**: Installs the Convex Auth library and required Auth.js core package.

---

### Step 2: Initialize Convex Auth

```bash
npx @convex-dev/auth
```

**What this does**:
- Creates `convex/auth.config.ts` with authentication configuration
- Sets up necessary boilerplate code

---

### Step 3: Update Convex Schema

**File**: `convex/schema.ts`

**Changes**:
```typescript
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,  // Add this line - includes users, authSessions, authAccounts tables
  numbers: defineTable({
    value: v.number(),
  }),
  // Add custom user-related tables here as needed
});
```

**What this does**: Adds authentication tables (`users`, `authSessions`, `authAccounts`, etc.) to your database schema.

---

### Step 4: Modify Router Configuration

**File**: `src/router.tsx`

**Changes**:
```typescript
// Replace this import:
import { ConvexProvider } from 'convex/react'

// With this:
import { ConvexAuthProvider } from '@convex-dev/auth/react'

// Then in the router configuration, update the Wrap component:
Wrap: ({ children }) => (
  <ConvexAuthProvider client={convexQueryClient.convexClient}>
    {children}
  </ConvexAuthProvider>
),
```

**What this does**: Replaces the standard `ConvexProvider` with `ConvexAuthProvider` to enable authentication hooks throughout the app.

---

### Step 5: Choose Authentication Method

**Recommended**: Start with GitHub OAuth (simplest setup)

#### Option A: OAuth (GitHub) - RECOMMENDED
**Pros**:
- No email server required
- Simple setup
- Good developer experience
- Users already trust their GitHub account

**Setup**:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set callback URL to: `https://your-deployment.convex.site/api/auth/callback/github`
4. Get Client ID and Client Secret

**Environment Variables** (`.env.local`):
```
VITE_CONVEX_URL=<your-existing-url>
AUTH_GITHUB_ID=<your-client-id>
AUTH_GITHUB_SECRET=<your-client-secret>
```

#### Option B: Magic Links / OTP
**Pros**:
- Passwordless authentication
- Good user experience

**Cons**:
- Requires email server configuration
- Email delivery dependency

#### Option C: Password-Based
**Pros**:
- Traditional, familiar to users

**Cons**:
- Most complex to implement securely
- Requires email server for password recovery
- Need to handle password hashing, validation, etc.

---

### Step 6: Configure Authentication Provider

**File**: `convex/auth.config.ts` (created by `npx @convex-dev/auth`)

**Example for GitHub OAuth**:
```typescript
import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub],
});
```

---

### Step 7: Create Authentication Hooks File

**File**: `convex/auth.ts`

```typescript
import { Auth } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    // Your chosen provider(s)
  ],
});

// Helper to get current authenticated user
export const currentUser = query({
  args: {},
  returns: v.union(v.id("users"), v.null()),
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});
```

---

### Step 8: Create Sign-In UI Component

**File**: `src/components/SignIn.tsx` (new file)

```tsx
import { useAuthActions } from "@convex-dev/auth/react";

export function SignIn() {
  const { signIn } = useAuthActions();

  return (
    <button onClick={() => void signIn("github")}>
      Sign in with GitHub
    </button>
  );
}
```

---

### Step 9: Create Sign-Out Component

**File**: `src/components/SignOut.tsx` (new file)

```tsx
import { useAuthActions } from "@convex-dev/auth/react";

export function SignOut() {
  const { signOut } = useAuthActions();

  return (
    <button onClick={() => void signOut()}>
      Sign out
    </button>
  );
}
```

---

### Step 10: Create Auth Status Hook/Component

**File**: `src/components/AuthStatus.tsx` (new file)

```tsx
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut";

export function AuthStatus() {
  return (
    <>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <div>
          <p>You are signed in</p>
          <SignOut />
        </div>
      </Authenticated>
    </>
  );
}
```

---

### Step 11: Add Authentication to Backend Functions

**Example**: Protect a mutation

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createItem = mutation({
  args: { name: v.string() },
  returns: v.id("items"),
  handler: async (ctx, args) => {
    // Get authenticated user
    const userId = await ctx.auth.getUserIdentity();

    // Require authentication
    if (!userId) {
      throw new Error("Must be authenticated");
    }

    // Create item with user association
    const itemId = await ctx.db.insert("items", {
      name: args.name,
      userId: userId.subject,
      createdAt: Date.now(),
    });

    return itemId;
  },
});
```

---

### Step 12: Create Protected Routes

**File**: `src/routes/dashboard.tsx` (example)

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Authenticated, Unauthenticated } from 'convex/react'
import { SignIn } from '~/components/SignIn'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <>
      <Unauthenticated>
        <div>
          <h1>Please sign in to access the dashboard</h1>
          <SignIn />
        </div>
      </Unauthenticated>
      <Authenticated>
        <div>
          <h1>Dashboard</h1>
          {/* Protected content here */}
        </div>
      </Authenticated>
    </>
  )
}
```

---

### Step 13: Add User Profile Table (Optional)

**File**: `convex/schema.ts`

```typescript
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  // Add custom user profiles
  userProfiles: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
```

---

### Step 14: Test Authentication Flow

**Testing checklist**:
- [ ] Sign in with chosen provider (GitHub)
- [ ] Verify user appears in Convex dashboard under `users` table
- [ ] Sign out successfully
- [ ] Protected routes redirect/show sign-in when not authenticated
- [ ] Protected backend functions reject unauthenticated requests
- [ ] Authenticated backend functions work correctly
- [ ] User session persists across page refreshes

---

### Step 15: Deploy to Production

**Environment variables on Convex**:
```bash
npx convex env set AUTH_GITHUB_ID <your-client-id>
npx convex env set AUTH_GITHUB_SECRET <your-client-secret>
```

**Update OAuth callback URL** for production:
- Development: `https://your-dev-deployment.convex.site/api/auth/callback/github`
- Production: `https://your-prod-deployment.convex.site/api/auth/callback/github`

---

## Architecture Notes

### Authentication Flow
1. User clicks "Sign in with GitHub" button
2. App redirects to GitHub OAuth page
3. User authorizes the app
4. GitHub redirects back to Convex callback URL
5. Convex Auth creates/updates user in database
6. Client receives authenticated session
7. All subsequent requests include auth token

### Session Management
- Sessions stored in `authSessions` table
- Automatic session refresh
- Session expiration handling built-in

### Authorization Pattern
```typescript
// In every protected Convex function:
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  throw new Error("Unauthenticated");
}

// Use identity.subject as userId
const userId = identity.subject;
```

---

## Common Patterns

### Get Current User in Query
```typescript
export const getCurrentUser = query({
  args: {},
  returns: v.union(v.object({ ... }), v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db.get(identity.subject);
    return user;
  },
});
```

### User-Owned Resources
```typescript
// Schema
items: defineTable({
  name: v.string(),
  userId: v.id("users"),
}).index("by_userId", ["userId"]),

// Query user's items
export const myItems = query({
  args: {},
  returns: v.array(v.object({ ... })),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("items")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});
```

---

## Future Enhancements

1. **Add Multiple Auth Providers**: Google, Apple ID, etc.
2. **Email Verification**: Add magic link or OTP
3. **Role-Based Access Control**: Admin vs regular users
4. **User Profile Management**: Update display name, avatar
5. **Account Linking**: Link multiple providers to one account
6. **Session Management UI**: View/revoke active sessions
7. **Audit Logging**: Track auth events

---

## Resources

- [Convex Auth Documentation](https://labs.convex.dev/auth)
- [Convex Auth Setup Guide](https://labs.convex.dev/auth/setup)
- [Convex Auth Configuration](https://labs.convex.dev/auth/config)
- [Convex Auth Example App](https://labs.convex.dev/auth-example)
- [Auth.js Providers](https://authjs.dev/reference/core/providers)

---

## Notes

- Convex Auth is currently in **beta**
- The library is actively maintained and recommended by Convex
- No separate authentication service required (unlike Clerk, Auth0)
- All authentication logic runs in your Convex backend
- UI components are **not** provided - you build your own
- Works with React, React Native, and Next.js
