# shadcn/ui Integration Plan

## Executive Summary

This plan outlines the integration of shadcn/ui into the Shadowdark GM Tools project. Since we're using **TailwindCSS 4** (latest version), we need special configuration steps that differ from the standard shadcn/ui documentation.

**Tech Stack:**
- TanStack Start (React 19)
- Vite
- TailwindCSS 4 (uses CSS-based config, not `tailwind.config.js`)
- TypeScript (strict mode)
- Convex backend
- Path alias: `~/*` → `src/*`

**Timeline:** 1-2 days for full implementation

---

## Phase 1: TailwindCSS 4 Official Support ✅

### Good News!
shadcn/ui now officially supports Tailwind v4! This makes integration much simpler.

### Key Features in Tailwind v4
- Uses `@import 'tailwindcss'` instead of `@tailwind` directives
- Configuration lives in CSS via `@theme` instead of `tailwind.config.js`
- Uses the new `@tailwindcss/vite` plugin
- New utilities like `size-*` replace `w-* h-*` combinations

### shadcn/ui with Tailwind v4
- Use the **canary CLI** version: `npx shadcn@canary`
- CSS variables use full HSL format: `hsl(0 0% 100%)`
- Use `@theme inline` directive to map variables to Tailwind colors
- Components work seamlessly with React 19 + Tailwind v4

**Official Documentation:** https://ui.shadcn.com/docs/tailwind-v4

---

## Phase 2: Installation Steps

### Step 1: Install Required Dependencies

```bash
npm install class-variance-authority clsx tailwind-merge
npm install -D @tailwindcss/typography
```

**Package purposes:**
- `class-variance-authority`: Enables component variants (core to shadcn/ui)
- `clsx`: Conditional className utility
- `tailwind-merge`: Intelligently merges Tailwind classes, prevents conflicts
- `@tailwindcss/typography`: Useful for rich text content in GM tools

### Step 2: Initialize shadcn/ui with Canary CLI

Use the canary version of the CLI for Tailwind v4 + React 19 support:

```bash
npx shadcn@canary init
```

**During initialization, answer prompts:**
- **TypeScript:** Yes
- **Style:** Default (or your preference)
- **Base color:** Slate
- **CSS variables:** Yes
- **React Server Components:** No
- **Components location:** `./src/components/ui`
- **Utils location:** `./src/lib/utils`
- **Path aliases:** Use `~/*` (already configured)

This will create `components.json` automatically:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/app.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "~/components",
    "ui": "~/components/ui",
    "utils": "~/lib/utils",
    "hooks": "~/hooks",
    "lib": "~/lib"
  }
}
```

#### B. Create Utility Function

**File:** `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This `cn()` utility is used by all shadcn components for className merging.

#### C. Update `app.css` for Tailwind v4

**File:** `src/styles/app.css`

Update with Tailwind v4 theme variables (note the full HSL format and `@theme inline`):

```css
@import 'tailwindcss';

/* shadcn/ui theme variables for Tailwind v4 */
@layer base {
  :root {
    --background: hsl(0 0% 100%);
    --foreground: hsl(222.2 84% 4.9%);
    --card: hsl(0 0% 100%);
    --card-foreground: hsl(222.2 84% 4.9%);
    --popover: hsl(0 0% 100%);
    --popover-foreground: hsl(222.2 84% 4.9%);
    --primary: hsl(222.2 47.4% 11.2%);
    --primary-foreground: hsl(210 40% 98%);
    --secondary: hsl(210 40% 96.1%);
    --secondary-foreground: hsl(222.2 47.4% 11.2%);
    --muted: hsl(210 40% 96.1%);
    --muted-foreground: hsl(215.4 16.3% 46.9%);
    --accent: hsl(210 40% 96.1%);
    --accent-foreground: hsl(222.2 47.4% 11.2%);
    --destructive: hsl(0 84.2% 60.2%);
    --destructive-foreground: hsl(210 40% 98%);
    --border: hsl(214.3 31.8% 91.4%);
    --input: hsl(214.3 31.8% 91.4%);
    --ring: hsl(222.2 84% 4.9%);
    --radius: 0.5rem;
    --chart-1: hsl(12 76% 61%);
    --chart-2: hsl(173 58% 39%);
    --chart-3: hsl(197 37% 24%);
    --chart-4: hsl(43 74% 66%);
    --chart-5: hsl(27 87% 67%);
  }

  .dark {
    --background: hsl(222.2 84% 4.9%);
    --foreground: hsl(210 40% 98%);
    --card: hsl(222.2 84% 4.9%);
    --card-foreground: hsl(210 40% 98%);
    --popover: hsl(222.2 84% 4.9%);
    --popover-foreground: hsl(210 40% 98%);
    --primary: hsl(210 40% 98%);
    --primary-foreground: hsl(222.2 47.4% 11.2%);
    --secondary: hsl(217.2 32.6% 17.5%);
    --secondary-foreground: hsl(210 40% 98%);
    --muted: hsl(217.2 32.6% 17.5%);
    --muted-foreground: hsl(215 20.2% 65.1%);
    --accent: hsl(217.2 32.6% 17.5%);
    --accent-foreground: hsl(210 40% 98%);
    --destructive: hsl(0 62.8% 30.6%);
    --destructive-foreground: hsl(210 40% 98%);
    --border: hsl(217.2 32.6% 17.5%);
    --input: hsl(217.2 32.6% 17.5%);
    --ring: hsl(212.7 26.8% 83.9%);
    --chart-1: hsl(220 70% 50%);
    --chart-2: hsl(160 60% 45%);
    --chart-3: hsl(30 80% 55%);
    --chart-4: hsl(280 65% 60%);
    --chart-5: hsl(340 75% 55%);
  }
}

/* Map CSS variables to Tailwind colors using @theme inline */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

@layer base {
  html,
  body {
    @apply bg-background text-foreground;
  }

  * {
    @apply border-border;
  }
}
```

