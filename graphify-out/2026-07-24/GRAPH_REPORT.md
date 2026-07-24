# Graph Report - TodoUI  (2026-07-24)

## Corpus Check
- 33 files · ~15,291 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 143 nodes · 240 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `86afe7e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_CalendarGrid.jsx|CalendarGrid.jsx]]
- [[_COMMUNITY_useTodo|useTodo]]
- [[_COMMUNITY_StorageService.js|StorageService.js]]
- [[_COMMUNITY_.oxlintrc.json|.oxlintrc.json]]
- [[_COMMUNITY_App.jsx|App.jsx]]
- [[_COMMUNITY_MonthGrid.jsx|MonthGrid.jsx]]
- [[_COMMUNITY_React + Vite|React + Vite]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_AGENTS|AGENTS.md]]

## God Nodes (most connected - your core abstractions)
1. `useTodo()` - 25 edges
2. `CalendarGrid()` - 11 edges
3. `useAuth()` - 10 edges
4. `eventsForDate()` - 7 edges
5. `scripts` - 6 edges
6. `react` - 6 edges
7. `useNotificationCount()` - 5 edges
8. `TodoProvider()` - 4 edges
9. `App()` - 4 edges
10. `Topbar()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `SettingsModal()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/layout/SettingsModal.jsx → src/store/TodoContext.jsx
- `EventModal()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventModal.jsx → src/store/TodoContext.jsx
- `TestComponent()` --calls--> `useTodo()`  [EXTRACTED]
  src/store/TodoContext.test.jsx → src/store/TodoContext.jsx
- `MonthGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/MonthGrid.jsx → src/store/TodoContext.jsx
- `EventCard()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventCard.jsx → src/store/TodoContext.jsx

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "CalendarGrid.jsx"
Cohesion: 0.36
Nodes (12): CalendarGrid(), addMinutes(), calcHeight(), calcTop(), DAY_NAMES_FULL, DAY_NAMES_SHORT, formatDateLabel(), getDurationMinutes() (+4 more)

### Community 1 - "useTodo"
Cohesion: 0.33
Nodes (5): rules, users, .read, .write, $uid

### Community 2 - "StorageService.js"
Cohesion: 0.27
Nodes (7): DAY_LETTERS, DAY_NAMES, formatDate(), getChipClass(), getChipLabel(), TaskItem(), WeeklyPlanner()

### Community 3 - ".oxlintrc.json"
Cohesion: 0.13
Nodes (12): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, react, warn (+4 more)

### Community 4 - "App.jsx"
Cohesion: 0.20
Nodes (14): AuthScreen(), DAYS, DEFAULT_CATEGORIES, Onboarding(), AuthContext, AuthProvider(), useAuth(), App() (+6 more)

### Community 5 - "MonthGrid.jsx"
Cohesion: 0.14
Nodes (17): CATEGORY_COLORS, DAY_HEADERS, MONTH_NAMES, MonthGrid(), EventCard(), useNotificationCount(), Dashboard(), FILTER_LABELS (+9 more)

### Community 6 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 7 - "package.json"
Cohesion: 0.08
Nodes (25): dependencies, firebase, @phosphor-icons/react, react, react-dom, devDependencies, jsdom, oxlint (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.27
Nodes (6): SettingsModal(), defaultEvents, isValidEvent(), isValidTime(), StorageService, localStorageMock

### Community 11 - "Community 11"
Cohesion: 0.50
Nodes (3): COLOR_MAP, EventModal(), ICON_MAP

## Knowledge Gaps
- **51 isolated node(s):** `TodoContext`, `firebaseConfig`, `Firebase production setup`, `.read`, `.write` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTodo()` connect `MonthGrid.jsx` to `Community 9`, `StorageService.js`, `Community 11`, `App.jsx`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `react` connect `.oxlintrc.json` to `CalendarGrid.jsx`, `App.jsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `TodoContext`, `firebaseConfig`, `Firebase production setup` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.oxlintrc.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `MonthGrid.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14245014245014245 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._