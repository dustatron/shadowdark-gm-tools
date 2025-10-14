# Monster Components

UI components for the Monster Search feature.

## Overview

These components provide a complete monster search and display interface with:

- Real-time search filtering
- Responsive table layout
- Accessible keyboard navigation
- Dark mode support
- Empty states and user feedback

## Components

### MonsterTable (Container)

Main container component that orchestrates the entire monster search experience.

**Props:**

```typescript
interface MonsterTableProps {
  monsters: Monster[] // Array of monsters to display
  searchTerm: string // Current search term
  onSearchChange: (value: string) => void // Search change handler
}
```

**Usage:**

```tsx
import { MonsterTable } from '~/components/monsters'

function MonstersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <MonsterTable
      monsters={filteredMonsters}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    />
  )
}
```

**Features:**

- Integrates search input with table display
- Shows count of filtered results
- Handles empty states gracefully
- Responsive layout for all screen sizes
- Proper ARIA roles for accessibility

---

### MonsterSearchInput

Controlled search input with clear functionality.

**Props:**

```typescript
interface MonsterSearchInputProps {
  value: string // Current search value
  onChange: (value: string) => void // Change handler
  placeholder?: string // Optional placeholder (default: "Search monsters...")
}
```

**Usage:**

```tsx
import { MonsterSearchInput } from '~/components/monsters'
;<MonsterSearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search by name..."
/>
```

**Features:**

- Clear button (X) appears when input has value
- Keyboard shortcut: Escape to clear
- Accessible with proper ARIA labels
- Auto-focus on clear
- Responsive design

---

### MonsterTableHeader

Table header row displaying column labels.

**Props:** None (stateless component)

**Usage:**

```tsx
import { MonsterTableHeader } from '~/components/monsters'
;<MonsterTableHeader />
```

**Features:**

- Responsive grid layout matching table rows
- Hides Alignment/Movement columns on mobile (<640px)
- Semantic table header markup
- Proper column alignment

**Columns Displayed:**

- Name (always visible)
- Level (always visible)
- AC (always visible)
- HP (always visible)
- Alignment (visible 640px+)
- Movement (visible 640px+)

---

### MonsterTableRow

Individual monster row displaying statistics.

**Props:**

```typescript
interface MonsterTableRowProps {
  monster: Monster // Monster data to display
}
```

**Usage:**

```tsx
import { MonsterTableRow } from '~/components/monsters'
;<MonsterTableRow monster={monsterData} />
```

**Features:**

- Displays all key monster stats using utility formatters
- Hover state for interactivity
- Responsive grid layout (hides columns on mobile)
- Type-safe with Monster type from Convex
- Semantic table row markup

**Formatters Used:**

- `formatLevel()` - Level display
- `formatArmorClass()` - AC with armor type
- `formatHitPoints()` - HP display
- `formatAlignment()` - L/C/N to full name
- `formatMovement()` - Movement display

---

## Responsive Breakpoints

All components follow these breakpoints:

- **Mobile (< 640px)**: Name, Level, AC, HP only
- **Tablet (640px - 1024px)**: Add Alignment
- **Desktop (> 1024px)**: All columns including Movement

## Accessibility Features

- Semantic HTML with proper ARIA roles
- Keyboard navigation support
- Screen reader announcements for search results count
- Focus management (clear button refocuses input)
- Proper labels and descriptions
- Color contrast meets WCAG AA standards

## Styling

Uses TailwindCSS 4 with:

- Dark mode support (automatic via `dark:` variants)
- Responsive utilities
- Consistent spacing and typography
- Hover and focus states
- Shadow and border styling

## Integration Example

Complete example of integrating these components in a route:

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '~/convex/_generated/api'
import { MonsterTable } from '~/components/monsters'
import { useState, useMemo } from 'react'

export default function MonstersRoute() {
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all monsters
  const { data: monsters } = useSuspenseQuery(
    convexQuery(api.monsters.listMonsters, {}),
  )

  // Client-side filtering (or use server-side with searchMonsters query)
  const filteredMonsters = useMemo(() => {
    if (!searchTerm.trim()) return monsters

    const term = searchTerm.toLowerCase()
    return monsters.filter((m) => m.name.toLowerCase().includes(term))
  }, [monsters, searchTerm])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Monster Search</h1>

      <MonsterTable
        monsters={filteredMonsters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  )
}
```

## Type Safety

All components are fully type-safe using:

- `Monster` type from `~/types/monster.ts`
- Convex-generated types (`Doc<"monsters">`)
- TypeScript strict mode
- No `any` types

## Performance Considerations

- Uses React key prop (`monster._id`) for efficient re-renders
- Debouncing should be implemented at the route level if searching server-side
- Consider virtualization for very large lists (>1000 items)
- Uses `useMemo` for expensive filtering operations

## Future Enhancements

Potential improvements identified but not yet implemented:

- Sortable columns (click header to sort)
- Column visibility toggles
- Export to CSV/PDF
- Bulk selection
- Advanced filters (level range, alignment, etc.)