**Key Differences for Tailwind v4:**
- CSS variables use full `hsl()` format
- `@theme inline` directive maps variables to Tailwind colors
- Cleaner separation of concerns

### Step 3: Verify Setup

```bash
npm run build
```

Ensure no errors, then:

```bash
npm run dev
```

---

## Phase 3: Component Installation Priority

### First Wave: Core UI Components (Install First)

Essential components for immediate use:

```bash
# Use canary version for Tailwind v4 support
# Form components
npx shadcn@canary add button
npx shadcn@canary add input
npx shadcn@canary add label
npx shadcn@canary add textarea
npx shadcn@canary add select

# Layout components
npx shadcn@canary add card
npx shadcn@canary add separator
npx shadcn@canary add tabs

# Feedback components
npx shadcn@canary add dialog
npx shadcn@canary add alert
npx shadcn@canary add toast
npx shadcn@canary add badge

# Data display
npx shadcn@canary add table
npx shadcn@canary add avatar
```

**Why these first:**
- Forms are critical for data entry (characters, monsters, campaigns)
- Cards for organizing content
- Dialogs for confirmations and modals
- Tables for displaying lists
- Toast for user feedback

### Second Wave: Advanced Components

```bash
# Navigation
npx shadcn@canary add navigation-menu
npx shadcn@canary add dropdown-menu
npx shadcn@canary add sheet

# Advanced inputs
npx shadcn@canary add checkbox
npx shadcn@canary add radio-group
npx shadcn@canary add switch
npx shadcn@canary add slider

# Data entry
npx shadcn@canary add form
npx shadcn@canary add popover
npx shadcn@canary add command

# Rich display
npx shadcn@canary add accordion
npx shadcn@canary add collapsible
npx shadcn@canary add scroll-area
```

### Third Wave: Specialty Components (As Needed)

```bash
# Advanced features
npx shadcn@canary add calendar
npx shadcn@canary add context-menu
npx shadcn@canary add tooltip
npx shadcn@canary add progress
npx shadcn@canary add skeleton
```

---

## Phase 4: File Structure

### Recommended Organization

```
/Users/dusty/Code/shadowdark/gm-tools/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── auth/            # Auth components
│   │   │   ├── AuthStatus.tsx
│   │   │   ├── SignIn.tsx
│   │   │   └── SignOut.tsx
│   │   └── ...              # Custom composed components
│   ├── lib/
│   │   └── utils.ts         # cn() utility
│   ├── hooks/               # Custom hooks (create as needed)
│   │   └── use-toast.ts     # Toast hook (auto-generated)
│   ├── styles/
│   │   └── app.css          # Global styles + shadcn variables
│   └── routes/
└── components.json          # shadcn config
```

### Organization Guidelines

