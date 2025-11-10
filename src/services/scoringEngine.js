// ScoringEngine
// Deterministic, side-effect free scoring based on metrics + weights.

const DEFAULT_WEIGHTS = {
  activity: 0.25,
  momentum: 0.2,
  quality: 0.2,
  community: 0.15,
  relevance: 0.1,
  reputation: 0.1,
};

// Normalize a metric into [0,1] with simple caps
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

const scoreActivity = (m) => {
  const commits = clamp01((m.recentCommits || 0) / 30);
  const contributors = clamp01((m.recentContributors || 0) / 10);
  return (commits * 0.6 + contributors * 0.4) * 100;
};

const scoreMomentum = (m) => {
  const starsDelta = clamp01((m.starsDelta || 0) / 200);
  return starsDelta * 100;
};

const scoreQuality = (m) => {
  const signals = [m.hasReadme, m.hasLicense, m.hasTests, m.hasCi].filter(Boolean)
    .length;
  return (signals / 4) * 100;
};

const scoreCommunity = (m) => {
  const stars = clamp01((m.stars || 0) / 5000);
  const watchers = clamp01((m.watchers || 0) / 500);
  const forks = clamp01((m.forks || 0) / 500);
  return (stars * 0.5 + watchers * 0.25 + forks * 0.25) * 100;
};

const scoreRelevance = (m) => {
  // Expect `m.relevanceScore` (0-1) from upstream query/keyword matching.
  const r = clamp01(m.relevanceScore ?? 0);
  return r * 100;
};

const scoreReputation = (m) => {
  // Placeholder deterministic mapping; can use owner/org trust hints later.
  const r = clamp01(m.reputationScore ?? 0);
  return r * 100;
};

export const scoreRepository = (metrics, weights = DEFAULT_WEIGHTS) => {
  const activity = scoreActivity(metrics);
  const momentum = scoreMomentum(metrics);
  const quality = scoreQuality(metrics);
  const community = scoreCommunity(metrics);
  const relevance = scoreRelevance(metrics);
  const reputation = scoreReputation(metrics);

  const overall =
    activity * (weights.activity ?? 0) +
    momentum * (weights.momentum ?? 0) +
    quality * (weights.quality ?? 0) +
    community * (weights.community ?? 0) +
    relevance * (weights.relevance ?? 0) +
    reputation * (weights.reputation ?? 0);

  return {
    overall,
    activity,
    momentum,
    quality,
    community,
    relevance,
    reputation,
  };
};
