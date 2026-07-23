# Graph Report - TodoUI  (2026-07-23)

## Corpus Check
- 27 files · ~12,708 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 134 nodes · 215 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0539c39b`
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
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_AGENTS|AGENTS.md]]

## God Nodes (most connected - your core abstractions)
1. `useTodo()` - 21 edges
2. `react` - 12 edges
3. `CalendarGrid()` - 11 edges
4. `eventsForDate()` - 7 edges
5. `react` - 7 edges
6. `scripts` - 6 edges
7. `useNotificationCount()` - 5 edges
8. `StorageService` - 4 edges
9. `calcTop()` - 4 edges
10. `calcHeight()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `MonthGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/MonthGrid.jsx → src/store/TodoContext.jsx
- `EventCard()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventCard.jsx → src/store/TodoContext.jsx
- `EventModal()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventModal.jsx → src/store/TodoContext.jsx
- `Dashboard()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/layout/Dashboard.jsx → src/store/TodoContext.jsx
- `HeaderArea()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/layout/HeaderArea.jsx → src/store/TodoContext.jsx

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "CalendarGrid.jsx"
Cohesion: 0.36
Nodes (12): CalendarGrid(), addMinutes(), calcHeight(), calcTop(), DAY_NAMES_FULL, DAY_NAMES_SHORT, formatDateLabel(), getDurationMinutes() (+4 more)

### Community 1 - "useTodo"
Cohesion: 0.22
Nodes (8): CATEGORY_COLORS, DAY_HEADERS, MONTH_NAMES, MonthGrid(), getWeekdayIndex(), matchesDate(), timeToMinutes(), toDateKey()

### Community 2 - "StorageService.js"
Cohesion: 0.27
Nodes (7): DAY_LETTERS, DAY_NAMES, formatDate(), getChipClass(), getChipLabel(), TaskItem(), WeeklyPlanner()

### Community 3 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 4 - "App.jsx"
Cohesion: 0.23
Nodes (7): react, App(), CATEGORY_COLORS, DAY_NAMES, EventDetail(), Sidebar(), localStorageMock

### Community 5 - "MonthGrid.jsx"
Cohesion: 0.17
Nodes (16): EventCard(), COLOR_MAP, EventModal(), ICON_MAP, useNotificationCount(), Dashboard(), FILTER_LABELS, HeaderArea() (+8 more)

### Community 6 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 7 - "package.json"
Cohesion: 0.12
Nodes (16): dependencies, @phosphor-icons/react, react, react-dom, name, private, scripts, build (+8 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (17): jsdom, oxlint, devDependencies, jsdom, oxlint, @testing-library/jest-dom, @testing-library/react, @types/react (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (6): vitest, defaultEvents, isValidEvent(), isValidTime(), localStorageMock, vitest

## Knowledge Gaps
- **40 isolated node(s):** `DAY_HEADERS`, `CATEGORY_COLORS`, `MONTH_NAMES`, `ICON_MAP`, `COLOR_MAP` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `MonthGrid.jsx` to `useTodo`, `StorageService.js`, `package.json`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `Community 9`, `package.json`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **What connects `DAY_HEADERS`, `CATEGORY_COLORS`, `MONTH_NAMES` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._