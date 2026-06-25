// Models for Advanced GitHub Discovery
// TypeScript-like JSDoc annotations for IDE support

/**
 * @typedef {Object} SearchProfile
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {Object} filters
 * @property {string[]} [filters.keywords]
 * @property {string[]} [filters.topics]
 * @property {string} [filters.language]
 * @property {number} [filters.minCommitsLast30Days]
 * @property {number} [filters.minContributors]
 * @property {boolean} [filters.excludeArchived]
 * @property {boolean} [filters.requireReadme]
 * @property {string} scoringProfileId
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ScoringProfile
 * @property {string} id
 * @property {string} name
 * @property {Object} weights
 * @property {number} [weights.activity=0.25]
 * @property {number} [weights.momentum=0.2]
 * @property {number} [weights.quality=0.2]
 * @property {number} [weights.community=0.15]
 * @property {number} [weights.relevance=0.1]
 * @property {number} [weights.reputation=0.1]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} RepositorySnapshot
 * @property {string} id - Format: profileId:repoId:timestamp
 * @property {string} repoId - Format: owner/name
 * @property {string} collectedAt - ISO timestamp
 * @property {Object} metrics
 * @property {number} [metrics.stars]
 * @property {number} [metrics.starsDelta]
 * @property {number} [metrics.forks]
 * @property {number} [metrics.watchers]
 * @property {number} [metrics.recentCommits]
 * @property {number} [metrics.recentContributors]
 * @property {number} [metrics.openIssues]
 * @property {number} [metrics.closedIssues]
 * @property {number} [metrics.openPRs]
 * @property {number} [metrics.closedPRs]
 * @property {boolean} [metrics.hasReadme]
 * @property {boolean} [metrics.hasLicense]
 * @property {boolean} [metrics.hasTests]
 * @property {boolean} [metrics.hasCi]
 * @property {Object} scores
 * @property {number} scores.overall
 * @property {number} [scores.activity]
 * @property {number} [scores.momentum]
 * @property {number} [scores.quality]
 * @property {number} [scores.community]
 * @property {number} [scores.relevance]
 * @property {number} [scores.reputation]
 * @property {string} [source] - API variant / notes
 */

/**
 * @typedef {Object} ComparisonSet
 * @property {string} id
 * @property {string} label
 * @property {string[]} repoIds
 * @property {string|null} relatedSearchProfileId
 * @property {string} createdAt
 * @property {RepositorySnapshot[]} [snapshots] - Populated by ComparisonService
 */

/**
 * @typedef {Object} ExemplarProject
 * @property {string} repoId - Format: owner/name
 * @property {string[]} tags - e.g., ["agent-framework", "high-quality-agent-config"]
 * @property {string} rationale
 * @property {string} lastReviewedAt - ISO timestamp
 */

/**
 * @typedef {Object} ScoreBreakdown
 * @property {number} overall
 * @property {number} activity
 * @property {number} momentum
 * @property {number} quality
 * @property {number} community
 * @property {number} relevance
 * @property {number} reputation
 */

// Default scoring weights
const DEFAULT_SCORING_PROFILE = {
  id: 'default-v1',
  name: 'Default Scoring',
  weights: {
    activity: 0.25,
    momentum: 0.2,
    quality: 0.2,
    community: 0.15,
    relevance: 0.1,
    reputation: 0.1,
  },
  notes: 'Balanced weights for general repository discovery',
};

/**
 * Create a new SearchProfile with defaults
 * @param {Partial<SearchProfile>} data
 * @returns {SearchProfile}
 */
const createSearchProfile = (data = {}) => {
  // Extract known fields, preserve the rest
  const { id, name, description, filters, scoringProfileId, createdAt, updatedAt, ...extra } = data;
  return {
    id: id || `profile-${Date.now()}`,
    name: name || 'New Profile',
    description: description || '',
    filters: {
      keywords: filters?.keywords || [],
      topics: filters?.topics || [],
      language: filters?.language || '',
      minCommitsLast30Days: filters?.minCommitsLast30Days || 5,
      minContributors: filters?.minContributors || 2,
      excludeArchived: filters?.excludeArchived !== false,
      requireReadme: filters?.requireReadme || false,
      ...filters,
    },
    scoringProfileId: scoringProfileId || DEFAULT_SCORING_PROFILE.id,
    createdAt: createdAt || new Date().toISOString(),
    updatedAt: updatedAt || new Date().toISOString(),
    ...extra,
  };
};

/**
 * Create a new RepositorySnapshot
 * @param {Partial<RepositorySnapshot>} data
 * @returns {RepositorySnapshot}
 */
const createRepositorySnapshot = (data = {}) => ({
  id: data.id || `${data.profileId || 'profile'}:${data.repoId}:${Date.now()}`,
  repoId: data.repoId || '',
  collectedAt: data.collectedAt || new Date().toISOString(),
  metrics: {
    stars: data.metrics?.stars || 0,
    starsDelta: data.metrics?.starsDelta || 0,
    forks: data.metrics?.forks || 0,
    watchers: data.metrics?.watchers || 0,
    recentCommits: data.metrics?.recentCommits || 0,
    recentContributors: data.metrics?.recentContributors || 0,
    openIssues: data.metrics?.openIssues || 0,
    closedIssues: data.metrics?.closedIssues || 0,
    openPRs: data.metrics?.openPRs || 0,
    closedPRs: data.metrics?.closedPRs || 0,
    hasReadme: data.metrics?.hasReadme || false,
    hasLicense: data.metrics?.hasLicense || false,
    hasTests: data.metrics?.hasTests || false,
    hasCi: data.metrics?.hasCi || false,
    ...data.metrics,
  },
  scores: {
    overall: data.scores?.overall || 0,
    activity: data.scores?.activity || 0,
    momentum: data.scores?.momentum || 0,
    quality: data.scores?.quality || 0,
    community: data.scores?.community || 0,
    relevance: data.scores?.relevance || 0,
    reputation: data.scores?.reputation || 0,
    ...data.scores,
  },
  source: data.source || 'unknown',
});

/**
 * Create a new ComparisonSet
 * @param {Partial<ComparisonSet>} data
 * @returns {ComparisonSet}
 */
const createComparisonSet = (data = {}) => ({
  id: data.id || `comparison-${Date.now()}`,
  label: data.label || 'New Comparison',
  repoIds: data.repoIds || [],
  relatedSearchProfileId: data.relatedSearchProfileId || null,
  createdAt: data.createdAt || new Date().toISOString(),
});

/**
 * Create a new ExemplarProject
 * @param {Partial<ExemplarProject>} data
 * @returns {ExemplarProject}
 */
const createExemplarProject = (data = {}) => ({
  repoId: data.repoId || '',
  tags: data.tags || [],
  rationale: data.rationale || '',
  lastReviewedAt: data.lastReviewedAt || new Date().toISOString(),
});

module.exports = {
  createSearchProfile,
  createRepositorySnapshot,
  createComparisonSet,
  createExemplarProject,
  DEFAULT_SCORING_PROFILE,
};
