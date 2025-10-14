# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shadowdark GM Tools application built with:

- **Frontend**: TanStack Start (file-based routing), React 19, TailwindCSS 4
- **Backend**: Convex (real-time database and backend functions)
- **Build Tool**: Vite

The application provides game master tools for the Shadowdark RPG system.

## Development Commands

### Starting Development

```bash
npm run dev
```

This command runs Convex dev server once, then starts both web and Convex dev servers concurrently.

### Individual Dev Servers

```bash
npm run dev:web      # Start Vite dev server only (port 3000)
npm run dev:convex   # Start Convex dev server only
npm run dev:ts       # Start TypeScript watch mode
```

### Build

```bash
npm run build        # Build for production and type-check
```

### Formatting

```bash
npm run format       # Format code with Prettier
```

## Architecture

### Frontend Architecture

**Router Configuration** (`src/router.tsx`)

- Uses TanStack Router with React Query integration
- Convex integration via `ConvexQueryClient` and `@convex-dev/react-query`
- Routes are file-based in `src/routes/` directory
- `routeTree.gen.ts` is auto-generated from route files
- Requires `VITE_CONVEX_URL` environment variable in `.env.local`

**Route Structure**

- `src/routes/__root.tsx`: Root layout component with head metadata
- `src/routes/index.tsx`: Home page route
- `src/routes/anotherPage.tsx`: Additional page route

**Data Fetching Pattern**
The app uses a hybrid approach combining Convex React hooks and TanStack Query:

```tsx
// Query data
const { data } = useSuspenseQuery(
  convexQuery(api.myFunctions.listNumbers, { count: 10 }),
)

// Mutate data
const addNumber = useMutation(api.myFunctions.addNumber)
```

### Backend Architecture (Convex)

**Function Organization**

- Convex functions are in `convex/` directory
- Uses file-based routing: `api.fileName.functionName` or `internal.fileName.functionName`
- Schema defined in `convex/schema.ts`
- Type-safe API imports from `convex/_generated/api`

**Function Syntax**
Always use the modern function syntax with validators:

```typescript
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const myQuery = query({
  args: { count: v.number() },
  returns: v.object({ ... }),
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

**Important Convex Patterns**

- Use `internalQuery`, `internalMutation`, `internalAction` for private functions
- Use `query`, `mutation`, `action` for public API functions
- Always include `args` and `returns` validators
- Functions that don't return anything should use `returns: v.null()`
- Query with indexes using `withIndex`, not `filter`
- Call functions via `ctx.runQuery`, `ctx.runMutation`, or `ctx.runAction`

### Type System

**Path Aliases**

- `~/*` maps to `src/*` (configured in tsconfig.json and vite.config.ts)
- Import Convex generated types from `convex/_generated/dataModel`

**TypeScript Configuration**

- Strict mode enabled
- Uses bundler module resolution
- Allows importing `.ts` extensions
- Targets ES2022

## Key Convex Guidelines

The project follows Convex best practices defined in `.cursor/rules/convex_rules.mdc`:

1. **Always use new function syntax** with explicit `args` and `returns` validators
2. **Index naming**: Include all index fields in name (e.g., `by_field1_and_field2`)
3. **Validators**: Use `v.id(tableName)` for IDs, `v.int64()` for bigints, `v.record()` for records
4. **Function references**: Use `api.fileName.functionName` or `internal.fileName.functionName`
5. **System fields**: `_id` and `_creationTime` are auto-added to all documents
6. **Type imports**: Use `Id<'tableName'>`, `Doc<'tableName'>` from `_generated/dataModel`

## Environment Setup

Create a `.env.local` file with:

```
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

## Testing the Build

After making changes, always run:

```bash
npm run build
```

This builds the app and runs TypeScript type checking to catch errors.

## New Features

When creating the and planning new features create a new file with the name <featre>\_plan.md under /context/plans/ and ensure that file can clear steps for how you entend to implement this new feature.
