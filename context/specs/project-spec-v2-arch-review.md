# Shadowdark GM Tools - Project Specification v2 - Architectural Review

**Review Date**: 2025-10-12
**Reviewer**: Claude Code (Technical Architecture Specialist)
**Specification Version**: v2
**Status**: Critical Review for Implementation Planning

---

## Executive Summary

### Overall Assessment

The specification is **well-structured and comprehensive** from a product perspective, providing clear milestones, user flows, and acceptance criteria. However, there are **significant technical concerns** that must be addressed before implementation, particularly around the Convex schema definitions, search implementation, and scalability patterns.

**Risk Level**: **MEDIUM-HIGH** - Several high-impact issues that could cause implementation delays or require significant rework.

### Key Findings

#### Critical Issues (Must Fix Before Implementation)
1. **Schema Type Mismatches**: Multiple validator type errors that will cause runtime failures
2. **Search Index Configuration**: Overly optimistic search implementation that may not meet performance targets
3. **Missing Union Type Handling**: Favorites schema has unimplemented union ID types
4. **Index Design Gaps**: Several missing indexes that will cause performance issues at scale
5. **Array Field Indexing**: Spell classes array filtering will be complex with proposed approach

#### Major Concerns (Address During Implementation)
6. **Pagination Strategy Undefined**: Cursor-based pagination specified but implementation details missing
7. **Denormalization Trade-offs**: Unclear when to denormalize vs. join
8. **Real-time Performance**: No consideration of Convex subscription costs
9. **Seeding Strategy**: Idempotency approach not specified
10. **Error Boundary Architecture**: Missing specific error handling patterns

#### Opportunities (Recommendations)
11. Component architecture could benefit from more specific composition patterns
12. State management strategy needs refinement for complex filter interactions
13. URL state management approach needs validation for filter combinations
14. Print functionality requirements are vague

### Severity Ratings Legend
- **CRITICAL**: Blocks implementation, requires immediate fix
- **HIGH**: Will cause significant issues, should fix before starting milestone
- **MEDIUM**: Should address during implementation, may cause technical debt
- **LOW**: Nice to have, can defer to later phases

---

## Section 1: Schema & Data Model Review

### 1.1 Monster Schema (Milestone 1.1)

#### Proposed Schema
```typescript
monsters: defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.string(),
  armor_class: v.number(),
  armor_type: v.union(v.string(), v.null()),
  hit_points: v.number(),
  attacks: v.string(),
  movement: v.string(),
  strength: v.number(),
  dexterity: v.number(),
  constitution: v.number(),
  intelligence: v.number(),
  wisdom: v.number(),
  charisma: v.number(),
  alignment: v.string(),
  level: v.number(),
  traits: v.array(v.object({
    name: v.string(),
    description: v.string(),
  })),
})
```

#### Issues Identified

**CRITICAL - Type Mismatch: `armor_type`**
- **Issue**: `v.union(v.string(), v.null())` is invalid Convex validator syntax
- **Correct Syntax**: `v.optional(v.string())` or storing empty string for null cases
- **Impact**: Schema definition will fail at runtime
- **Fix Required**:
  ```typescript
  armor_type: v.optional(v.string()), // Better approach
  // OR
  armor_type: v.string(), // Store "" for null cases
  ```

**HIGH - Missing Unique Constraint**
- **Issue**: `slug` field has no unique constraint guarantee
- **Impact**: Duplicate slugs could cause detail page conflicts
- **Recommendation**: Add validation in seeding mutation to check for duplicates, as Convex doesn't support unique constraints natively
- **Implementation**:
  ```typescript
  // In seedMonsters mutation
  const existing = await ctx.db.query("monsters")
    .withIndex("by_slug", (q) => q.eq("slug", monster.slug))
    .first();
  if (existing) {
    throw new Error(`Duplicate slug: ${monster.slug}`);
  }
  ```

**MEDIUM - Index Strategy Review**

Proposed indexes:
```typescript
.index("by_slug", ["slug"])
.index("by_level", ["level"])
.index("by_alignment", ["alignment"])
.index("by_name", ["name"])
.searchIndex("search_monsters", {
  searchField: "name",
  filterFields: ["level", "alignment"]
})
```

**Analysis**:
- ✅ **Good**: `by_slug` for detail page lookups (most common query)
- ✅ **Good**: `by_level` and `by_alignment` for filtering
- ⚠️ **Concern**: `by_name` is redundant with `search_monsters` search index
- ⚠️ **Missing**: Combined index for common filter combinations

**Recommendation**:
```typescript
.index("by_slug", ["slug"]) // Primary lookup
.index("by_level", ["level"]) // Single filter
.index("by_alignment", ["alignment"]) // Single filter
.index("by_level_and_alignment", ["level", "alignment"]) // Combined filter (common case)
.searchIndex("search_monsters", {
  searchField: "name",
  filterFields: ["level", "alignment"]
})
```

**Note**: Remove `by_name` index as the search index handles name-based queries more efficiently.

**MEDIUM - Ability Score Storage**
- **Issue**: Storing modifiers instead of base scores
- **Data Check**: From sample data, values like `strength: 4` appear to be modifiers
- **Consideration**: This matches Shadowdark stat block format (shows modifiers, not base scores)
- **Recommendation**: ✅ Keep as-is, but add JSDoc comment to clarify:
  ```typescript
  // Ability scores stored as modifiers (e.g., +4, -1), not base scores
  strength: v.number(),
  ```

**LOW - Traits Search**
- **Issue**: Spec mentions "optionally search in descriptions and trait names" but search index doesn't include traits
- **Impact**: Cannot search traits without adding to search index
- **Recommendation**: Add trait names to search index for Phase 2 (Milestone 5.1 - Advanced Filtering)
- **Future Enhancement**:
  ```typescript
  .searchIndex("search_monsters_full", {
    searchField: "name", // Can only have one search field
    // Will need to handle trait search separately or denormalize trait names into a searchable field
  })
  ```
- **Alternative Approach**: Create a computed field for searchable text:
  ```typescript
  searchableText: v.string(), // "Name | Trait1 | Trait2 | ..."
  ```

### 1.2 Spell Schema (Milestone 2.1)

#### Proposed Schema
```typescript
spells: defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.string(),
  classes: v.array(v.string()),
  duration: v.string(),
  range: v.string(),
  tier: v.string(), // "1" through "5"
})
```

#### Issues Identified

**HIGH - Tier Type Mismatch**
- **Issue**: `tier: v.string()` but used as number in many contexts
- **Data Reality**: JSON has `"tier": "1"` as strings
- **Usage Context**: Filtering by tier range (`minLevel`, `maxLevel` pattern suggested for monsters)
- **Impact**: Range queries will require string comparison, sorting will be lexicographic not numeric
- **Fix Required**:
  ```typescript
  tier: v.number(), // Store as 1-5
  // OR keep as string but use specific union
  tier: v.union(
    v.literal("1"),
    v.literal("2"),
    v.literal("3"),
    v.literal("4"),
    v.literal("5")
  ),
  ```
- **Recommendation**: **Convert to number during seeding** for easier range queries and sorting
  ```typescript
  tier: v.number(), // 1-5
  ```

