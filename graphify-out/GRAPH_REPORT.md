# Graph Report - TodoUI  (2026-07-18)

## Corpus Check
- 20 files · ~12,191 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 14 nodes · 16 edges · 3 communities (2 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cf66d6cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `TaskItem()` - 3 edges
2. `formatDate()` - 2 edges
3. `getChipClass()` - 2 edges
4. `getChipLabel()` - 2 edges
5. `WeeklyPlanner()` - 2 edges
6. `DAY_NAMES` - 1 edges
7. `DAY_LETTERS` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (3 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.32
Nodes (5): DAY_LETTERS, DAY_NAMES, getChipClass(), getChipLabel(), TaskItem()

## Knowledge Gaps
- **2 isolated node(s):** `DAY_NAMES`, `DAY_LETTERS`
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `DAY_NAMES`, `DAY_LETTERS` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._