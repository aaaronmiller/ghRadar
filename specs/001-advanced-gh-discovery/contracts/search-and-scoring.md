# Contracts: Search & Scoring Services

## DiscoveryEngine

### `runAdvancedSearch(profile: SearchProfile): Promise<RepositorySnapshot[]>`
- Input: `SearchProfile` (filters + scoringProfileId)
- Behavior:
  - Build GitHub queries from filters
  - Fetch repo + activity metadata via GitHub APIs
  - Delegate scoring to ScoringEngine
- Output:
  - Array of `RepositorySnapshot` (latest snapshot only for this run)

## SearchProfilesService

### `listProfiles(): Promise<SearchProfile[]>`
### `saveProfile(profile: SearchProfile): Promise<void>`
### `deleteProfile(id: string): Promise<void>`

## ScoringEngine

### `scoreRepository(input): Scores`
- Deterministic function from metrics → scores
- No side effects; suitable for unit testing

## SnapshotsService

### `saveSnapshots(profileId: string, snapshots: RepositorySnapshot[]): Promise<void>`
### `listSnapshots(profileId: string, repoId?: string): Promise<RepositorySnapshot[]>`

## ComparisonService

### `buildComparison(set: ComparisonSet): Promise<ComparisonSet & { snapshots: RepositorySnapshot[] }>`

## ExemplarService

### `listExemplars(): Promise<ExemplarProject[]>`
### `saveExemplar(exemplar: ExemplarProject): Promise<void>`


All contracts are logical; actual implementation details (modules, filenames)
MUST follow ghRadar's existing service patterns.
