# Graph Report - TodoUI  (2026-07-20)

## Corpus Check
- 25 files · ~16,514 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 86 nodes · 120 edges · 12 communities (8 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `37ea604a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `useTodo()` - 24 edges
2. `scripts` - 5 edges
3. `StorageService` - 4 edges
4. `TodoProvider()` - 3 edges
5. `useNotificationCount()` - 3 edges
6. `TaskItem()` - 3 edges
7. `SettingsModal()` - 2 edges
8. `App()` - 2 edges
9. `Dashboard()` - 2 edges
10. `Sidebar()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `MonthGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/MonthGrid.jsx → src/store/TodoContext.jsx
- `EventModal()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventModal.jsx → src/store/TodoContext.jsx
- `SettingsModal()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/layout/SettingsModal.jsx → src/store/TodoContext.jsx
- `CalendarGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/CalendarGrid.jsx → src/store/TodoContext.jsx
- `EventCard()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventCard.jsx → src/store/TodoContext.jsx

## Import Cycles
- None detected.

## Communities (12 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.27
Nodes (7): DAY_LETTERS, DAY_NAMES, formatDate(), getChipClass(), getChipLabel(), TaskItem(), WeeklyPlanner()

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (4): CATEGORY_COLORS, DAY_HEADERS, MONTH_NAMES, MonthGrid()

### Community 3 - "Community 3"
Cohesion: 0.40
Nodes (3): defaultEvents, StorageService, localStorageMock

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (11): CalendarGrid(), EventCard(), CATEGORY_COLORS, DAY_NAMES, EventDetail(), Dashboard(), SettingsModal(), Sidebar() (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.50
Nodes (3): COLOR_MAP, EventModal(), ICON_MAP

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (13): dependencies, @phosphor-icons/react, react, react-dom, name, private, scripts, build (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (10): devDependencies, jsdom, oxlint, @testing-library/jest-dom, @testing-library/react, @types/react, @types/react-dom, vite (+2 more)

## Knowledge Gaps
- **35 isolated node(s):** `TodoContext`, `DAY_NAMES`, `DAY_LETTERS`, `DAY_HEADERS`, `CATEGORY_COLORS` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTodo()` connect `Community 4` to `Community 0`, `Community 1`, `Community 2`, `Community 5`, `Community 6`, `Community 9`?**
  _High betweenness centrality (0.265) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 8` to `Community 7`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `StorageService` connect `Community 3` to `Community 4`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `TodoContext`, `DAY_NAMES`, `DAY_LETTERS` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._