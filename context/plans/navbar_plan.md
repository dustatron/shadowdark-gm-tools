# Navigation Bar Implementation Plan

## Executive Summary

This plan outlines the implementation of a responsive navigation bar for the Shadowdark GM Tools application. The navbar will integrate with Convex Auth, TanStack Router, and shadcn/ui components to provide a seamless user experience with authentication-aware navigation.

---

## 1. Prerequisites & Dependencies

### Required shadcn/ui Components to Install

```bash
# Install dropdown-menu component
npx shadcn@latest add dropdown-menu

# Install avatar component
npx shadcn@latest add avatar

# Install separator component (for dropdown dividers)
npx shadcn@latest add separator

# Install sheet component (for mobile menu)
npx shadcn@latest add sheet
```

**Already Available:**
- button
- dialog
- card
- badge
- alert

**Note:** The avatar component will use initials fallback if no image is available, and the sheet component provides a mobile-friendly drawer for the navigation menu.

---

## 2. File Structure & Architecture

### New Files to Create

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                    # Main navbar component
│   │   ├── NavbarLinks.tsx               # Desktop navigation links
│   │   ├── UserProfileMenu.tsx           # User dropdown menu
│   │   ├── MobileMenu.tsx                # Mobile navigation drawer
│   │   └── NavbarLogo.tsx                # Logo/title component
│   └── ui/
│       ├── dropdown-menu.tsx             # NEW: shadcn dropdown
│       ├── avatar.tsx                    # NEW: shadcn avatar
│       ├── separator.tsx                 # NEW: shadcn separator
│       └── sheet.tsx                     # NEW: shadcn sheet
├── routes/
│   ├── monsters/
│   │   └── index.tsx                     # Monsters page
│   ├── spells/
│   │   └── index.tsx                     # Spells page
│   ├── profile/
│   │   └── index.tsx                     # User profile page
│   └── favorites/
│       └── index.tsx                     # User favorites page
```

### Architecture Principles

1. **Component Composition**: Break navbar into focused, reusable components
2. **Responsive Design**: Desktop-first with mobile breakpoint at 768px
3. **Authentication Awareness**: Show/hide elements based on Convex Auth state
4. **Route Integration**: Active link highlighting using TanStack Router
5. **Type Safety**: Full TypeScript coverage with proper types from Convex

---

## 3. Component Architecture

### 3.1 Component Hierarchy

```
Navbar (Container)
├── NavbarLogo (Left)
├── NavbarLinks (Center/Left - Desktop Only)
│   ├── Link: Monsters
│   └── Link: Spells
├── UserProfileMenu (Right - Desktop Only)
│   └── DropdownMenu
│       ├── Unauthenticated: SignIn
│       └── Authenticated: User Menu
│           ├── Avatar + Name (Trigger)
│           └── Dropdown Content
│               ├── Profile
│               ├── Favorites
│               ├── Separator
│               └── Sign Out
└── MobileMenu (Mobile Only)
    └── Sheet (Drawer)
        ├── NavbarLinks
        └── UserProfileMenu (Simplified)
```

### 3.2 Data Flow

```
Convex Auth State
    ↓
ConvexAuthProvider (router.tsx)
    ↓
Navbar Component
    ↓
├→ useConvexAuth() → isAuthenticated
├→ useSuspenseQuery(getCurrentUserProfile) → user data
└→ Child Components (receive props)
```

---

## 4. Detailed Implementation Steps

### Step 1: Install Required shadcn/ui Components

**Priority:** HIGH
**Estimated Time:** 5 minutes

```bash
cd /Users/dusty/Code/shadowdark/gm-tools
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add sheet
```

**Verification:** Confirm files created in `src/components/ui/`

---

### Step 2: Create Route Files

**Priority:** HIGH
**Estimated Time:** 15 minutes

Create placeholder route files for the new pages. These will be enhanced later but need to exist for navigation to work.

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/routes/monsters/index.tsx`**
```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/monsters/')({
  component: MonstersPage,
})

function MonstersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Monsters</h1>
      <p className="text-gray-600">Monster database coming soon...</p>
    </div>
  )
}
```

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/routes/spells/index.tsx`**
```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/spells/')({
  component: SpellsPage,
})

function SpellsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Spells</h1>
      <p className="text-gray-600">Spell database coming soon...</p>
    </div>
  )
}
```

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/routes/profile/index.tsx`**
```typescript
import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from '~/convex/_generated/api'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: profile } = useSuspenseQuery(
    convexQuery(api.userProfiles.getCurrentUserProfile, {})
  )

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Profile</h1>
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          {profile.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{profile.displayName}</h2>
            <p className="text-gray-500">User ID: {profile.userId}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/routes/favorites/index.tsx`**
```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/favorites/')({
  component: FavoritesPage,
})

function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Favorites</h1>
      <p className="text-gray-600">Your favorite monsters and spells will appear here...</p>
    </div>
  )
}
```

**After creating routes:** Run `npm run dev` to regenerate `routeTree.gen.ts`

---

### Step 3: Create Logo Component

**Priority:** MEDIUM
**Estimated Time:** 10 minutes

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/components/layout/NavbarLogo.tsx`**
```typescript
import { Link } from '@tanstack/react-router'

export function NavbarLogo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-gray-700 transition-colors"
    >
      {/* Optional: Add icon/logo image here */}
      <span>Shadowdark GM Tools</span>
    </Link>
  )
}
```

**Design Considerations:**
- Can add an SVG icon or image later
- Uses TanStack Router Link for client-side navigation
- Styled with Tailwind for consistency

---

### Step 4: Create Navigation Links Component

**Priority:** HIGH
**Estimated Time:** 20 minutes

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/components/layout/NavbarLinks.tsx`**
```typescript
import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '~/lib/utils'

interface NavLink {
  to: string
  label: string
}

const navLinks: NavLink[] = [
  { to: '/monsters', label: 'Monsters' },
  { to: '/spells', label: 'Spells' },
]

interface NavbarLinksProps {
  isMobile?: boolean
  onLinkClick?: () => void
}

export function NavbarLinks({ isMobile = false, onLinkClick }: NavbarLinksProps) {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <nav className={cn(
      isMobile ? 'flex flex-col gap-4' : 'flex items-center gap-6'
    )}>
      {navLinks.map((link) => {
        const isActive = currentPath.startsWith(link.to)

        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={onLinkClick}
            className={cn(
              'font-medium transition-colors',
              isMobile ? 'text-lg py-2' : 'text-sm',
              isActive
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
```

**Key Features:**
- Active link highlighting using `useRouterState()`
- Responsive styling for mobile vs desktop
- Centralized link configuration
- Optional click handler for mobile menu closure

---

### Step 5: Create User Profile Menu Component

**Priority:** HIGH
**Estimated Time:** 30 minutes

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/components/layout/UserProfileMenu.tsx`**
```typescript
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Authenticated, Unauthenticated } from 'convex/react'
import { LogOut, User, Heart } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { SignIn } from '~/components/SignIn'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '~/convex/_generated/api'

function AuthenticatedMenu() {
  const { signOut } = useAuthActions()
  const { data: profile } = useSuspenseQuery(
    convexQuery(api.userProfiles.getCurrentUserProfile, {})
  )

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const displayName = profile?.displayName || 'User'
  const avatarUrl = profile?.avatarUrl

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 h-auto"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/favorites" className="cursor-pointer flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void signOut()}
          className="cursor-pointer flex items-center gap-2 text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserProfileMenu() {
  return (
    <>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedMenu />
      </Authenticated>
    </>
  )
}
```

**Key Features:**
- Uses Convex Auth hooks for authentication state
- Fetches user profile data with `useSuspenseQuery`
- Avatar with image fallback to initials
- Dropdown menu with profile, favorites, and sign out
- Icons from lucide-react for visual clarity
- Responsive text (hidden on mobile)

---

### Step 6: Create Mobile Menu Component

**Priority:** HIGH
**Estimated Time:** 25 minutes

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/components/layout/MobileMenu.tsx`**
```typescript
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { NavbarLinks } from './NavbarLinks'
import { UserProfileMenu } from './UserProfileMenu'

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-8 mt-8">
          <NavbarLinks isMobile onLinkClick={() => setOpen(false)} />
          <div className="pt-4 border-t">
            <UserProfileMenu />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

**Key Features:**
- Sheet component for slide-in drawer
- Menu icon button (visible only on mobile)
- Controlled state for open/close
- Closes drawer when link is clicked
- Contains both navigation links and user menu

---

### Step 7: Create Main Navbar Component

**Priority:** HIGH
**Estimated Time:** 20 minutes

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/components/layout/Navbar.tsx`**
```typescript
import { NavbarLogo } from './NavbarLogo'
import { NavbarLinks } from './NavbarLinks'
import { UserProfileMenu } from './UserProfileMenu'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <NavbarLogo />
          </div>

          {/* Center/Left: Navigation Links (Desktop) */}
          <div className="hidden md:flex md:flex-1 md:justify-center md:ml-8">
            <NavbarLinks />
          </div>

          {/* Right: User Profile Menu (Desktop) */}
          <div className="hidden md:flex md:items-center">
            <UserProfileMenu />
          </div>

          {/* Mobile: Hamburger Menu */}
          <div className="flex md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Key Features:**
- Sticky positioning at top of viewport
- Semi-transparent background with backdrop blur
- Responsive layout with mobile breakpoint at 768px
- Container for content width control
- Proper z-index for dropdown menus

**Design Notes:**
- Uses `sticky` instead of `fixed` for better scroll behavior
- Backdrop blur provides modern, polished look
- Border bottom for visual separation

---

### Step 8: Integrate Navbar into Root Layout

**Priority:** HIGH
**Estimated Time:** 5 minutes

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/routes/__root.tsx`**

