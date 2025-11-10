# Research & Decisions: Advanced GitHub Discovery & Agentic Intelligence

## Goals

Summarize key decisions and rationale for:
- How to query GitHub effectively for multi-factor discovery.
- How to represent scores, snapshots, and comparisons simply and transparently.
- How to expose results for agentic consumption without over-complicating stack.

## Key Decisions

### 1. GitHub Data Access

**Decision**: Use GitHub REST and/or GraphQL APIs via existing axios-based
service layer; no direct scraping or heavy external tooling.

**Rationale**: Aligns with ToS, keeps integration simple, and matches existing
project patterns.

**Alternatives Considered**:
- Third-party aggregators: rejected to retain control and transparency.
- Custom crawlers: rejected as overkill and fragile.

### 2. Search Profiles & Recipes

**Decision**: Represent advanced queries as structured `SearchProfile` objects
that encode filters and scoring preferences; provide a small set of curated
recipes for common intents (e.g., "top agent frameworks", "emerging projects").

**Rationale**: Keeps UI/agent interfaces declarative and explainable; enables
reuse and evolution.

**Alternatives Considered**:
- Free-form NL only: rejected as opaque and hard to debug.
- Hard-coded filters: rejected as inflexible.

### 3. Scoring Model

**Decision**: Implement scoring as deterministic, pure functions with
configurable weights over clear inputs (activity, momentum, quality, community,
relevance, reputation hints).

**Rationale**: Ensures explainability, testability, and easy tuning.

**Alternatives Considered**:
- Opaque ML ranking: rejected for initial phase due to complexity and lack of
  transparency.

### 4. Snapshots & Persistence

**Decision**: Store time-stamped `RepositorySnapshot` records for tracked
repos; start with in-memory + JSON/state persistence, with an option to back by
IndexedDB/local storage if needed.

**Rationale**: Satisfies trend/comparison needs without adding a backend.

**Alternatives Considered**:
- Full backend service: deferred; adds operational overhead.

### 5. Agentic Integration

**Decision**: Expose machine-readable views (JSON exports or similar) of
ranked lists, snapshots, and exemplar sets; wire into Claude Code / MCP via a
thin integration layer.

**Rationale**: Enables headless/agent use while keeping core app simple.

**Alternatives Considered**:
- Deep coupling to specific agent frameworks: rejected to remain neutral.

## Clarifications Resolved

No blocking clarifications remain; unspecified tuning (e.g., exact thresholds,
weights) will be treated as configuration, not spec changes.
