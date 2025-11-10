# Tasks: 001-advanced-gh-discovery

## Phase 0 – Prerequisites & Context

- [X] Confirm feature spec, plan, research, and contracts exist
- [X] Confirm data model file exists
- [X] Confirm checklists directory and baseline checklists (requirements) exist

## Phase 1 – Core Services & Models

- [ ] Define TypeScript/JS models for:
  - [ ] SearchProfile
  - [ ] ScoringProfile
  - [ ] RepositorySnapshot
  - [ ] ComparisonSet
  - [ ] ExemplarProject
- [X] Implement `src/services/searchProfilesService.js`:
  - [ ] CRUD for SearchProfile (in-memory + simple persistence hook)
  - [ ] Load curated preset profiles ("Top Agent Frameworks", etc.)
- [X] Implement `src/services/scoringEngine.js` (pure functions):
  - [ ] Compute category scores (activity, momentum, quality, community, relevance, reputation)
  - [ ] Compute overall score via weighted sum
  - [ ] Expose clear inputs/outputs for testing
- [X] Implement `src/services/discoveryEngine.js`:
  - [ ] Translate SearchProfile.filters into GitHub API queries
  - [ ] Use existing axios GitHub client/service
  - [ ] Fetch repository + activity metadata in batches
  - [ ] Call ScoringEngine to score each repo
  - [ ] Return ranked `RepositorySnapshot[]` (latest snapshot only)
- [X] Implement `src/services/snapshotsService.js`:
  - [ ] Save snapshots keyed by profileId + repoId + timestamp
  - [ ] List snapshots by profileId (and optional repoId)
  - [ ] Support in-memory store with pluggable persistence
- [X] Implement `src/services/comparisonService.js`:
  - [ ] Build ComparisonSet from repoIds
  - [ ] Attach relevant RepositorySnapshots for comparison view
- [X] Implement `src/services/exemplarsService.js`:
  - [ ] Manage ExemplarProject records (list/save)
  - [ ] Support tags/rationale/lastReviewedAt

## Phase 2 – UI Components (Advanced Discovery)

- [ ] `AdvancedDiscoveryPanel.jsx`:
  - [ ] UI for building/editing SearchProfiles (filters + scoring profile selection)
  - [ ] Preset recipe selector
  - [ ] Save/update/delete SearchProfiles via service
- [ ] `DiscoveryResultsView.jsx`:
  - [ ] Display ranked repositories returned from DiscoveryEngine
  - [ ] Show score breakdown (overall + factors)
  - [ ] Surface key metadata (activity, quality indicators, freshness)
- [ ] `TrendsAndSnapshotsView.jsx`:
  - [ ] Show historical metrics for a selected repo/profile from SnapshotsService
  - [ ] Indicate snapshot freshness and gaps
- [ ] `ComparisonDashboard.jsx`:
  - [ ] Select or define ComparisonSet
  - [ ] Show side-by-side metrics/scores across repos
- [ ] `NLQueryExplainer.jsx`:
  - [ ] Given an NL-style intent, show the concrete SearchProfile criteria/recipe used

## Phase 3 – Agentic & Export Surfaces

- [ ] Implement JSON export endpoints/views (frontend-only or thin integration layer):
  - [ ] Current ranked lists for a SearchProfile
  - [ ] Historical snapshots for a SearchProfile
  - [ ] Exemplar project sets
- [ ] Ensure outputs are stable, documented, and consumable by agents

## Phase 4 – Testing & Validation

- [X] Add unit tests for ScoringEngine (pure, deterministic)
- [X] Add tests for SearchProfilesService presets and CRUD
- [X] Add tests for DiscoveryEngine query-building and basic integration (mock GitHub service)
- [X] Add tests for SnapshotsService storage/listing
- [X] Add tests for ComparisonService and ExemplarService behavior
- [ ] Add basic UI tests (where appropriate) for AdvancedDiscoveryPanel and ResultsView

## Phase 5 – Performance, Resilience, Polish

- [ ] Ensure GitHub API usage respects rate limits (batching, minimal scopes)
- [ ] Guard against empty/partial data; show caveats in UI
- [ ] Confirm snapshot operations do not lock UI (batched/async)
- [ ] Review for clear naming, comments where non-obvious, and removal of dead code
- [ ] Update any relevant README/quickstart sections if needed

## Phase 6 – Readiness Check

- [ ] All checklist files for this feature are PASS (no `- [ ]` remaining)
- [ ] All tasks above are checked `[X]` or intentionally deferred with rationale
- [ ] Tests are passing locally (or failures documented with reasons)
- [ ] Implementation matches `spec.md`, `plan.md`, and `contracts/search-and-scoring.md`