**CRITICAL - Array Field Indexing Challenge**
- **Issue**: `classes: v.array(v.string())` with index `by_class`
- **Convex Reality**: Cannot create traditional index on array fields
- **Proposed Index**: `.index("by_class", ["classes"])` - **This will not work as expected**
- **Impact**: Class filtering will require full table scans or complex workarounds
- **Solutions**:

  **Option A - Denormalize (Recommended)**:
  ```typescript
  // Keep original array
  classes: v.array(v.string()),
  // Add boolean flags for efficient filtering
  isWizardSpell: v.boolean(),
  isPriestSpell: v.boolean(),
  ```
  ```typescript
  .index("by_wizard", ["isWizardSpell"])
  .index("by_priest", ["isPriestSpell"])
  .index("by_tier_and_wizard", ["tier", "isWizardSpell"])
  .index("by_tier_and_priest", ["tier", "isPriestSpell"])
  ```

  **Option B - Separate Documents (Overkill)**:
  Create separate records for each class - overly complex for this use case.

  **Option C - Filter in Memory**:
  Query all spells and filter in the Convex function - acceptable for 85 spells but doesn't scale.

**Recommendation**: Use Option A (denormalization with boolean flags) for efficient filtering.

**MEDIUM - Missing Unique Slug Validation**
- Same issue as monsters - no unique constraint on `slug`
- Apply same validation approach in seeding

**MEDIUM - Index Optimization**

Proposed indexes:
```typescript
.index("by_slug", ["slug"])
.index("by_tier", ["tier"])
.index("by_class", ["classes"]) // BROKEN - see above
.searchIndex("search_spells", {
  searchField: "name",
  filterFields: ["tier", "classes", "range", "duration"]
})
```

**Issues**:
- `by_class` index won't work on array field
- Search index with `classes` in filterFields may not work with array
- Missing combined indexes for common filter combinations

**Recommended Indexes** (with denormalization):
```typescript
.index("by_slug", ["slug"])
.index("by_tier", ["tier"])
.index("by_tier_and_wizard", ["tier", "isWizardSpell"])
.index("by_tier_and_priest", ["tier", "isPriestSpell"])
.index("by_range", ["range"]) // For range filtering
.searchIndex("search_spells", {
  searchField: "name",
  filterFields: ["tier", "isWizardSpell", "isPriestSpell", "range"]
})
```

**LOW - Duration/Range Standardization**
- **Observation**: `duration` and `range` are free-form strings
- **Data Samples**: "Focus", "Instant", "5 rounds", "1 hour real time", "1d8 days"
- **Filtering Challenge**: "5 rounds" vs "10 rounds" - how to group "rounds" durations?
- **Recommendation**: For MVP, exact string matching is fine. For advanced filtering (Milestone 5.1), consider:
  ```typescript
  duration: v.string(), // Original text
  durationCategory: v.optional(v.string()), // "instant" | "focus" | "rounds" | "minutes" | "hours" | "days"
  ```

### 1.3 Favorites Schema (Milestone 3.1)

#### Proposed Schema
```typescript
favorites: defineTable({
  userId: v.id("users"),
  itemType: v.union(v.literal("monster"), v.literal("spell")),
  itemId: v.id("monsters" | "spells"), // Need to handle union types
  itemSlug: v.string(),
  itemName: v.string(),
  addedAt: v.number(),
  notes: v.optional(v.string()),
})
```

#### Issues Identified

**CRITICAL - Invalid Union ID Type**
- **Issue**: `v.id("monsters" | "spells")` is invalid syntax
- **Convex Reality**: Cannot have union of ID types
- **Impact**: Schema will fail to compile
- **Fix Required**: Remove `itemId` or use string for flexibility:

  **Option A - Remove itemId (Recommended)**:
  ```typescript
  favorites: defineTable({
    userId: v.id("users"),
    itemType: v.union(v.literal("monster"), v.literal("spell")),
    // itemId removed - use itemSlug for lookups
    itemSlug: v.string(),
    itemName: v.string(), // Denormalized for display
    addedAt: v.number(),
    notes: v.optional(v.string()),
  })
  ```

  **Option B - Store as string**:
  ```typescript
  itemId: v.string(), // Store _id.toString(), cast back when needed
  ```

  **Recommendation**: **Option A** - use `itemSlug` for lookups, it's already in the schema and more stable than IDs for this use case.

**HIGH - Timestamp Type**
- **Issue**: `addedAt: v.number()` assumes Unix timestamp in milliseconds
- **Best Practice**: Convex provides `v.number()` for timestamps, but consider using `_creationTime` system field
- **Recommendation**:
  ```typescript
  // Remove addedAt, use system _creationTime instead
  // OR keep addedAt if you need to differentiate creation time from "favorited at" time
  ```
- **Decision Needed**: Since favorites are created when favorited, `_creationTime` should be sufficient. Remove `addedAt` field.

**MEDIUM - Index Strategy**

Proposed indexes:
```typescript
.index("by_userId_and_type", ["userId", "itemType"])
.index("by_userId_and_itemSlug", ["userId", "itemSlug"])
.index("by_userId", ["userId"])
```

**Analysis**:
- ✅ `by_userId_and_type` - good for filtering favorites by type
- ✅ `by_userId_and_itemSlug` - good for checking if item is favorited
- ⚠️ `by_userId` - redundant if we have `by_userId_and_type`

**Recommendation**:
```typescript
.index("by_userId", ["userId"]) // All favorites
.index("by_userId_and_type", ["userId", "itemType"]) // Filtered by type
.index("by_userId_and_itemSlug", ["userId", "itemSlug"]) // Duplicate check
```

Keep all three - they serve distinct query patterns and Convex indexes are cheap.

**MEDIUM - Duplicate Prevention**
- **Requirement**: "Checks if already favorited"
- **Implementation**: Mutation should use `by_userId_and_itemSlug` index
- **Edge Case**: What if user tries to favorite same item twice? Update timestamp or return existing?
- **Recommendation**: Make mutation idempotent - return existing favorite if already exists:
  ```typescript
  const existing = await ctx.db
    .query("favorites")
    .withIndex("by_userId_and_itemSlug", (q) =>
      q.eq("userId", userId).eq("itemSlug", args.itemSlug)
    )
    .first();

  if (existing) return existing._id; // Already favorited
  ```

### 1.4 UserProfile Schema (Already Implemented)

#### Current Schema
```typescript
userProfiles: defineTable({
  userId: v.id("users"),
  displayName: v.string(),
  avatarUrl: v.optional(v.string()),
  favoriteTablesPreferences: v.optional(v.any()),
  themePreference: v.optional(v.string()),
}).index("by_userId", ["userId"])
```

#### Issues Identified

**MEDIUM - Use of `v.any()`**
- **Issue**: `favoriteTablesPreferences: v.optional(v.any())`
- **Impact**: Type safety lost, unclear what data structure to expect
- **Recommendation**: Define specific type based on actual use case:
  ```typescript
  viewModePreference: v.optional(v.union(v.literal("grid"), v.literal("list"))),
  // OR for more complex preferences
  preferences: v.optional(v.object({
    viewMode: v.union(v.literal("grid"), v.literal("list")),
    defaultSort: v.string(),
    // etc.
  })),
  ```

**LOW - Missing Fields**
- Spec mentions `viewModePreference` and `favoriteFilters` but schema has generic `favoriteTablesPreferences`
- **Recommendation**: Define specific fields as needed:
  ```typescript
  displayName: v.string(),
  avatarUrl: v.optional(v.string()),
  themePreference: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
  viewModePreference: v.optional(v.union(v.literal("grid"), v.literal("list"))),
  defaultMonsterSort: v.optional(v.string()),
  defaultSpellSort: v.optional(v.string()),
  ```

### 1.5 Collections Schema (Milestone 5.2)

#### Proposed Schema
```typescript
collections: defineTable({
  userId: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  isPublic: v.boolean(),
}).index("by_userId", ["userId"])

collectionItems: defineTable({
  collectionId: v.id("collections"),
  itemType: v.union(v.literal("monster"), v.literal("spell")),
  itemSlug: v.string(),
  itemName: v.string(),
  addedAt: v.number(),
  order: v.number(),
}).index("by_collectionId", ["collectionId"])
```

