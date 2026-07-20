# Graph Report - TodoUI  (2026-07-20)

## Corpus Check
- 23 files · ~15,239 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 78 nodes · 103 edges · 14 communities (9 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4d95afde`
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
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `useTodo()` - 19 edges
2. `scripts` - 5 edges
3. `StorageService` - 3 edges
4. `TodoProvider()` - 3 edges
5. `TaskItem()` - 3 edges
6. `CalendarGrid()` - 2 edges
7. `MonthGrid()` - 2 edges
8. `EventModal()` - 2 edges
9. `Sidebar()` - 2 edges
10. `App()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `MonthGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/MonthGrid.jsx → src/store/TodoContext.jsx
- `EventModal()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventModal.jsx → src/store/TodoContext.jsx
- `Sidebar()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/layout/Sidebar.jsx → src/store/TodoContext.jsx
- `EventDetail()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventDetail.jsx → src/store/TodoContext.jsx
- `Dashboard()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/layout/Dashboard.jsx → src/store/TodoContext.jsx

## Import Cycles
- None detected.

## Communities (14 total, 5 thin omitted)

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
Cohesion: 0.70
Nodes (3): CalendarGrid(), EventCard(), useTodo()

### Community 5 - "Community 5"
Cohesion: 0.50
Nodes (3): CATEGORY_COLORS, DAY_NAMES, EventDetail()

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
- **35 isolated node(s):** `DAY_HEADERS`, `CATEGORY_COLORS`, `MONTH_NAMES`, `ICON_MAP`, `COLOR_MAP` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTodo()` connect `Community 4` to `Community 1`, `Community 2`, `Community 5`, `Community 6`, `Community 9`, `Community 10`, `Community 11`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 8` to `Community 7`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `StorageService` connect `Community 3` to `Community 10`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `DAY_HEADERS`, `CATEGORY_COLORS`, `MONTH_NAMES` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._