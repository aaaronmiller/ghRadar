# Tasks: 001-advanced-gh-discovery

## Phase 0 – Prerequisites & Context

- [X] Confirm feature spec, plan, research, and contracts exist
- [X] Confirm data model file exists
- [X] Confirm checklists directory and baseline checklists (requirements) exist

## Phase 1 – Core Services & Models

- [X] Define TypeScript/JS models for:
  - [X] SearchProfile
  - [X] ScoringProfile
  - [X] RepositorySnapshot
  - [X] ComparisonSet
  - [X] ExemplarProject
- [X] Implement `src/services/searchProfilesService.js`:
  - [X] CRUD for SearchProfile (in-memory + simple persistence hook)
  - [X] Load curated preset profiles ("Top Agent Frameworks", etc.)
- [X] Implement `src/services/scoringEngine.js` (pure functions):
  - [X] Compute category scores (activity, momentum, quality, community, relevance, reputation)
  - [X] Compute overall score via weighted sum
  - [X] Expose clear inputs/outputs for testing
- [X] Implement `src/services/discoveryEngine.js`:
  - [X] Translate SearchProfile.filters into GitHub API queries
  - [X] Use existing axios GitHub client/service
  - [X] Fetch repository + activity metadata in batches
  - [X] Call ScoringEngine to score each repo
  - [X] Return ranked `RepositorySnapshot[]` (latest snapshot only)
- [X] Implement `src/services/snapshotsService.js`:
  - [X] Save snapshots keyed by profileId + repoId + timestamp
  - [X] List snapshots by profileId (and optional repoId)
  - [X] Support in-memory store with pluggable persistence
- [X] Implement `src/services/comparisonService.js`:
  - [X] Build ComparisonSet from repoIds
  - [X] Attach relevant RepositorySnapshots for comparison view
- [X] Implement `src/services/exemplarsService.js`:
  - [X] Manage ExemplarProject records (list/save)
  - [X] Support tags/rationale/lastReviewedAt

## Phase 2 – UI Components (Advanced Discovery)

- [X] `AdvancedDiscoveryPanel.jsx`:
  - [X] UI for building/editing SearchProfiles (filters + scoring profile selection)
  - [X] Preset recipe selector
  - [X] Save/update/delete SearchProfiles via service
- [X] `DiscoveryResultsView.jsx`:
  - [X] Display ranked repositories returned from DiscoveryEngine
  - [X] Show score breakdown (overall + factors)
  - [X] Surface key metadata (activity, quality indicators, freshness)
- [X] `TrendsAndSnapshotsView.jsx`:
  - [X] Show historical metrics for a selected repo/profile from SnapshotsService
  - [X] Indicate snapshot freshness and gaps
- [X] `ComparisonDashboard.jsx`:
  - [X] Select or define ComparisonSet
  - [X] Show side-by-side metrics/scores across repos
- [X] `NLQueryExplainer.jsx`:
  - [X] Given an NL-style intent, show the concrete SearchProfile criteria/recipe used

## Phase 3 – Agentic & Export Surfaces

- [X] Implement JSON export endpoints/views (frontend-only or thin integration layer):
  - [X] Current ranked lists for a SearchProfile
  - [X] Historical snapshots for a SearchProfile
  - [X] Exemplar project sets
- [X] Ensure outputs are stable, documented, and consumable by agents

## Phase 4 – Testing & Validation

- [X] Add unit tests for ScoringEngine (pure, deterministic)
- [X] Add tests for SearchProfilesService presets and CRUD
- [X] Add tests for DiscoveryEngine query-building and basic integration (mock GitHub service)
- [X] Add tests for SnapshotsService storage/listing
- [X] Add tests for ComparisonService and ExemplarService behavior
- [ ] Add basic UI tests (where appropriate) for AdvancedDiscoveryPanel and ResultsView (DEFERRED - requires React Testing Library integration)

## Phase 5 – Performance, Resilience, Polish

- [ ] Ensure GitHub API usage respects rate limits (batching, minimal scopes)
- [ ] Guard against empty/partial data; show caveats in UI
- [ ] Confirm snapshot operations do not lock UI (batched/async)
- [ ] Review for clear naming, comments where non-obvious, and removal of dead code
- [ ] Update any relevant README/quickstart sections if needed

## Phase 6 – Readiness Check

- [ ] All checklist files for this feature are PASS (no `- [ ]` remaining)
- [ ] All tasks above are checked `[X]` or intentionally deferred with rationale
- [X] Tests are passing locally (42/42 pass)
- [ ] Implementation matches `spec.md`, `plan.md`, and `contracts/search-and-scoring.md`
