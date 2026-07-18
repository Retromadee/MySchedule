# Graph Report - TodoUI  (2026-07-18)

## Corpus Check
- 20 files · ~13,420 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 42 nodes · 68 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `171a9ac5`
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

## God Nodes (most connected - your core abstractions)
1. `useTodo()` - 17 edges
2. `TaskItem()` - 3 edges
3. `App()` - 2 edges
4. `CalendarGrid()` - 2 edges
5. `MonthGrid()` - 2 edges
6. `EventCard()` - 2 edges
7. `EventDetail()` - 2 edges
8. `EventModal()` - 2 edges
9. `Dashboard()` - 2 edges
10. `Sidebar()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useTodo()`  [EXTRACTED]
  src/App.jsx → src/store/TodoContext.jsx
- `MonthGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/MonthGrid.jsx → src/store/TodoContext.jsx
- `EventDetail()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventDetail.jsx → src/store/TodoContext.jsx
- `EventModal()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventModal.jsx → src/store/TodoContext.jsx
- `Dashboard()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/layout/Dashboard.jsx → src/store/TodoContext.jsx

## Import Cycles
- None detected.

## Communities (8 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.27
Nodes (7): DAY_LETTERS, DAY_NAMES, formatDate(), getChipClass(), getChipLabel(), TaskItem(), WeeklyPlanner()

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (4): CATEGORY_COLORS, DAY_HEADERS, MONTH_NAMES, MonthGrid()

### Community 3 - "Community 3"
Cohesion: 0.40
Nodes (3): defaultEvents, StorageService, TodoContext

### Community 4 - "Community 4"
Cohesion: 0.70
Nodes (3): CalendarGrid(), EventCard(), useTodo()

### Community 5 - "Community 5"
Cohesion: 0.50
Nodes (3): CATEGORY_COLORS, DAY_NAMES, EventDetail()

### Community 6 - "Community 6"
Cohesion: 0.50
Nodes (3): COLOR_MAP, EventModal(), ICON_MAP

## Knowledge Gaps
- **11 isolated node(s):** `DAY_HEADERS`, `CATEGORY_COLORS`, `MONTH_NAMES`, `CATEGORY_COLORS`, `DAY_NAMES` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTodo()` connect `Community 4` to `Community 1`, `Community 2`, `Community 3`, `Community 5`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.290) - this node is a cross-community bridge._
- **What connects `DAY_HEADERS`, `CATEGORY_COLORS`, `MONTH_NAMES` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._