#### Issues Identified

**MEDIUM - Redundant Timestamps**
- **Issue**: `createdAt` and `updatedAt` when system `_creationTime` exists
- **Recommendation**: Use `_creationTime` for creation, only add `updatedAt` if needed:
  ```typescript
  userId: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  updatedAt: v.number(), // Last modification time
  isPublic: v.boolean(),
  ```

**LOW - Missing Index for Public Collections**
- If `isPublic` collections can be browsed, need index:
  ```typescript
  .index("by_userId", ["userId"])
  .index("by_public", ["isPublic"]) // For browsing public collections
  ```

**LOW - CollectionItems Order Field**
- **Good**: `order` field for manual sorting
- **Consideration**: What happens when items are deleted? Gaps in order?
- **Recommendation**: Use floating-point numbers for easy reordering without renumbering:
  ```typescript
  order: v.number(), // Use 1.0, 2.0, 3.0, then insert 1.5 between 1.0 and 2.0
  ```

### 1.6 Recent Views Schema (Milestone 5.4)

#### Proposed Schema
```typescript
recentViews: defineTable({
  userId: v.id("users"),
  itemType: v.union(v.literal("monster"), v.literal("spell")),
  itemSlug: v.string(),
  viewedAt: v.number(),
}).index("by_userId", ["userId"])
```

#### Issues Identified

**HIGH - Duplicate Entries**
- **Issue**: "Duplicate recent views update timestamp" requirement
- **Index Needed**: To find existing view to update:
  ```typescript
  .index("by_userId", ["userId"])
  .index("by_userId_and_itemSlug", ["userId", "itemSlug"]) // Find duplicate
  ```

**MEDIUM - Cleanup Strategy**
- **Issue**: "Returns last 20 views" but no cleanup of old entries
- **Impact**: Table will grow indefinitely
- **Recommendation**: Add cleanup in mutation or scheduled function:
  ```typescript
  // In recordView mutation, delete entries beyond 20
  const views = await ctx.db
    .query("recentViews")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();

  if (views.length > 20) {
    for (const view of views.slice(20)) {
      await ctx.db.delete(view._id);
    }
  }
  ```

**LOW - Timestamp vs _creationTime**
- `viewedAt` makes sense here since views get updated
- Keep as-is

---

## Section 2: Technical Feasibility

### 2.1 Search Implementation

#### Proposed Approach
- Use Convex search indexes on `name` fields
- Filter by level, alignment, tier, class using search index `filterFields`
- Target: < 500ms search results

#### Feasibility Analysis

**MEDIUM-HIGH CONCERN - Search Index Limitations**

Convex search indexes have specific constraints:
1. **Single search field**: Can only full-text search on one field (name)
2. **Filter fields**: Can use indexed fields to narrow results, but:
   - Array fields (spell classes) may not work efficiently in search indexes
   - Combined filters require the search to scan all matches then filter
3. **Performance**: For 649 monsters + 85 spells, should be fine, but:
   - Each filter combination may have different performance characteristics
   - "Optionally search in descriptions and trait names" is NOT feasible with proposed schema

**Concerns**:
- ❌ Cannot efficiently search trait names without denormalization
- ⚠️ Array field filtering in search index untested
- ⚠️ Multi-field search (name + description) not supported by single search index

**Recommendations**:

**For MVP (Milestones 1-3)**:
- ✅ Use search index for name-only search - will work well
- ✅ Apply filters after search using query filters - acceptable for small dataset
- ⚠️ Set realistic expectations: < 500ms is achievable, but not for all filter combinations

**For Advanced Search (Milestone 5.1)**:
- Denormalize searchable content into single field:
  ```typescript
  name: v.string(),
  description: v.string(),
  searchableContent: v.string(), // "Name | trait1 | trait2 | description"
  ```
- Use `searchableContent` in search index
- Note: This increases storage and seeding complexity

**Alternative Approach**:
- For 649 monsters, consider loading all into browser and using client-side search (Fuse.js, etc.)
- Pros: More flexible search, can search any field, better highlighting
- Cons: Initial load time, not suitable if dataset grows significantly
- Verdict: **Not recommended** - defeats purpose of backend database, no real-time updates

### 2.2 Real-time Subscriptions

#### Consideration
Convex automatically provides real-time subscriptions for all queries.

#### Concerns

**LOW - Subscription Costs**
- **Issue**: Every component using `useSuspenseQuery(convexQuery(...))` creates a live subscription
- **Impact**: Multiple components subscribing to same data = multiple subscriptions
- **Mitigation**: TanStack Query deduplicates queries with same key
- **Verdict**: Should be fine, but monitor in production

**LOW - Unnecessary Real-time Updates**
- **Question**: Do browse pages need real-time updates?
- **Scenario**: User browsing monsters when another user adds favorite
- **Impact**: Minimal - favorites are user-specific
- **Verdict**: Real-time is fine, no action needed

### 2.3 Pagination Strategy

#### Proposed Approach
- Cursor-based pagination for large result sets
- Infinite scroll or pagination UI

#### Issues Identified

**HIGH - Undefined Implementation**
- **Issue**: Spec mentions `cursor` parameter and `nextCursor` return value but no implementation details
- **Convex Reality**: Use `.paginate()` API with `paginationOptsValidator`
- **Correct Pattern**:
  ```typescript
  import { paginationOptsValidator } from "convex/server";

  export const listMonsters = query({
    args: {
      ...searchArgs,
      paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
      const results = await ctx.db
        .query("monsters")
        .paginate(args.paginationOpts);

      return results; // { page: Doc[], continueCursor, isDone }
    },
  });
  ```

**Recommendation**: Update spec to use Convex pagination API explicitly.

**MEDIUM - Pagination with Search**
- **Issue**: Combining search index with pagination is more complex
- **Convex API**: Search results can be paginated, but:
  ```typescript
  const results = await ctx.db
    .query("monsters")
    .withSearchIndex("search_monsters", (q) => q.search("name", searchTerm))
    .paginate(paginationOpts);
  ```
- **Verdict**: Supported, but spec should clarify this pattern

**MEDIUM - Infinite Scroll vs Pagination**
- **UX Question**: Which to implement?
- **Infinite Scroll**: Better for mobile, browsing flow
- **Pagination**: Better for jumping to specific pages, accessibility
- **Recommendation**: Implement infinite scroll for MVP, pagination for desktop (or vice versa)
- **Decision Needed**: Spec should specify preferred approach

### 2.4 Data Seeding

#### Proposed Approach
- One-time seeding operation via mutation
- Idempotent (can run multiple times safely)

#### Issues Identified

**MEDIUM - Idempotency Strategy Undefined**
- **Issue**: "Seeding is idempotent" requirement without implementation approach
- **Options**:

  **Option A - Check and Skip**:
  ```typescript
  const existing = await ctx.db.query("monsters").first();
  if (existing) {
    console.log("Monsters already seeded");
    return;
  }
  ```

  **Option B - Upsert by Slug**:
  ```typescript
  for (const monster of monstersData) {
    const existing = await ctx.db
      .query("monsters")
      .withIndex("by_slug", (q) => q.eq("slug", monster.slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, monster);
    } else {
      await ctx.db.insert("monsters", monster);
    }
  }
  ```

  **Option C - Clear and Reseed**:
  ```typescript
  // Delete all existing
  const all = await ctx.db.query("monsters").collect();
  for (const doc of all) {
    await ctx.db.delete(doc._id);
  }
  // Insert fresh
  for (const monster of monstersData) {
    await ctx.db.insert("monsters", monster);
  }
  ```