**Changes to make:**
```typescript
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  Outlet,
} from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import * as React from 'react'
import appCss from '~/styles/app.css?url'
import { Navbar } from '~/components/layout/Navbar'  // ADD THIS

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    // ... existing head config
  }),
  notFoundComponent: () => <div>Route not found</div>,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Navbar />  {/* ADD THIS */}
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

**Result:** Navbar will now appear on all pages above the page content.

---

### Step 9: Update Existing Pages for Layout

**Priority:** MEDIUM
**Estimated Time:** 10 minutes

Update the home page and other existing pages to ensure proper spacing below the navbar.

**File: `/Users/dusty/Code/shadowdark/gm-tools/src/routes/index.tsx`**

Add container styling to ensure content doesn't collide with navbar:
```typescript
// Wrap page content in:
<div className="container mx-auto px-4 py-8">
  {/* existing content */}
</div>
```

---

## 5. Integration Points

### 5.1 TanStack Router Integration

**Active Link Highlighting:**
```typescript
import { useRouterState } from '@tanstack/react-router'

const router = useRouterState()
const currentPath = router.location.pathname
const isActive = currentPath.startsWith('/monsters')
```

**Navigation:**
```typescript
import { Link } from '@tanstack/react-router'

<Link to="/monsters">Monsters</Link>
```

### 5.2 Convex Auth Integration

**Authentication State:**
```typescript
import { Authenticated, Unauthenticated } from 'convex/react'

<Unauthenticated>
  <SignIn />
</Unauthenticated>
<Authenticated>
  <AuthenticatedMenu />
</Authenticated>
```

**User Profile Data:**
```typescript
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '~/convex/_generated/api'

