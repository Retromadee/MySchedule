# Graph Report - TodoUI  (2026-07-18)

## Corpus Check
- 20 files · ~13,425 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 45 nodes · 72 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `321e52ba`
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

## God Nodes (most connected - your core abstractions)
1. `useTodo()` - 18 edges
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
- `MonthGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/MonthGrid.jsx → src/store/TodoContext.jsx
- `EventDetail()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventDetail.jsx → src/store/TodoContext.jsx
- `EventModal()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/events/EventModal.jsx → src/store/TodoContext.jsx
- `App()` --calls--> `useTodo()`  [EXTRACTED]
  src/App.jsx → src/store/TodoContext.jsx
- `CalendarGrid()` --calls--> `useTodo()`  [EXTRACTED]
  src/components/calendar/CalendarGrid.jsx → src/store/TodoContext.jsx

## Import Cycles
- None detected.

## Communities (7 total, 1 thin omitted)

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
Cohesion: 0.35
Nodes (6): CalendarGrid(), EventCard(), Dashboard(), Sidebar(), App(), useTodo()

### Community 5 - "Community 5"
Cohesion: 0.50
Nodes (3): CATEGORY_COLORS, DAY_NAMES, EventDetail()

### Community 6 - "Community 6"
Cohesion: 0.50
Nodes (3): COLOR_MAP, EventModal(), ICON_MAP

## Knowledge Gaps
- **12 isolated node(s):** `FILTER_LABELS`, `DAY_HEADERS`, `CATEGORY_COLORS`, `MONTH_NAMES`, `CATEGORY_COLORS` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTodo()` connect `Community 4` to `Community 1`, `Community 2`, `Community 3`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.312) - this node is a cross-community bridge._
- **What connects `FILTER_LABELS`, `DAY_HEADERS`, `CATEGORY_COLORS` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._