**Recommendation**:
- For MVP: **Option A** (check and skip) - simplest, fastest
- For development: **Option C** (clear and reseed) - ensures data is updated
- Make it configurable: `seedMonsters({ force: boolean })`

**LOW - Data Transformation**
- **Issue**: JSON data may need transformation before insertion
- **Examples**:
  - Convert spell tier from string to number
  - Add boolean flags for spell classes
  - Generate searchable content fields
- **Recommendation**: Create transformation functions:
  ```typescript
  function transformMonster(raw: any): Monster {
    return {
      ...raw,
      armor_type: raw.armor_type || undefined, // null -> undefined
    };
  }
  ```

**LOW - Bulk Insert Performance**
- **Issue**: Inserting 649 monsters + 85 spells one-by-one
- **Convex**: No bulk insert API, must insert individually
- **Performance**: Should complete in seconds, acceptable for one-time operation
- **Recommendation**: Add progress logging:
  ```typescript
  console.log(`Seeding ${monstersData.length} monsters...`);
  for (let i = 0; i < monstersData.length; i++) {
    await ctx.db.insert("monsters", monstersData[i]);
    if (i % 100 === 0) console.log(`  ${i}/${monstersData.length}`);
  }
  ```

### 2.5 Optimistic Updates

#### Proposed Approach
- Optimistic updates for favorite button interactions

#### Feasibility

**✅ GOOD - Straightforward Implementation**
- Convex + TanStack Query supports optimistic updates well
- Pattern:
  ```typescript
  const addFavorite = useMutation(api.favorites.add).withOptimisticUpdate((localStore, args) => {
    // Update local cache immediately
    const favorites = localStore.getQuery(api.favorites.list, { userId });
    if (favorites) {
      localStore.setQuery(api.favorites.list, { userId }, [...favorites, newFavorite]);
    }
  });
  ```

**MEDIUM - Spec Should Clarify Pattern**
- **Issue**: "Optimistic updates for instant feedback" mentioned but no implementation guidance
- **Recommendation**: Add section on optimistic update pattern for developers

### 2.6 Performance Targets

#### Stated Targets
- First Contentful Paint < 1.5s
- Search results < 500ms
- Detail page navigation < 300ms
- Lighthouse performance score > 90

#### Feasibility Analysis

**✅ ACHIEVABLE - FCP < 1.5s**
- TanStack Start with SSR supports this
- Small dataset (< 1MB total) helps
- Recommendation: Ensure proper code splitting

**⚠️ CHALLENGING - Search < 500ms**
- Depends on:
  - Convex query performance (usually 50-150ms)
  - Network latency (varies by location)
  - Client processing time
- For 649 monsters: Likely achievable
- For complex filters: May exceed 500ms
- **Recommendation**: Set target as "p95 < 500ms" not absolute

**✅ ACHIEVABLE - Detail page < 300ms**
- Single query by slug with index: very fast (< 50ms)
- Main factor: Network latency + rendering
- Recommendation: Implement prefetching on hover

**⚠️ OPTIMISTIC - Lighthouse > 90**
- Achievable, but requires:
  - Proper image optimization (no images in spec?)
  - Code splitting by route
  - Minimal JavaScript bundle
  - No layout shift during loading
- **Recommendation**: Add specific performance optimization tasks to Milestone 4

---

## Section 3: Architecture Concerns

### 3.1 Component Architecture

#### Proposed Components

**Monsters**:
- `MonsterCard`, `MonsterFilters`, `SearchBar`, `MonsterGrid`
- `MonsterStatBlock`, `TraitList`, `FavoriteButton`, `MonsterNavigation`

**Spells**:
- `SpellCard`, `SpellFilters`, `SpellGrid`
- `SpellDetailCard`, `FavoriteButton`, `SpellNavigation`

**Favorites**:
- `FavoritesList`, `FavoriteItemCard`, `FavoriteNotes`, `EmptyFavoritesState`

#### Issues Identified

**MEDIUM - Component Reusability**
- **Observation**: `SearchBar` is marked as reusable but filters are separate
- **Issue**: Monsters and Spells have separate filter components despite similar patterns
- **Recommendation**: Create composable filter system:
  ```typescript
  <FilterSidebar>
    <FilterGroup title="Level">
      <RangeFilter field="level" min={1} max={10} />
    </FilterGroup>
    <FilterGroup title="Alignment">
      <CheckboxFilter field="alignment" options={["L", "N", "C"]} />
    </FilterGroup>
  </FilterSidebar>
  ```

**LOW - Missing Composition Patterns**
- **Issue**: Spec doesn't specify how components compose
- **Example**: Is `MonsterCard` used in both browse and favorites? Should be.
- **Recommendation**: Create hierarchy diagram:
  ```
  MonsterBrowserPage
  ├── SearchBar
  ├── MonsterFilters
  └── MonsterGrid
      └── MonsterCard[] (reused in FavoritesList)
  ```

**LOW - Layout Components Missing**
- **Issue**: No mention of layout components
- **Needed**: `BrowserLayout`, `DetailLayout`, `EmptyState`, `ErrorBoundary`
- **Recommendation**: Add to component list

### 3.2 State Management

#### Proposed Approach
- Server state: Convex + TanStack Query
- Client state: React hooks
- URL state: TanStack Router search params
- Local storage: Preferences, theme

#### Issues Identified

**HIGH - URL State Complexity**
- **Issue**: Complex filter combinations in URL
- **Example**: `/monsters?level=1,2,3&alignment=L,N&search=dragon`
- **Concerns**:
  - Type-safe parsing of URL params
  - Validation of filter combinations
  - Syncing URL with filter UI state
  - Back/forward button behavior

**Recommendation**: Use TanStack Router's search param validation:
```typescript
const monsterSearchSchema = z.object({
  q: z.string().optional(),
  level: z.array(z.number()).optional(),
  alignment: z.array(z.enum(["L", "N", "C"])).optional(),
});

// In route definition
export const Route = createFileRoute("/monsters/")({
  validateSearch: (search) => monsterSearchSchema.parse(search),
});
```

**MEDIUM - Filter State Sync**
- **Issue**: Keeping URL, UI, and query in sync
- **Challenge**: User changes filter → Update URL → Parse URL → Update query
- **Recommendation**: Single source of truth pattern:
  ```typescript
  // URL is source of truth
  const { q, level, alignment } = Route.useSearch();

  // Query directly from URL params
  const { data } = useSuspenseQuery(
    convexQuery(api.monsters.list, { search: q, level, alignment })
  );

  // UI updates URL
  const navigate = useNavigate();
  const updateFilters = (newFilters) => {
    navigate({ search: (prev) => ({ ...prev, ...newFilters }) });
  };
  ```

**LOW - Local Storage Conflicts**
- **Issue**: Multiple browser tabs could have conflicting preferences
- **Impact**: Minimal for view mode preference
- **Recommendation**: Use `storage` event listener to sync across tabs if needed

### 3.3 Data Fetching Patterns

#### Proposed Pattern
```typescript
const { data } = useSuspenseQuery(
  convexQuery(api.myFunctions.listNumbers, { count: 10 })
);
```

#### Issues Identified

**MEDIUM - Error Boundary Strategy**
- **Issue**: `useSuspenseQuery` throws on error, needs error boundary
- **Spec mentions**: "Error boundaries for route-level errors"
- **Question**: What granularity? Per-route? Per-component?
- **Recommendation**:
  - Route-level error boundary for catastrophic failures
  - Component-level error boundaries for optional features
  - Example:
    ```typescript
    <ErrorBoundary fallback={<ErrorState />}>
      <MonsterGrid /> {/* Uses useSuspenseQuery */}
    </ErrorBoundary>
    ```