const { data: profile } = useSuspenseQuery(
  convexQuery(api.userProfiles.getCurrentUserProfile, {})
)
```

### 5.3 Styling Integration

**Tailwind CSS:**
- Uses existing Tailwind configuration
- Follows utility-first approach
- Responsive breakpoints: `md:` prefix for 768px+

**shadcn/ui:**
- Uses existing theme configuration
- Components styled with Tailwind
- `cn()` utility for conditional classes

---

## 6. Mobile Responsiveness Strategy

### Breakpoint Strategy

**Mobile (< 768px):**
- Logo on left
- Hamburger menu icon on right
- Full navigation in slide-out drawer
- Simplified user menu in drawer

**Desktop (>= 768px):**
- Logo on left
- Navigation links in center
- User profile menu on right
- Dropdown for user actions

### Mobile Menu Behavior

1. User taps hamburger icon
2. Sheet slides in from right
3. Shows navigation links vertically
4. Shows user menu below separator
5. Clicking link closes drawer
6. Clicking outside closes drawer

### Touch Targets

All interactive elements meet minimum 44x44px touch target size for mobile usability.

---

## 7. Performance Considerations

### Code Splitting

- Navbar is imported in root layout (always loaded)
- Dropdown and Sheet components are lazy-loaded by shadcn
- Route components are code-split by TanStack Start

### Optimization

1. **Avatar Images:**
   - Use fallback initials (no loading delay)
   - Lazy load avatar images from CDN

2. **Query Caching:**
   - User profile cached by React Query
   - Cache invalidation on sign out

3. **Rendering:**
   - Navbar is sticky (not re-rendered on scroll)
   - Conditional rendering for auth state
   - No unnecessary re-renders

---

## 8. Accessibility

### Keyboard Navigation

- All interactive elements keyboard accessible
- Dropdown menu keyboard navigable (arrows, enter, escape)
- Mobile menu keyboard accessible
- Focus visible on all interactive elements

### Screen Readers

- Semantic HTML elements (`<nav>`, `<button>`, etc.)
- ARIA labels where needed
- Proper heading hierarchy
- Alt text for avatar images

### Focus Management

- Focus trap in mobile drawer when open
- Focus returns to trigger on close
- Visible focus indicators

---

## 9. Testing Checklist

### Functional Testing

- [ ] Logo links to home page
- [ ] Navigation links go to correct pages
- [ ] Active link is highlighted
- [ ] Unauthenticated state shows "Sign In"
- [ ] Authenticated state shows user menu
- [ ] Profile dropdown opens/closes correctly
- [ ] Mobile menu opens/closes correctly
- [ ] Sign out works and redirects properly
- [ ] All links work in mobile menu

### Visual Testing

- [ ] Navbar appears on all pages
- [ ] Sticky behavior works on scroll
- [ ] Responsive breakpoints work
- [ ] Avatar displays correctly
- [ ] Avatar fallback initials display
- [ ] Dropdown menu aligns correctly
- [ ] Mobile drawer slides smoothly
- [ ] Active link styling is visible

### Edge Cases

- [ ] No user profile (new user)
- [ ] User with no avatar
- [ ] Long display names
- [ ] Slow network (loading states)
- [ ] Authentication errors

---

## 10. Future Enhancements

### Phase 2 Features

1. **Search Bar:**
   - Global search in navbar
   - Search monsters, spells, items
   - Keyboard shortcut (Cmd+K)

2. **Notifications:**
   - Bell icon in navbar
   - Notification dropdown
   - Badge count

3. **Theme Toggle:**
   - Dark mode switch
   - Persisted preference
   - System preference detection

4. **Breadcrumbs:**
   - Show current page context
   - Navigate up hierarchy

5. **Quick Actions:**
   - Command palette
   - Frequent actions menu

---

## 11. Code Examples

### Example 1: Using the Navbar

```typescript
// In __root.tsx
import { Navbar } from '~/components/layout/Navbar'

function RootComponent() {
  return (
    <RootDocument>
      <Navbar />
      <Outlet />
    </RootDocument>
  )
}
```

### Example 2: Creating a New Navigation Link

```typescript
// In NavbarLinks.tsx
const navLinks: NavLink[] = [
  { to: '/monsters', label: 'Monsters' },
  { to: '/spells', label: 'Spells' },
  { to: '/items', label: 'Items' }, // Add new link
]
```

### Example 3: Adding Dropdown Menu Item

```typescript
// In UserProfileMenu.tsx
<DropdownMenuItem asChild>
  <Link to="/settings" className="cursor-pointer flex items-center gap-2">
    <Settings className="h-4 w-4" />
    <span>Settings</span>
  </Link>
</DropdownMenuItem>
```

---

## 12. Implementation Timeline

### Day 1: Setup & Core Components (2-3 hours)
1. Install shadcn components (15 min)
2. Create route files (30 min)
3. Create logo component (15 min)
4. Create navigation links component (30 min)
5. Create user profile menu component (45 min)

### Day 2: Mobile & Integration (2-3 hours)
1. Create mobile menu component (45 min)
2. Create main navbar component (30 min)
3. Integrate into root layout (15 min)
4. Update existing pages (30 min)
5. Testing and refinement (60 min)

**Total Estimated Time:** 4-6 hours

---

## 13. Troubleshooting Guide

### Issue: Dropdown Menu Not Working

**Possible Causes:**
- Missing @radix-ui/react-dropdown-menu dependency
- Z-index conflict with other elements
- Missing Portal for dropdown

**Solution:**
```bash
npm install @radix-ui/react-dropdown-menu
```

### Issue: Avatar Not Displaying

**Possible Causes:**
- Invalid avatarUrl from Discord
- CORS issues with image
- Missing fallback

**Solution:**
Use fallback initials (already implemented):
```typescript
<Avatar>
  <AvatarImage src={avatarUrl} />
  <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
