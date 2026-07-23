# Graph Report - TodoUI  (2026-07-23)

## Corpus Check
- 27 files · ~12,708 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 134 nodes · 265 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `423f77d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CalendarGrid.jsx
- useTodo
- StorageService.js
- .oxlintrc.json
- App.jsx
- MonthGrid.jsx
- React + Vite
- package.json
- devDependencies
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `useTodo()` - 31 edges
2. `react` - 18 edges
3. `CalendarGrid()` - 12 edges
4. `eventsForDate()` - 10 edges
5. `WeeklyPlanner()` - 7 edges
6. `scripts` - 6 edges
7. `MonthGrid()` - 6 edges
8. `useNotificationCount()` - 6 edges
9. `StorageService` - 6 edges
10. `Dashboard()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `MonthGrid()` --references--> `react`  [EXTRACTED]
  src/components/calendar/MonthGrid.jsx → package.json
- `TestComponent()` --calls--> `useTodo()`  [EXTRACTED]
  src/store/TodoContext.test.jsx → src/store/TodoContext.jsx
- `App()` --calls--> `useTodo()`  [EXTRACTED]
  src/App.jsx → src/store/TodoContext.jsx
- `CalendarGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/CalendarGrid.jsx → src/store/TodoContext.jsx
- `MonthGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/MonthGrid.jsx → src/store/TodoContext.jsx

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "CalendarGrid.jsx"
Cohesion: 0.19
Nodes (19): CalendarGrid(), DAY_LETTERS, DAY_NAMES, formatDate(), getChipClass(), getChipLabel(), TaskItem(), WeeklyPlanner() (+11 more)

### Community 1 - "useTodo"
Cohesion: 0.33
Nodes (10): EventCard(), NotificationsPanel(), Topbar(), useNotificationCount(), useTodo(), eventsForDate(), getWeekdayIndex(), matchesDate() (+2 more)

### Community 2 - "StorageService.js"
Cohesion: 0.31
Nodes (7): SettingsModal(), defaultEvents, isValidEvent(), isValidTime(), normalizeEvents(), StorageService, localStorageMock

### Community 3 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 4 - "App.jsx"
Cohesion: 0.15
Nodes (16): react, App(), CATEGORY_COLORS, DAY_NAMES, EventDetail(), COLOR_MAP, EventModal(), ICON_MAP (+8 more)

### Community 5 - "MonthGrid.jsx"
Cohesion: 0.29
Nodes (7): react, react, buildMonthGrid(), CATEGORY_COLORS, DAY_HEADERS, MONTH_NAMES, MonthGrid()

### Community 6 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 7 - "package.json"
Cohesion: 0.12
Nodes (15): dependencies, @phosphor-icons/react, react-dom, name, private, scripts, build, dev (+7 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (19): jsdom, oxlint, devDependencies, jsdom, oxlint, @testing-library/jest-dom, @testing-library/react, @types/react (+11 more)

## Knowledge Gaps
- **43 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MonthGrid()` connect `MonthGrid.jsx` to `useTodo`, `App.jsx`?**
  _High betweenness centrality (0.375) - this node is a cross-community bridge._
- **Why does `react` connect `MonthGrid.jsx` to `package.json`?**
  _High betweenness centrality (0.369) - this node is a cross-community bridge._
- **Why does `dependencies` connect `package.json` to `MonthGrid.jsx`?**
  _High betweenness centrality (0.367) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._