**MEDIUM - Loading State Strategy**
- **Issue**: Spec mentions "skeleton screens" but `useSuspenseQuery` uses Suspense boundaries
- **Clarification Needed**:
  - Skeleton screens rendered by Suspense fallback?
  - Or using `isLoading` state from regular `useQuery`?
- **Recommendation**: Consistent pattern:
  ```typescript
  <Suspense fallback={<MonsterGridSkeleton />}>
    <MonsterGridContent />
  </Suspense>
  ```

**LOW - Query Key Strategy**
- **Issue**: TanStack Query requires consistent query keys
- **Convex Integration**: `convexQuery()` generates keys automatically
- **Verdict**: Should work well, no action needed

### 3.4 Route Structure

#### Proposed Routes
- `/` - Home
- `/monsters` - Monster browser
- `/monsters/:slug` - Monster detail
- `/spells` - Spell browser
- `/spells/:slug` - Spell detail
- `/favorites` - Favorites page
- `/profile` - User profile (implied)

#### Issues Identified

**LOW - File Structure Mismatch**
- **Spec uses**: `/monsters/:slug`
- **TanStack Start pattern**: `$slug` (e.g., `src/routes/monsters/$slug.tsx`)
- **Clarification**: Spec is describing URL, file should use `$slug`
- **Recommendation**: Clarify in spec:
  ```
  URL: /monsters/:slug
  File: src/routes/monsters/$slug.tsx
  ```

**LOW - Protected Route Pattern**
- **Spec states**: "Protected route (requires authentication)" for `/favorites`
- **Implementation**: Use route `beforeLoad` hook:
  ```typescript
  export const Route = createFileRoute("/favorites/")({
    beforeLoad: ({ context }) => {
      if (!context.auth.isAuthenticated) {
        throw redirect({ to: "/", search: { login: true } });
      }
    },
  });
  ```
- **Recommendation**: Add pattern to spec

**LOW - 404 Handling**
- **Spec mentions**: "404 page for invalid slugs"
- **Implementation**:
  - TanStack Router has built-in 404 handling
  - For invalid slugs, return `null` from query and handle in component
  - Or use `notFound()` function if available
- **Recommendation**: Specify 404 handling approach

---

## Section 4: Missing Technical Requirements

### 4.1 Backend Functions Not Specified

#### Missing Query/Mutation Definitions

**Monsters**:
- ✅ `listMonsters` - defined
- ✅ `getMonsterBySlug` - defined
- ✅ `getMonsterStats` - defined
- ⚠️ `getAdjacentMonsters` - defined but implementation unclear
  - How to get "next monster" in filtered context?
  - Need to maintain filter state in query
  - Consider simplification: Only next/prev in unfiltered list
- ❌ `seedMonsters` - mentioned but no function signature
  - Should be `internalMutation` (not public API)
  - Args: `{ data: Monster[], force?: boolean }`
  - Returns: `{ count: number }`

**Spells**:
- ✅ `listSpells` - defined
- ✅ `getSpellBySlug` - defined
- ✅ `getSpellStats` - defined
- ⚠️ `getAdjacentSpells` - same issues as monsters
- ❌ `seedSpells` - missing signature

**Favorites**:
- ✅ `addFavorite` - defined
- ✅ `removeFavorite` - defined
- ✅ `updateFavoriteNotes` - defined
- ✅ `getFavorites` - defined
- ✅ `isFavorite` - defined
- ⚠️ `getFavoritesWithDetails` - mentioned in Milestone 3.3
  - **Issue**: Joining with union types (monsters OR spells)
  - **Implementation Challenge**: Need to fetch from two tables
  - **Pattern**:
    ```typescript
    export const getFavoritesWithDetails = query({
      args: { itemType: v.optional(...) },
      handler: async (ctx, args) => {
        const favorites = await ctx.db
          .query("favorites")
          .filter((q) => q.eq(q.field("userId"), userId))
          .collect();

        // Fetch details for each favorite
        const withDetails = await Promise.all(
          favorites.map(async (fav) => {
            const details = fav.itemType === "monster"
              ? await ctx.db.query("monsters").withIndex("by_slug", ...).first()
              : await ctx.db.query("spells").withIndex("by_slug", ...).first();
            return { ...fav, itemDetails: details };
          })
        );

        return withDetails;
      },
    });
    ```
  - **Performance Concern**: N+1 query problem for large favorites lists
  - **Recommendation**: Acceptable for MVP (< 100 favorites expected), optimize later

**User Profiles**:
- ❌ `getUserProfile` - needed
- ❌ `updateUserProfile` - needed
- ❌ `createUserProfile` - needed (or auto-create on first auth)

**Collections** (Milestone 5):
- Multiple mutations needed: create, update, delete, addItem, removeItem, reorderItems
- Not critical for MVP

### 4.2 Authentication Edge Cases

#### Missing Specifications

**User Profile Creation**:
- **Question**: When is user profile created?
- **Options**:
  - On first login (recommended)
  - Explicitly by user
- **Recommendation**: Auto-create on first login using Convex Auth hooks

**Favorite Button for Non-Authenticated**:
- **Spec states**: "Prompted to log in"
- **Implementation**: Modal? Redirect? Toast notification?
- **Recommendation**: Modal with "Log in to save favorites" message

**Session Expiry**:
- **Missing**: What happens if user's session expires while on favorites page?
- **Recommendation**: Redirect to home with login prompt

### 4.3 Data Validation

#### Missing Validation Specs

**Frontend Validation**:
- ❌ Search input validation (max length, allowed characters)
- ❌ Filter value validation (level range, etc.)
- ❌ Notes field validation (max length in favorites)

**Backend Validation**:
- ❌ Convex mutations should validate all inputs
- **Example**: `addFavorite` should validate:
  - User is authenticated
  - `itemSlug` exists in respective table
  - `itemType` is valid
- **Recommendation**: Add validation section to spec

### 4.4 SEO Implementation Details

#### SSR Requirements

**TanStack Start SSR**:
- ✅ Supports SSR out of the box
- ⚠️ **Issue**: Convex queries on server need special handling
- **Implementation**:
  ```typescript
  // In route loader
  export const Route = createFileRoute("/monsters/$slug")({
    loader: async ({ params }) => {
      // Fetch data server-side for SEO
      const monster = await api.monsters.getBySlug({ slug: params.slug });
      return { monster };
    },
  });
  ```

**Meta Tags**:
- **Spec defines**: Title, description, Open Graph for each page type
- **Implementation**: Use TanStack Router's `head` export:
  ```typescript
  export const Route = createFileRoute("/monsters/$slug")({
    head: ({ loaderData }) => ({
      title: `${loaderData.monster.name} - Level ${loaderData.monster.level} Monster | Shadowdark GM Tools`,
      meta: [
        { name: "description", content: loaderData.monster.description.slice(0, 150) },
        // ... Open Graph tags
      ],
    }),
  });
  ```

**Sitemap Generation**:
- **Spec mentions**: "Sitemap.xml with all monsters and spells"
- **Missing**: Implementation approach
- **Recommendation**:
  - Static generation during build (preferred)
  - Or dynamic route serving sitemap
  - Need to fetch all slugs from Convex

### 4.5 Error Messages & Empty States

#### Specified States
- No search results
- No favorites
- Failed data loads

#### Missing Specifications

**Network Errors**:
- What message for "Failed to connect to Convex"?
- Retry button behavior?

**Invalid Data**:
- What if monster slug exists but data is corrupted?
- Fallback rendering?

**Rate Limiting**:
- Does Convex have rate limits?
- How to handle if exceeded?

**Recommendation**: Add comprehensive error message map:
```typescript
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  NOT_FOUND: "The requested {item} could not be found.",
  AUTH_REQUIRED: "Please log in to access this feature.",
  // etc.
};
```

