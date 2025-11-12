// DiscoveryEngine
// Build GitHub search queries from SearchProfile and score results.

const axios = require('axios');
const { scoreRepository } = require('./scoringEngine');

const GITHUB_API_BASE = 'https://api.github.com';

const api = axios.create({
  baseURL: GITHUB_API_BASE,
  timeout: 10000,
});

const buildSearchQuery = (filters = {}) => {
  const {
    keywords = [],
    topics = [],
    language,
    minCommitsLast30Days,
    minContributors,
    excludeArchived = true,
    requireReadme,
  } = filters;

  const q = [];

  if (keywords.length) {
    q.push(keywords.join(' '));
  }

  if (topics.length) {
    topics.forEach((t) => q.push(`topic:${t}`));
  }

  if (language) {
    q.push(`language:${language}`);
  }

  if (excludeArchived) {
    q.push('archived:false');
  }

  // Activity / contributors are approximated via qualifiers when possible
  if (typeof minCommitsLast30Days === 'number') {
    q.push(`pushed:>=${daysAgoIso(30)}`);
  }

  // No direct qualifier for contributors in GitHub search API
  // This is tracked separately in mapToMetrics and evaluated in scoring

  if (requireReadme) {
    q.push('readme:present');
  }

  return q.join(' ');
};

const daysAgoIso = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};

const mapToMetrics = (repo) => {
  return {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    hasReadme: true, // refined with follow-up calls in future
    hasLicense: Boolean(repo.license),
    hasTests: false,
    hasCi: false,
    recentCommits: 0,
    recentContributors: 0,
    starsDelta: 0,
    relevanceScore: 1, // from matching; kept simple for now
    reputationScore: 0,
  };
};

const runAdvancedSearch = async (profile) => {
  if (!profile) throw new Error('SearchProfile is required');

  const q = buildSearchQuery(profile.filters || {});

  try {
    const response = await api.get('/search/repositories', {
      params: {
        q,
        sort: 'stars',
        order: 'desc',
        per_page: 50,
      },
    });

    const items = response.data.items || [];

    const snapshots = items.map((repo) => {
      const metrics = mapToMetrics(repo);
      const scores = scoreRepository(metrics);
      return {
        id: `${profile.id || 'profile'}:${repo.full_name}:${
          new Date().toISOString()
        }`,
        repoId: repo.full_name,
        collectedAt: new Date().toISOString(),
        metrics,
        scores,
        source: 'github-search-v1',
      };
    });

    // Sort by overall score descending
    snapshots.sort((a, b) => b.scores.overall - a.scores.overall);

    return snapshots;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded during advanced search.');
    }
    throw new Error('Failed to execute advanced search.');
  }
};
module.exports = {
  runAdvancedSearch,
};