# Data Model: Advanced GitHub Discovery & Agentic Intelligence

## Entities

### SearchProfile
- `id`: string
- `name`: string
- `description`: string
- `filters`: object
  - e.g., keywords, topics, minCommits, minContributors, date ranges,
    language, size bounds, archived/fork flags
- `scoringProfileId`: string
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

### ScoringProfile
- `id`: string
- `name`: string
- `weights`: object
  - `activity`: number
  - `momentum`: number
  - `quality`: number
  - `community`: number
  - `relevance`: number
  - `reputation`: number
- `notes`: string

### RepositorySnapshot
- `id`: string (SearchProfile + repo + timestamp)
- `repoId`: string (e.g., `owner/name`)
- `collectedAt`: ISO timestamp
- `metrics`: object
  - `stars`, `starsDelta`, `forks`, `watchers`
  - `recentCommits`, `recentContributors`
  - `openIssues`, `closedIssues`, `openPRs`, `closedPRs`
  - `hasReadme`, `hasLicense`, `hasTests`, `hasCi`
- `scores`: object
  - `overall`: number
  - `activity`, `momentum`, `quality`, `community`, `relevance`, `reputation`: number
- `source`: string (API variant / notes)

### ComparisonSet
- `id`: string
- `label`: string
- `repoIds`: string[]
- `relatedSearchProfileId`: string | null
- `createdAt`: ISO timestamp

### ExemplarProject
- `repoId`: string
- `tags`: string[]
- `rationale`: string
- `lastReviewedAt`: ISO timestamp

## Notes

- All IDs and timestamps are strings for frontend simplicity.
- Models are implementation-agnostic; they describe logical structure, not storage engine.