---

## Section 5: Implementation Risks

### 5.1 High-Risk Features

#### Risk #1: Search Performance with Complex Filters

**Risk Level**: HIGH
**Likelihood**: Medium
**Impact**: High (Core feature)

**Description**:
The proposed search implementation combines full-text search with multiple filter dimensions (level, alignment, class, tier, range, duration). Convex search indexes support `filterFields`, but performance with multiple active filters is uncertain.

**Specific Concerns**:
1. Search + level range + alignment = 3 filter dimensions
2. Spell class filtering on array field may not work efficiently
3. "Search in descriptions and traits" is not supported without denormalization

**Mitigation Strategies**:
1. **Prototype early** (before Milestone 1.2): Test search performance with realistic filter combinations
2. **Set realistic expectations**: < 500ms for simple search, may be slower for complex filters
3. **Fallback plan**: If search index doesn't perform, query all items and filter client-side (acceptable for 649+85 items)
4. **Progressive enhancement**: Start with name-only search, add description/trait search in Phase 2 with denormalization

**Success Criteria**:
- 95% of searches complete in < 500ms
- All searches complete in < 2s
- User feedback indicates search is "fast"

#### Risk #2: Favorites Query Performance

**Risk Level**: MEDIUM-HIGH
**Likelihood**: Medium
**Impact**: Medium (Secondary feature)

**Description**:
`getFavoritesWithDetails` query has N+1 query problem - fetches favorite records then individually fetches each monster/spell detail.

**Specific Concerns**:
1. User with 50 favorites = 1 favorites query + 50 detail queries
2. Convex allows parallel queries, but still significant overhead
3. Could hit Convex function execution time limits

**Mitigation Strategies**:
1. **Set expectations**: Document in spec that large favorite lists (> 100) may be slow
2. **Denormalize critical fields**: Store name, level, tier in favorites table to avoid join for list view
3. **Pagination**: Limit favorites list to 20-50 items per page
4. **Future optimization**: Convex team may add bulk query APIs

**Success Criteria**:
- Favorites page loads in < 1s for 20 favorites
- Favorites page loads in < 3s for 100 favorites

#### Risk #3: URL State Management Complexity

**Risk Level**: MEDIUM
**Likelihood**: High
**Impact**: Medium (UX issue)

**Description**:
Managing filter state in URL with type-safe parsing, validation, and sync with UI is complex and error-prone.

**Specific Concerns**:
1. Invalid URL params could crash page
2. Back/forward button may not work as expected
3. Sharing URLs with filters may produce unexpected results
4. Race conditions between URL updates and query execution

**Mitigation Strategies**:
1. **Use TanStack Router's validation**: Leverage built-in search param validation
2. **Default values**: Provide sensible defaults for all filter params
3. **Error handling**: Catch invalid params and reset to defaults
4. **Testing**: Comprehensive tests for URL param edge cases
5. **User feedback**: Clear indication when filters are applied

**Success Criteria**:
- No crashes from invalid URLs
- Back/forward buttons work correctly
- Shared URLs produce consistent results
- Filter state is always in sync with URL

### 5.2 Medium-Risk Features

#### Risk #4: Mobile Responsiveness

**Risk Level**: MEDIUM
**Impact**: High (70%+ mobile users expected)

**Description**:
Spec emphasizes mobile usage but design details are minimal.

**Mitigation**:
- Mobile-first design approach
- Test on real devices early
- Use touch-friendly component library (shadcn/ui already touch-friendly)

#### Risk #5: Print Functionality

**Risk Level**: MEDIUM
**Impact**: Medium (Nice-to-have feature)

**Description**:
"Print-friendly CSS" mentioned but no specific requirements.

**Mitigation**:
- Defer to Milestone 4 or 5
- Use simple print stylesheet
- Test with browser print preview
- Consider "Export as PDF" button as alternative

### 5.3 Dependencies Between Features

#### Critical Path

```
Milestone 1.1 (Monster Seeding)
    ↓
Milestone 1.2 (Monster Browser) ← Depends on search working
    ↓
Milestone 1.3 (Monster Detail)
    ↓
Milestone 3.1 (Favorites Schema) ← Must be done before 3.2
    ↓
Milestone 3.2 (Favorite Button) ← Used in 1.3 and 2.3
    ↓
Milestone 3.3 (Favorites Page)
```

**Parallel Tracks**:
- Milestone 2 (Spells) can start after 1.1 is complete
- Milestone 4 (Polish) can be done in parallel with 1-3

**Recommendation**: Start with 1.1, then split team:
- Track A: Monsters (1.2, 1.3, 1.4)
- Track B: Spells (2.1, 2.2, 2.3, 2.4)
- Converge on Milestone 3 (Favorites)

---

## Section 6: Recommendations

### 6.1 Schema Changes Required

**Priority 1 (Fix Before Implementation)**:

1. **Monster Schema**:
   ```typescript
   monsters: defineTable({
     name: v.string(),
     slug: v.string(),
     description: v.string(),
     armor_class: v.number(),
     armor_type: v.optional(v.string()), // FIX: was v.union(v.string(), v.null())
     hit_points: v.number(),
     attacks: v.string(),
     movement: v.string(),
     // Ability scores are modifiers (e.g., +4, -1), not base scores
     strength: v.number(),
     dexterity: v.number(),
     constitution: v.number(),
     intelligence: v.number(),
     wisdom: v.number(),
     charisma: v.number(),
     alignment: v.string(),
     level: v.number(),
     traits: v.array(v.object({
       name: v.string(),
       description: v.string(),
     })),
   })
     .index("by_slug", ["slug"])
     .index("by_level", ["level"])
     .index("by_alignment", ["alignment"])
     .index("by_level_and_alignment", ["level", "alignment"]) // ADD: Combined filter
     .searchIndex("search_monsters", {
       searchField: "name",
       filterFields: ["level", "alignment"]
     })
   ```

2. **Spell Schema**:
   ```typescript
   spells: defineTable({
     name: v.string(),
     slug: v.string(),
     description: v.string(),
     classes: v.array(v.string()), // Keep original
     // ADD: Denormalized flags for efficient filtering
     isWizardSpell: v.boolean(),
     isPriestSpell: v.boolean(),
     duration: v.string(),
     range: v.string(),
     tier: v.number(), // FIX: was v.string(), convert to number
   })
     .index("by_slug", ["slug"])
     .index("by_tier", ["tier"])
     .index("by_tier_and_wizard", ["tier", "isWizardSpell"]) // ADD
     .index("by_tier_and_priest", ["tier", "isPriestSpell"]) // ADD
     .index("by_range", ["range"]) // ADD
     .searchIndex("search_spells", {
       searchField: "name",
       filterFields: ["tier", "isWizardSpell", "isPriestSpell", "range"]
     })
   ```

3. **Favorites Schema**:
   ```typescript
   favorites: defineTable({
     userId: v.id("users"),
     itemType: v.union(v.literal("monster"), v.literal("spell")),
     // REMOVE: itemId (can't have union of ID types)
     itemSlug: v.string(),
     itemName: v.string(), // Denormalized for display
     // REMOVE: addedAt (use _creationTime instead)
     notes: v.optional(v.string()),
   })
     .index("by_userId", ["userId"])
     .index("by_userId_and_type", ["userId", "itemType"])
     .index("by_userId_and_itemSlug", ["userId", "itemSlug"])
   ```

### 6.2 Additional Queries/Mutations Needed

**Add to Specification**:

```typescript
// monsters.ts
export const seedMonsters = internalMutation({
  args: {
    data: v.array(v.any()), // JSON data
    force: v.optional(v.boolean()),
  },
  returns: v.object({ count: v.number() }),
  handler: async (ctx, args) => { /* ... */ },
});

export const listMonsters = query({
  args: {
    search: v.optional(v.string()),
    minLevel: v.optional(v.number()),
    maxLevel: v.optional(v.number()),
    alignment: v.optional(v.array(v.string())),
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    page: v.array(v.any()),
    continueCursor: v.string(),
    isDone: v.boolean(),
  }),
  handler: async (ctx, args) => { /* ... */ },
});

// Similar for spells.ts

// favorites.ts
export const getFavoritesWithDetails = query({
  args: {
    itemType: v.optional(v.union(v.literal("monster"), v.literal("spell"))),
  },
  returns: v.array(v.object({
    _id: v.id("favorites"),
    userId: v.id("users"),
    itemType: v.union(v.literal("monster"), v.literal("spell")),
    itemSlug: v.string(),
    itemName: v.string(),
    notes: v.optional(v.string()),
    itemDetails: v.optional(v.any()), // Monster | Spell | null
  })),
  handler: async (ctx, args) => { /* ... */ },
});

// userProfiles.ts
export const getOrCreateProfile = mutation({
  args: {},
  returns: v.id("userProfiles"),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("userProfiles", {
      userId: identity.subject,
      displayName: identity.name || "User",
      avatarUrl: identity.pictureUrl,
    });
  },
});
```

### 6.3 Alternative Approaches

#### Alternative #1: Client-Side Search

**Current Approach**: Convex search indexes
**Alternative**: Load all data to client, use Fuse.js or similar

**Pros**:
- More flexible search (fuzzy matching, multi-field, highlights)
- No backend search index limitations
- Instant results (no network latency)

**Cons**:
- Initial load time (649 monsters = ~500KB JSON)
- No real-time updates from server
- Doesn't scale if dataset grows

**Recommendation**: **Stick with Convex search** for MVP, but keep this as fallback if search performance is insufficient.

#### Alternative #2: Separate Favorites and Collections

**Current Approach**: Favorites in Milestone 3, Collections in Milestone 5
**Alternative**: Combine into single "Collections" feature where favorites are just a default collection

**Pros**:
- Single unified system
- Less duplication
- More powerful from start

**Cons**:
- More complex MVP
- Slower time to initial release

**Recommendation**: **Keep separate** - Favorites are simpler and more commonly used. Collections can build on favorites later.

#### Alternative #3: Static Site Generation

**Current Approach**: TanStack Start with SSR
**Alternative**: Generate static HTML for all monsters/spells at build time

**Pros**:
- Fastest possible load times
- Cheapest hosting (no server)
- Better SEO

**Cons**:
- No real-time features
- Favorites require auth backend anyway
- Rebuilds needed for data updates

**Recommendation**: **Stick with SSR** - Need real-time for favorites, and Convex backend is already part of stack.

### 6.4 Prototyping Recommendations

**Before Starting Milestone 1**: Prototype these high-risk areas:

1. **Search Performance Test** (2 hours):
   - Seed test data
   - Implement basic search with filters
   - Measure performance with various filter combinations
   - Validate array field filtering works

2. **Pagination Pattern** (1 hour):
   - Test Convex `.paginate()` API
   - Verify it works with search indexes
   - Test infinite scroll UI pattern

3. **Optimistic Updates** (1 hour):
   - Test Convex + TanStack Query optimistic updates
   - Verify rollback on error
   - Test race conditions

4. **URL State Management** (2 hours):
   - Test TanStack Router search param validation
   - Test complex filter combinations
   - Test back/forward button behavior

**Total Prototyping Time**: ~6 hours
**Risk Reduction**: High - validates most uncertain technical aspects

### 6.5 Documentation Additions Needed

**Add to Specification**:

1. **Error Handling Patterns**:
   - Error boundary placement strategy
   - Error message templates
   - Retry logic patterns

2. **Loading State Patterns**:
   - Skeleton screen designs
   - Suspense boundary placement
   - Loading spinner guidelines

3. **Type Safety Guidelines**:
   - How to use Convex-generated types
   - Type-safe URL params pattern
   - Type-safe form handling

4. **Performance Budgets**:
   - Maximum bundle size per route
   - Maximum query response times
   - Maximum number of concurrent queries

5. **Accessibility Requirements**:
   - Keyboard navigation patterns
   - Screen reader announcements
   - Focus management rules

---

## Section 7: Prioritized Action Items

### Immediate Actions (Before Starting Implementation)

1. **[CRITICAL] Fix Schema Type Errors**
   - [ ] Update `monsters.armor_type` to use `v.optional(v.string())`
   - [ ] Update `spells.tier` to `v.number()`
   - [ ] Remove `favorites.itemId` field
   - [ ] Add denormalized boolean flags to spells schema

2. **[CRITICAL] Define Seeding Strategy**
   - [ ] Specify idempotency approach (check-and-skip vs clear-and-reseed)
   - [ ] Define data transformation functions
   - [ ] Write `seedMonsters` and `seedSpells` function signatures

3. **[HIGH] Prototype Search Performance**
   - [ ] Test Convex search with filter combinations
   - [ ] Validate array field filtering approach
   - [ ] Document performance characteristics

4. **[HIGH] Define Pagination Pattern**
   - [ ] Specify Convex `.paginate()` usage
   - [ ] Choose infinite scroll vs pagination UI
   - [ ] Document implementation pattern

5. **[HIGH] Add Missing Query/Mutation Signatures**
   - [ ] Document all backend function signatures
   - [ ] Specify args and returns validators
   - [ ] Define error handling for each

### During Milestone 1 (Monsters)

6. **[MEDIUM] Implement Slug Uniqueness Validation**
   - [ ] Add duplicate check in seeding mutations
   - [ ] Add error handling for duplicate slugs

7. **[MEDIUM] Define URL State Management Pattern**
   - [ ] Document TanStack Router search param validation
   - [ ] Define filter state sync strategy
   - [ ] Test back/forward button behavior

8. **[MEDIUM] Clarify Error Boundaries**
   - [ ] Specify error boundary placement (route vs component)
   - [ ] Define error fallback components
   - [ ] Document error message templates

### During Milestone 2 (Spells)

9. **[MEDIUM] Implement Denormalized Class Filtering**
   - [ ] Add `isWizardSpell` and `isPriestSpell` fields
   - [ ] Update seeding to populate boolean flags
   - [ ] Update queries to use boolean indexes

### During Milestone 3 (Favorites)

10. **[MEDIUM] Optimize getFavoritesWithDetails**
    - [ ] Implement N+1 query pattern
    - [ ] Add pagination if needed
    - [ ] Monitor performance with large favorite lists

### During Milestone 4 (Polish)

11. **[LOW] Define Print Styles**
    - [ ] Create print CSS for stat blocks
    - [ ] Test browser print preview
    - [ ] Consider PDF export alternative

12. **[LOW] Implement Performance Monitoring**
    - [ ] Add performance logging
    - [ ] Set up Lighthouse CI
    - [ ] Monitor query performance

### Post-MVP (Milestone 5)

13. **[LOW] Add Advanced Search**
    - [ ] Denormalize searchable content fields
    - [ ] Implement trait/description search
    - [ ] Test performance with expanded search

---

## Section 8: Risk Assessment Summary

### Risk Matrix

| Feature | Likelihood | Impact | Risk Level | Mitigation Priority |
|---------|-----------|--------|------------|-------------------|
| Search performance | Medium | High | **HIGH** | Prototype first |
| Schema type errors | High | High | **CRITICAL** | Fix immediately |
| Favorites query N+1 | Medium | Medium | **MEDIUM** | Optimize in M3 |
| URL state complexity | High | Medium | **MEDIUM** | Define pattern early |
| Array field filtering | Medium | High | **HIGH** | Use denormalization |
| Pagination implementation | Low | Medium | **LOW** | Follow Convex docs |
| Mobile responsiveness | Medium | High | **MEDIUM** | Test early, often |
| Print functionality | Low | Low | **LOW** | Defer to Phase 2 |