</Avatar>
```

### Issue: Active Link Not Highlighting

**Possible Causes:**
- Incorrect path comparison logic
- Route not matching expected pattern

**Solution:**
Check path comparison in NavbarLinks:
```typescript
const isActive = currentPath.startsWith(link.to)
// Or for exact match:
const isActive = currentPath === link.to
```

### Issue: Mobile Menu Not Closing

**Possible Causes:**
- Missing state management
- onLinkClick not firing

**Solution:**
Ensure Sheet state is controlled:
```typescript
const [open, setOpen] = useState(false)
// Pass to Sheet and links
<Sheet open={open} onOpenChange={setOpen}>
```

---

## 14. Questions & Answers

### Q1: What shadcn/ui components do we need to install?

**Answer:**
- dropdown-menu (user profile menu)
- avatar (user avatar display)
- separator (menu dividers)
- sheet (mobile drawer)

### Q2: Where should the navbar component live?

**Answer:**
`src/components/layout/` directory with the following structure:
- Navbar.tsx (main container)
- NavbarLogo.tsx (logo/title)
- NavbarLinks.tsx (navigation links)
- UserProfileMenu.tsx (user dropdown)
- MobileMenu.tsx (mobile drawer)

### Q3: How to integrate with TanStack Router for active link highlighting?

**Answer:**
Use `useRouterState()` hook to access current path, then compare with link paths:
```typescript
const router = useRouterState()
const currentPath = router.location.pathname
const isActive = currentPath.startsWith('/monsters')
```

### Q4: How to get user data from Convex Auth?

**Answer:**
Use the existing `getCurrentUserProfile` query:
```typescript
const { data: profile } = useSuspenseQuery(
  convexQuery(api.userProfiles.getCurrentUserProfile, {})
)
// Returns: { displayName, avatarUrl, ... }
```

### Q5: Should we create route files for all pages?

**Answer:**
Yes, create route files for:
- `/monsters/index.tsx` (monsters page)
- `/spells/index.tsx` (spells page)
- `/profile/index.tsx` (user profile)
- `/favorites/index.tsx` (user favorites)

Start with placeholder content and enhance later.

### Q6: How to handle responsive design?

**Answer:**
Use two-tier strategy:
1. Desktop (md: breakpoint): Full navbar with dropdown
2. Mobile (< md): Hamburger menu with Sheet drawer

Hide/show components with Tailwind classes:
```typescript
<div className="hidden md:flex">Desktop only</div>
<div className="flex md:hidden">Mobile only</div>
```

### Q7: Should the navbar be sticky/fixed?

**Answer:**
Use `sticky` positioning:
```typescript
className="sticky top-0 z-50 ..."
```

Benefits:
- Stays at top when scrolling down
- Better than `fixed` for layout flow
- No need to add padding to body
- Works with page scroll naturally

---

## 15. Success Criteria

The navbar implementation is successful when:

1. **Functionality:**
   - All navigation links work correctly
   - Authentication state properly reflected
   - User profile data displays correctly
   - Mobile menu opens/closes smoothly
   - Sign in/out flow works

2. **Design:**
   - Consistent with app styling
   - Responsive on all screen sizes
   - Smooth animations and transitions
   - Proper spacing and alignment
   - Active link clearly visible

3. **Performance:**
   - No unnecessary re-renders
   - Fast initial load
   - Smooth scroll behavior
   - No layout shift

4. **Accessibility:**
   - Keyboard navigable
   - Screen reader friendly
   - Proper focus management
   - ARIA labels where needed

5. **Code Quality:**
   - Type-safe (no TypeScript errors)
   - Well-organized components
   - Reusable and maintainable
   - Follows project conventions

---

## 16. Next Steps After Implementation

1. **User Testing:**
   - Test with real Discord OAuth flow
   - Verify avatar loading from Discord
   - Test on various devices

2. **Enhancement Opportunities:**
   - Add search functionality
   - Implement notifications
   - Add dark mode toggle
   - Create admin-only links

3. **Documentation:**
   - Add JSDoc comments to components
   - Create component usage guide
   - Document customization options

4. **Monitoring:**
   - Track navigation analytics
   - Monitor performance metrics
   - Gather user feedback

---

## Conclusion

This plan provides a comprehensive roadmap for implementing a production-ready navigation bar for the Shadowdark GM Tools application. The implementation follows React 19 best practices, integrates seamlessly with Convex Auth and TanStack Router, and provides an excellent user experience on both desktop and mobile devices.

The modular component architecture ensures maintainability and extensibility, while the type-safe approach prevents runtime errors and improves developer experience.

Total estimated implementation time: 4-6 hours for a complete, polished navigation system.