- **`src/components/ui/`**: Raw shadcn components (DON'T edit these directly)
- **`src/components/`**: Your custom composed components that use shadcn primitives
- **Example**: Create `src/components/CharacterCard.tsx` that uses `Card`, `Button`, etc.
- **Organize by feature**: Consider `src/components/characters/`, `src/components/monsters/`, etc.

---

## Phase 5: Integration Patterns with Convex

### Pattern 1: Forms with Mutations

```typescript
// Example: Create Character Form
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useMutation } from "convex/react"
import { api } from "convex/_generated/api"
import { useState } from "react"

export function CreateCharacterForm() {
  const [name, setName] = useState("")
  const createCharacter = useMutation(api.characters.create)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createCharacter({ name })
    setName("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Character Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter character name"
        />
      </div>
      <Button type="submit">Create Character</Button>
    </form>
  )
}
```

### Pattern 2: Data Tables with Queries

```typescript
// Example: Character List Table
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useSuspenseQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "convex/_generated/api"

export function CharacterList() {
  const { data: characters } = useSuspenseQuery(
    convexQuery(api.characters.list, {})
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Characters</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Class</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {characters.map((character) => (
              <TableRow key={character._id}>
                <TableCell>{character.name}</TableCell>
                <TableCell>{character.level}</TableCell>
                <TableCell>{character.class}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
```

### Pattern 3: Dialogs with Mutations

```typescript
// Example: Delete Confirmation Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "convex/_generated/api"
import { useState } from "react"
import type { Id } from "convex/_generated/dataModel"

interface DeleteCharacterDialogProps {
  characterId: Id<"characters">
  characterName: string
}

export function DeleteCharacterDialog({
  characterId,
  characterName
}: DeleteCharacterDialogProps) {
  const [open, setOpen] = useState(false)
  const deleteCharacter = useMutation(api.characters.remove)

  const handleDelete = async () => {
    await deleteCharacter({ id: characterId })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Character</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete {characterName}?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Pattern 4: Toast Notifications

First, set up the Toaster in your root layout:

```typescript
// src/routes/__root.tsx
import { Toaster } from "~/components/ui/toaster"

export function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
```

Then use in components:

```typescript
// Example: Add Item with Toast Feedback
import { useToast } from "~/hooks/use-toast"
import { useMutation } from "convex/react"
import { api } from "convex/_generated/api"
import { Button } from "~/components/ui/button"

export function AddItemButton() {
  const { toast } = useToast()
  const addItem = useMutation(api.items.add)

  const handleAdd = async () => {
    try {
      await addItem({ name: "New Item" })
      toast({
        title: "Success",
        description: "Item added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      })
    }
  }

  return <Button onClick={handleAdd}>Add Item</Button>
}
```

### Pattern 5: Loading States with Skeleton

```typescript
// Example: Character List with Loading State
import { Skeleton } from "~/components/ui/skeleton"
import { Suspense } from "react"
import { CharacterList } from "~/components/CharacterList"

function CharacterListSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

export function CharacterPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Characters</h1>
      <Suspense fallback={<CharacterListSkeleton />}>
        <CharacterList />
      </Suspense>
    </div>
  )
}
```

---

## Phase 6: Step-by-Step Implementation

### Day 1: Foundation Setup (1-2 hours)

**Tasks:**
1. ✅ Install base dependencies
   ```bash
   npm install class-variance-authority clsx tailwind-merge
   npm install -D @tailwindcss/typography
   ```

2. ✅ Create `components.json` (manual file creation)

3. ✅ Create `src/lib/utils.ts` with `cn()` function

4. ✅ Update `src/styles/app.css` with shadcn theme variables

5. ✅ Test build: `npm run build`

6. ✅ Restart dev server: `npm run dev`

7. ✅ Verify no console errors in browser

### Day 2: Core Components (2-3 hours)

**Tasks:**
1. ✅ Install first wave components:
   ```bash
   npx shadcn@canary add button input label card dialog alert badge
   ```

2. ✅ Verify components are in `src/components/ui/`

3. ✅ Create test page: `src/routes/test-shadcn.tsx` (see example below)

4. ✅ Visit `/test-shadcn` and verify components render

5. ✅ Test dark mode toggle

6. ✅ Test all button variants

### Day 3: Form Integration (2-3 hours)

**Tasks:**
1. ✅ Install form-related components:
   ```bash
   npx shadcn@canary add form select textarea checkbox
   ```

2. ✅ Create sample form component with Convex mutation

3. ✅ Test form submission

4. ✅ Add validation (if needed)

5. ✅ Add loading states

### Day 4: Data Display (2-3 hours)

**Tasks:**
1. ✅ Install data components:
   ```bash
   npx shadcn@canary add table tabs separator scroll-area
   ```

2. ✅ Convert existing data display to use shadcn Table

3. ✅ Create reusable table component patterns

4. ✅ Add sorting/filtering (if needed)

### Day 5: Toast & Navigation (2-3 hours)

**Tasks:**
1. ✅ Install toast and navigation:
   ```bash
   npx shadcn@canary add toast dropdown-menu navigation-menu
   ```

2. ✅ Add `<Toaster />` to `__root.tsx`

3. ✅ Create toast notification patterns for mutations

4. ✅ Build navigation components

5. ✅ Test error handling with toasts

### Day 6: Refactoring (3-4 hours)

**Tasks:**
1. ✅ Refactor existing auth components (SignIn, SignOut, AuthStatus)

2. ✅ Create composed components for GM tools:
   - CharacterCard
   - MonsterCard
   - SpellCard
   - DiceRoller (if applicable)

3. ✅ Update any custom styles to work with shadcn

4. ✅ Remove old/redundant styling code

### Day 7: Polish & Documentation (2-3 hours)

**Tasks:**
1. ✅ Install any remaining components as needed

2. ✅ Create internal component documentation

3. ✅ Create component showcase page for team reference

4. ✅ Optimize bundle size (tree-shaking check)

5. ✅ Run final build and verify no errors

6. ✅ Update README if needed

---

## Phase 7: Testing Your Setup

### Quick Smoke Test Page

Create this file to verify shadcn/ui is working:

**File:** `src/routes/test-shadcn.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"

export const Route = createFileRoute('/test-shadcn')({
  component: TestShadcn,
})

function TestShadcn() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">shadcn/ui Test Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>Component Testing</CardTitle>
          <CardDescription>
            Verify all shadcn/ui components render correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div className="space-y-2">
            <h3 className="font-semibold">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-2">
            <h3 className="font-semibold">Input</h3>
            <div className="space-y-2">
              <Label htmlFor="test">Test Input</Label>
              <Input id="test" placeholder="Type something..." />
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <h3 className="font-semibold">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Test Steps:**
1. Visit `http://localhost:3000/test-shadcn`
2. Verify all components render without errors
3. Check console for any warnings
4. Toggle dark mode and verify colors change
5. Interact with buttons and inputs
6. Verify hover states work

---

## Phase 8: Best Practices

### 1. Component Composition (DON'T Modify shadcn Components)

❌ **Bad - Editing shadcn components directly:**
```typescript
// Don't do this in src/components/ui/button.tsx
export function Button() {
  // Adding custom logic here
}
```

✅ **Good - Compose new components:**
```typescript
// Create src/components/IconButton.tsx
import { Button } from "~/components/ui/button"
import { type LucideIcon } from "lucide-react"

interface IconButtonProps extends React.ComponentProps<typeof Button> {
  icon: LucideIcon
  children: React.ReactNode
}

export function IconButton({ icon: Icon, children, ...props }: IconButtonProps) {
  return (
    <Button {...props}>
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  )
}
```

### 2. Type Safety with Convex

```typescript
import { Doc, Id } from "convex/_generated/dataModel"
import { Button } from "~/components/ui/button"

interface CharacterActionsProps {
  character: Doc<"characters">
  onEdit: (id: Id<"characters">) => void
}

export function CharacterActions({ character, onEdit }: CharacterActionsProps) {
  return (
    <Button onClick={() => onEdit(character._id)}>
      Edit
    </Button>
  )
}
```

### 3. Error Handling

```typescript
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ErrorAlert({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}
```

### 4. Dark Mode Toggle

```typescript
// src/components/ThemeToggle.tsx
import { Button } from "~/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}
```

---

## Phase 9: Common Issues & Solutions

### Issue 1: Components Not Found

**Error:** `Cannot find module '~/components/ui/button'`

**Solution:**
- Verify component was installed: `npx shadcn@latest add button`
- Check `src/components/ui/button.tsx` exists
- Restart TypeScript server in IDE
- Check `tsconfig.json` has path alias configured

### Issue 2: CSS Variables Not Applied

**Error:** Components render but colors are wrong

**Solution:**
- Ensure `app.css` is imported in `__root.tsx`
- Verify CSS variables are in `app.css` under `:root` and `.dark`
- Check browser DevTools to see if variables are defined
- Clear browser cache and restart dev server

### Issue 3: Build Errors

**Error:** TypeScript errors during build

**Solution:**
```bash
npm install -D @types/react @types/react-dom
```

Ensure `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "types": ["vite/client", "node"]
  }
}
```

### Issue 4: Tailwind Classes Not Working

**Error:** Some Tailwind classes don't apply styles

**Solution:**
- Tailwind v4 may have renamed some utilities
- Check Tailwind v4 documentation for class name changes
- Most common classes are backwards compatible
- If a specific class doesn't work, check the v4 migration guide

### Issue 5: Dark Mode Not Working

**Error:** Dark mode colors don't change

**Solution:**
- Add `dark` class to `<html>` element when toggling
- Verify `.dark` CSS variables are defined in `app.css`
- Check that `html` element gets the `dark` class in browser DevTools
- Ensure shadcn components use CSS variables, not hardcoded colors

---

## Phase 10: GM Tools Specific Components

### Recommended Custom Components to Build

#### 1. CharacterCard
```typescript
// src/components/characters/CharacterCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import type { Doc } from "convex/_generated/dataModel"

interface CharacterCardProps {
  character: Doc<"characters">
  onEdit: () => void
  onDelete: () => void
}

export function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{character.name}</CardTitle>
          <Badge>{character.class}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Level {character.level}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={onEdit}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

#### 2. DiceRoller
```typescript
// src/components/dice/DiceRoller.tsx
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useState } from "react"