### Overall Risk Assessment

**Technical Risk**: **MEDIUM-HIGH**
- Several critical schema issues that must be fixed
- High-risk search implementation needs validation
- Complex URL state management

**Schedule Risk**: **MEDIUM**
- MVP timeline (13-18 days) is realistic IF prototyping is done first
- Risk of delays in Milestone 1 if search doesn't perform as expected
- Milestone 3 has N+1 query concern that could cause optimization work

**Recommendation**:
1. **Add 2 days for prototyping** before Milestone 1
2. **Add 1 day buffer** to each milestone for unexpected issues
3. **Total adjusted MVP timeline**: 18-25 days (up from 13-18)

---

## Section 9: Conclusion

### Overall Spec Quality

**Strengths**:
- ✅ Comprehensive feature breakdown with clear acceptance criteria
- ✅ Well-defined user flows and use cases
- ✅ Realistic milestone structure
- ✅ Good consideration of UX details

**Weaknesses**:
- ❌ Multiple critical schema type errors
- ❌ Overly optimistic about search implementation complexity
- ❌ Missing backend function specifications
- ❌ Insufficient technical implementation details

### Readiness for Implementation

**Current State**: **NOT READY**
- Critical schema issues must be fixed first
- Search approach needs validation
- Missing function signatures

**After Fixes**: **READY** (with caveats)
- Schema corrected
- Prototyping completed
- Function signatures documented
- Pagination pattern defined

### Estimated Time to Fix

**Specification Updates**: 4-6 hours
- Fix schema definitions: 1 hour
- Add function signatures: 2 hours
- Document patterns: 1-2 hours
- Review and validate: 1 hour

**Prototyping**: 6 hours (as defined in Section 6.4)

**Total Before Implementation Start**: 10-12 hours (1.5 days)

### Recommendation

**DO NOT START IMPLEMENTATION** until:
1. ✅ Schema issues are fixed in specification
2. ✅ Search performance is validated through prototype
3. ✅ Backend function signatures are documented
4. ✅ Pagination pattern is defined

**THEN PROCEED** with confidence that:
- Technical foundation is solid
- Major risks are understood and mitigated
- Implementation can follow the spec with minimal surprises

---

## Appendix A: Corrected Schema Definitions

### Complete Corrected Schemas

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  monsters: defineTable({
    name: v.string(),
    slug: v.string(), // URL-friendly, should be unique
    description: v.string(),
    armor_class: v.number(),
    armor_type: v.optional(v.string()), // e.g., "leather", null becomes undefined
    hit_points: v.number(),
    attacks: v.string(), // Formatted attack string
    movement: v.string(), // e.g., "near", "near (swim)"
    // Ability scores stored as modifiers (e.g., +4, -1), not base scores
    strength: v.number(),
    dexterity: v.number(),
    constitution: v.number(),
    intelligence: v.number(),
    wisdom: v.number(),
    charisma: v.number(),
    alignment: v.string(), // "L", "N", or "C"
    level: v.number(), // 1-10
    traits: v.array(v.object({
      name: v.string(),
      description: v.string(),
    })),
  })
    .index("by_slug", ["slug"]) // Primary lookup for detail pages
    .index("by_level", ["level"]) // Single-dimension filter
    .index("by_alignment", ["alignment"]) // Single-dimension filter
    .index("by_level_and_alignment", ["level", "alignment"]) // Combined filter
    .searchIndex("search_monsters", {
      searchField: "name",
      filterFields: ["level", "alignment"]
    }),

  spells: defineTable({
    name: v.string(),
    slug: v.string(), // URL-friendly, should be unique
    description: v.string(),
    classes: v.array(v.string()), // ["wizard"], ["priest"], or ["wizard", "priest"]
    // Denormalized for efficient filtering
    isWizardSpell: v.boolean(),
    isPriestSpell: v.boolean(),
    duration: v.string(), // e.g., "Instant", "Focus", "5 rounds"
    range: v.string(), // e.g., "Self", "Close", "Near", "Far", "Unlimited"
    tier: v.number(), // 1-5 (stored as number for easier range queries)
  })
    .index("by_slug", ["slug"]) // Primary lookup
    .index("by_tier", ["tier"]) // Tier filtering
    .index("by_tier_and_wizard", ["tier", "isWizardSpell"]) // Wizard spells by tier
    .index("by_tier_and_priest", ["tier", "isPriestSpell"]) // Priest spells by tier
    .index("by_range", ["range"]) // Range filtering
    .searchIndex("search_spells", {
      searchField: "name",
      filterFields: ["tier", "isWizardSpell", "isPriestSpell", "range"]
    }),

  favorites: defineTable({
    userId: v.id("users"),
    itemType: v.union(v.literal("monster"), v.literal("spell")),
    itemSlug: v.string(), // Reference by slug (more stable than ID)
    itemName: v.string(), // Denormalized for display without join
    notes: v.optional(v.string()), // User's personal notes
    // Use _creationTime system field instead of addedAt
  })
    .index("by_userId", ["userId"]) // All user favorites
    .index("by_userId_and_type", ["userId", "itemType"]) // Filtered by type
    .index("by_userId_and_itemSlug", ["userId", "itemSlug"]), // Duplicate check

  userProfiles: defineTable({
    userId: v.id("users"), // From Convex Auth
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    // Specific preference fields instead of v.any()
    themePreference: v.optional(v.union(
      v.literal("light"),
      v.literal("dark"),
      v.literal("system")
    )),
    viewModePreference: v.optional(v.union(
      v.literal("grid"),
      v.literal("list")
    )),
  }).index("by_userId", ["userId"]),

  // Phase 2 schemas (Milestone 5)
  collections: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(), // Last modification time
    isPublic: v.boolean(),
    // Use _creationTime for creation timestamp
  })
    .index("by_userId", ["userId"])
    .index("by_public", ["isPublic"]), // For browsing public collections

  collectionItems: defineTable({
    collectionId: v.id("collections"),
    itemType: v.union(v.literal("monster"), v.literal("spell")),
    itemSlug: v.string(),
    itemName: v.string(), // Denormalized
    order: v.number(), // Use floats for easy reordering (1.0, 1.5, 2.0)
    // Use _creationTime for added timestamp
  }).index("by_collectionId", ["collectionId"]),

  recentViews: defineTable({
    userId: v.id("users"),
    itemType: v.union(v.literal("monster"), v.literal("spell")),
    itemSlug: v.string(),
    viewedAt: v.number(), // Timestamp, updated on each view
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_itemSlug", ["userId", "itemSlug"]), // Find existing view
});
```

---

## Appendix B: Reference Links

### Convex Documentation
- [Search Indexes](https://docs.convex.dev/search)
- [Pagination](https://docs.convex.dev/database/pagination)
- [Validators](https://docs.convex.dev/functions/validation)
- [Indexes](https://docs.convex.dev/database/indexes/)

### TanStack Documentation
- [TanStack Router Search Params](https://tanstack.com/router/latest/docs/framework/react/guide/search-params)
- [TanStack Query with Convex](https://www.convex.dev/development/tanstack-query)

### Best Practices
- React 19 Best Practices
- TypeScript Strict Mode Guidelines
- Accessibility (WCAG AA)

---

**End of Architectural Review**

This review should be used as a working document throughout implementation. Update risk assessments and action items as implementation progresses.
