<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Modified principles: Template placeholders replaced with concrete principles
- Added sections: Section 2 (Architecture & Quality Constraints), Section 3 (Workflow & Quality Gates)
- Removed sections: None (template fully specialized)
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (aligned conceptually; uses Constitution Check as gate)
  - ✅ .specify/templates/spec-template.md (no conflicting guidance; remains compatible)
  - ✅ .specify/templates/tasks-template.md (reinforces incremental, testable tasks; compatible)
- Deferred TODOs:
  - TODO(RATIFICATION_DATE): Set original ratification date if project owners know it
-->

# ghRadar Constitution

## Core Principles

### I. Clear Purpose & Signal-First Discovery

Every feature MUST strengthen ghRadar's primary mission: provide high-signal, trustworthy
intelligence about GitHub projects and ecosystems. We prioritize:
- Meaningful ranking over raw lists
- Transparency of why items rank highly
- Features that help users decide quickly, not just browse longer

Rationale: ghRadar exists to cut through noise. All code, data, and UX should make
"What matters and why?" obvious.

### II. Clean, Composable Architecture

The codebase MUST remain small, readable, and modular:
- Prefer pure, composable functions and well-factored services over ad-hoc logic
- Keep components focused; each module has a single clear responsibility
- Avoid premature abstractions; introduce them only when duplication and usage warrant it
- All integrations (GitHub, MCP, agents, storage) go through dedicated service layers

Rationale: A lean, well-structured architecture makes it easy to extend discovery logic
and evolve scoring models without regressions.

### III. Testable, Verifiable Behavior (Non-Negotiable)

Critical behavior MUST be verifiable:
- Scoring, filtering, and ranking logic MUST be covered by automated tests
- Data transformation functions SHOULD be pure and directly testable
- When adding complex logic, follow a Red → Green → Refactor mindset, even if not fully formalized
- No "magic" heuristics without fixtures or examples demonstrating expected outcomes

Rationale: Deterministic, testable logic is essential for trust in ranking and insights.

### IV. Observability & Data Lineage

All non-trivial computations that influence rankings or insights MUST be explainable:
- For each score, we can show its inputs and weight contributions
- Important background jobs (syncs, scans) expose status, timestamps, and error surfaces
- When approximations are used (due to rate limits or sampling), this is clearly indicated

Rationale: Users and agents must understand how conclusions were reached.

### V. Simplicity, Performance & Responsible API Usage

The system MUST remain responsive and respectful of upstream limits:
- Avoid unnecessary GitHub calls; cache and reuse data where possible
- Batch and schedule heavy operations; always consider rate limits
- Prefer straightforward solutions over complex frameworks unless clearly justified
- Keep UI interactions fast; degrade gracefully when data is incomplete or delayed

Rationale: A simple, fast system is easier to maintain, safer for APIs, and better for users.

## Architecture & Quality Constraints

- Client-first experience with a clear separation between UI, data services, and scoring logic
- All external calls (GitHub REST/GraphQL, trending APIs, MCP tools) go through well-defined
  adapters in `services/` or equivalent
- Persistent storage (when used) MUST have a clear schema for:
  - Repository snapshots
  - Time-series metrics
  - Saved queries/recipes
  - Auditability of how recommendations were generated
- No hard-coding of secrets; configuration via environment or secure mechanisms only
- New dependencies MUST be:
  - Justified (clear benefit vs. cost)
  - Minimal (avoid overlapping libraries and heavy frameworks)

## Development Workflow, Review Process & Quality Gates

- Every feature/change proposal SHOULD start from a short spec using the templates in `.specify/`
- Plans and tasks MUST:
  - Map to user-facing value
  - Keep work deliverable in small, independently testable increments
- Code review MUST verify:
  - Alignment with Core Principles
  - Clear ownership and naming
  - Tests and/or examples for non-trivial logic
  - No unnecessary complexity or duplication
- Any change to scoring or selection logic MUST include:
  - Example scenarios
  - Before/after expectations
  - Notes on potential impact to users

## Governance

- This Constitution guides how ghRadar is designed, implemented, and reviewed. In conflicts,
  it supersedes ad-hoc preferences.
- Amendments:
  - Require clear rationale and review in a PR
  - MUST update this file, including version and Last Amended date
  - MUST consider impact on specs, plans, and tasks templates
- Versioning:
  - MAJOR: Changing or removing core principles
  - MINOR: Adding principles/sections or materially changing guidance
  - PATCH: Clarifications without behavioral or governance change
- Compliance:
  - Reviewers are responsible for calling out violations
  - Exceptions MUST be documented with a concrete reason and, when possible, a timebox

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): set by maintainers | **Last Amended**: 2025-11-10