export function DiceRoller() {
  const [result, setResult] = useState<number | null>(null)

  const roll = (sides: number) => {
    const rolled = Math.floor(Math.random() * sides) + 1
    setResult(rolled)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dice Roller</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => roll(4)}>d4</Button>
            <Button onClick={() => roll(6)}>d6</Button>
            <Button onClick={() => roll(8)}>d8</Button>
            <Button onClick={() => roll(10)}>d10</Button>
            <Button onClick={() => roll(12)}>d12</Button>
            <Button onClick={() => roll(20)}>d20</Button>
          </div>
          {result !== null && (
            <div className="text-center">
              <p className="text-4xl font-bold">{result}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

#### 3. MonsterStatBlock
```typescript
// src/components/monsters/MonsterStatBlock.tsx
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import type { Doc } from "convex/_generated/dataModel"

interface MonsterStatBlockProps {
  monster: Doc<"monsters">
}

export function MonsterStatBlock({ monster }: MonsterStatBlockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{monster.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {monster.type} • CR {monster.challengeRating}
        </p>
        <Separator />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-semibold">AC:</span> {monster.armorClass}
          </div>
          <div>
            <span className="font-semibold">HP:</span> {monster.hitPoints}
          </div>
          <div>
            <span className="font-semibold">Speed:</span> {monster.speed}
          </div>
        </div>
        <Separator />
        <p className="text-sm">{monster.description}</p>
      </CardContent>
    </Card>
  )
}
```

---

## Implementation Checklist

### Setup Phase
- [ ] Install dependencies (`class-variance-authority`, `clsx`, `tailwind-merge`)
- [ ] Create `components.json`
- [ ] Create `src/lib/utils.ts`
- [ ] Update `src/styles/app.css` with theme variables
- [ ] Run `npm run build` to verify no errors
- [ ] Restart dev server

### Component Installation Phase
- [ ] Install button, input, label, card
- [ ] Install dialog, alert, toast, badge
- [ ] Install table, tabs, separator
- [ ] Install form components (select, textarea, checkbox)
- [ ] Install navigation components
- [ ] Install skeleton, progress, tooltip (as needed)

### Integration Phase
- [ ] Create test page (`/test-shadcn`)
- [ ] Verify all components render
- [ ] Test dark mode
- [ ] Create example form with Convex mutation
- [ ] Create example table with Convex query
- [ ] Add `<Toaster />` to root layout
- [ ] Test toast notifications

### Refactoring Phase
- [ ] Refactor existing auth components
- [ ] Create CharacterCard component
- [ ] Create MonsterCard component
- [ ] Create DiceRoller component (if needed)
- [ ] Update styling to use shadcn patterns
- [ ] Remove redundant custom styles

### Documentation Phase
- [ ] Document component patterns
- [ ] Create component showcase page
- [ ] Update README if needed
- [ ] Add comments for complex components

### Final Verification
- [ ] Run `npm run build` - no errors
- [ ] Test all pages in dev mode
- [ ] Test authentication flow with new components
- [ ] Verify dark mode works everywhere
- [ ] Test responsive design
- [ ] Check bundle size

---

## Timeline Estimate

- **Setup:** 1-2 hours
- **Core Components:** 2-3 hours
- **Integration:** 3-4 hours
- **Refactoring:** 3-4 hours
- **Testing & Polish:** 2-3 hours

**Total:** 1-2 full days of development

---

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [Convex Documentation](https://docs.convex.dev)
- [TanStack Start Documentation](https://tanstack.com/start)
- [Radix UI Documentation](https://www.radix-ui.com) (shadcn/ui is built on Radix)

---

## Notes

- shadcn/ui components are **copied into your project**, not installed as a package
- This means you own the code and can customize freely
- Updates require manually re-running the CLI to update individual components
- The components are built on Radix UI primitives (unstyled, accessible)
- All components use TailwindCSS for styling
- CSS variables enable easy theming without touching component code
