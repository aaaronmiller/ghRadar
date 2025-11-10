# Implementation Plan: Advanced GitHub Discovery & Agentic Intelligence

**Branch**: `001-advanced-gh-discovery` | **Date**: 2025-11-10 | **Spec**: `specs/001-advanced-gh-discovery/spec.md`
**Input**: Feature specification from `specs/001-advanced-gh-discovery/spec.md`

## Summary

Implement an advanced discovery engine inside ghRadar that:
- Executes rich, multi-dimensional GitHub searches (e.g., "agent" ecosystem)
  using structured filters and curated recipes.
- Scores and ranks repositories via transparent, multi-factor models
  (Activity, Momentum, Quality, Community, Relevance, Reputation).
- Periodically ingests and stores snapshots to enable trends, momentum
  analytics, and side-by-side comparisons.
- Exposes machine-readable outputs and basic NL-to-recipe mapping so
  agentic tools can query "top" / "emerging" / "exemplar" projects reliably.

## Technical Context

**Language/Version**: JavaScript (React 18) as used by existing ghRadar
**Primary Dependencies**:
- Existing:
  - React, Tailwind, Axios, Recharts, Framer Motion
- Planned (subject to review, all MUST be small and focused):
  - Lightweight persistence/indexing in-browser (e.g., IndexedDB wrapper or
    structured JSON snapshots managed via existing tooling)
  - GitHub REST and/or GraphQL v4 endpoints via existing axios service layer

**Storage**:
- Phase 1: File- or memory-backed snapshots (JSON) managed via existing
  services and ghRadar state.
- Phase 2: Optional IndexedDB/local persistent layer for:
  - RepositorySnapshot, SearchProfile, ComparisonSet, ExemplarProject.

**Testing**:
- Use existing test setup (Jest/React Testing Library or project-standard).
- Add focused tests for:
  - Scoring functions (pure functions, deterministic)
  - Query/recipe translation
  - Snapshot merge/diff logic

**Target Platform**:
- Web application (existing ghRadar frontend), desktop-class browsers.

**Project Type**:
- Single web app repository with modular `src/services`, `src/components`.

**Performance Goals**:
- Typical interactive searches return ranked results (from live or cached
  data) in < 3 seconds.
- Snapshot update operations execute in bounded batches to avoid UI stalls.

**Constraints**:
- MUST respect GitHub API rate limits and ToS.
- MUST keep architecture simple and composable; all integrations via
  dedicated services.
- MUST be explainable: no opaque ML models in initial phases.

**Scale/Scope**:
- Optimized for:
  - Tens of saved profiles.
  - Hundreds to a few thousand tracked repositories.
  - Trend windows on the order of months, not full-firehose analytics.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Derived gates from `ghRadar Constitution`:

1. Signal-First Discovery
   - Plan centers on high-signal criteria, transparent scores, and clear
     explanations. PASS.
2. Clean, Composable Architecture
   - All new logic planned as small, pure-friendly modules under `src/services`
     and focused UI components; no frameworks added without justification.
     PASS.
3. Testable, Verifiable Behavior
   - Scoring, query building, and snapshot logic planned as deterministic
     functions with unit tests. PASS.
4. Observability & Data Lineage
   - Scores expose breakdown; snapshots carry timestamps and source notes;
     UI surfaces caveats on partial data. PASS.
5. Simplicity & Responsible API Usage
   - Use existing GitHub services, batched calls, caching, and conservative
     scope to avoid abuse. PASS.

No violations identified; proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-advanced-gh-discovery/
├── plan.md          # This file (/speckit.plan output)
├── research.md      # Phase 0: decisions & rationale
├── data-model.md    # Phase 1: entities & relationships
├── quickstart.md    # Phase 1: how to use advanced discovery
├── contracts/       # Phase 1: API/interaction contracts for services
└── tasks.md         # Phase 2: concrete implementation tasks (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── services/
│   ├── searchProfilesService.js      # Manage SearchProfile CRUD & recipes
│   ├── discoveryEngine.js           # Build queries, orchestrate fetches
│   ├── scoringEngine.js             # Compute multi-factor scores (pure)
│   ├── snapshotsService.js          # Manage RepositorySnapshot storage
│   ├── comparisonService.js         # Build ComparisonSets & summaries
│   └── exemplarsService.js          # Track exemplar projects & signals
├── components/
│   ├── AdvancedDiscoveryPanel.jsx   # UI for filters & recipes
│   ├── DiscoveryResultsView.jsx     # Ranked list with score breakdowns
│   ├── TrendsAndSnapshotsView.jsx   # Historical charts & freshness indicators
│   ├── ComparisonDashboard.jsx      # Side-by-side repo comparison
│   └── NLQueryExplainer.jsx         # Show NL intent → concrete criteria
└── mcp/ or integrations/
    └── (optional) export surfaces for agentic tooling
```

**Structure Decision**: Extend existing `src/services` and `src/components`
with dedicated, small modules as listed above. No new top-level apps.

## Complexity Tracking

>No constitution violations currently planned; leave table empty unless
>future changes introduce exceptions.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|----------|------------|----------------------------------------|
