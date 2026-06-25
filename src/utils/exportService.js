import {
  createSearchProfile,
  createRepositorySnapshot,
  createComparisonSet,
  createExemplarProject,
  DEFAULT_SCORING_PROFILE,
} from '../models';

/**
 * Export utilities for JSON export and data persistence
 */

/**
 * Export search results to JSON format
 * @param {Object[]} results - Array of search results
 * @param {Object} options - Export options
 * @returns {string} JSON string
 */
export const exportSearchResults = (results, options = {}) => {
  const {
    includeMetrics = true,
    includeScores = true,
    includeTimestamps = true,
    prettyPrint = true,
  } = options;

  const exportData = results.map(repo => {
    const entry = {
      repoId: repo.repoId,
      description: repo.description,
      url: repo.url || `https://github.com/${repo.repoId}`,
      owner: {
        login: repo.owner?.login || repo.repoId?.split('/')[0],
        avatarUrl: repo.owner?.avatar_url,
      },
    };

    if (includeMetrics && repo.metrics) {
      entry.metrics = {
        stars: repo.metrics.stars,
        forks: repo.metrics.forks,
        watchers: repo.metrics.watchers,
        openIssues: repo.metrics.openIssues,
        openPRs: repo.metrics.openPRs,
        recentCommits: repo.metrics.recentCommits,
        recentContributors: repo.metrics.recentContributors,
        language: repo.metrics.language,
        hasReadme: repo.metrics.hasReadme,
        hasLicense: repo.metrics.hasLicense,
        hasTests: repo.metrics.hasTests,
        hasCi: repo.metrics.hasCi,
      };
    }

    if (includeScores && repo.scores) {
      entry.scores = {
        overall: repo.scores.overall,
        activity: repo.scores.activity,
        momentum: repo.scores.momentum,
        quality: repo.scores.quality,
        community: repo.scores.community,
        relevance: repo.scores.relevance,
        reputation: repo.scores.reputation,
      };
    }

    if (includeTimestamps) {
      entry.exportedAt = new Date().toISOString();
    }

    return entry;
  });

  return prettyPrint ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
};

/**
 * Export snapshots to JSON format
 * @param {Object[]} snapshots - Array of repository snapshots
 * @param {Object} options - Export options
 * @returns {string} JSON string
 */
export const exportSnapshots = (snapshots, options = {}) => {
  const {
    prettyPrint = true,
    groupByRepo = false,
  } = options;

  if (groupByRepo) {
    const grouped = snapshots.reduce((acc, snapshot) => {
      const repoId = snapshot.repoId;
      if (!acc[repoId]) {
        acc[repoId] = [];
      }
      acc[repoId].push(snapshot);
      return acc;
    }, {});

    const exportData = Object.entries(grouped).map(([repoId, repoSnapshots]) => ({
      repoId,
      snapshots: repoSnapshots.map(s => ({
        ...s,
        collectedAt: new Date(s.collectedAt).toISOString(),
      })),
      snapshotCount: repoSnapshots.length,
      dateRange: {
        earliest: repoSnapshots[0]?.collectedAt,
        latest: repoSnapshots[repoSnapshots.length - 1]?.collectedAt,
      },
    }));

    return prettyPrint ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
  }

  const exportData = snapshots.map(s => ({
    ...s,
    collectedAt: new Date(s.collectedAt).toISOString(),
    exportedAt: new Date().toISOString(),
  }));

  return prettyPrint ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
};

/**
 * Export comparison sets to JSON format
 * @param {Object[]} comparisons - Array of comparison sets
 * @param {Object} options - Export options
 * @returns {string} JSON string
 */
export const exportComparisons = (comparisons, options = {}) => {
  const {
    includeSnapshots = true,
    prettyPrint = true,
  } = options;

  const exportData = comparisons.map(comp => {
    const entry = {
      id: comp.id,
      label: comp.label,
      repoIds: comp.repoIds,
      relatedSearchProfileId: comp.relatedSearchProfileId,
      createdAt: comp.createdAt,
      exportedAt: new Date().toISOString(),
    };

    if (includeSnapshots && comp.snapshots) {
      entry.snapshots = comp.snapshots.map(s => ({
        ...s,
        collectedAt: new Date(s.collectedAt).toISOString(),
      }));
    }

    return entry;
  });

  return prettyPrint ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
};

/**
 * Export search profiles to JSON format
 * @param {Object[]} profiles - Array of search profiles
 * @param {Object} options - Export options
 * @returns {string} JSON string
 */
export const exportProfiles = (profiles, options = {}) => {
  const {
    prettyPrint = true,
  } = options;

  const exportData = profiles.map(profile => ({
    ...profile,
    createdAt: new Date(profile.createdAt).toISOString(),
    updatedAt: new Date(profile.updatedAt).toISOString(),
    exportedAt: new Date().toISOString(),
  }));

  return prettyPrint ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
};

/**
 * Export everything (full backup)
 * @param {Object} data - All data to export
 * @param {Object} options - Export options
 * @returns {string} JSON string
 */
export const exportAll = (data, options = {}) => {
  const {
    prettyPrint = true,
  } = options;

  const exportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    profiles: data.profiles || [],
    snapshots: data.snapshots || [],
    comparisons: data.comparisons || [],
    exemplars: data.exemplars || [],
  };

  return prettyPrint ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
};

/**
 * Import data from JSON
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} Parsed data object
 */
export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);

    // Validate basic structure
    if (data.version) {
      // Full backup format
      return {
        profiles: data.profiles || [],
        snapshots: data.snapshots || [],
        comparisons: data.comparisons || [],
        exemplars: data.exemplars || [],
        importedAt: new Date().toISOString(),
      };
    }

    // Assume it's a profiles array
    if (Array.isArray(data)) {
      return {
        profiles: data,
        importedAt: new Date().toISOString(),
      };
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to parse import data: ${error.message}`);
  }
};

/**
 * Download data as JSON file
 * @param {string} data - JSON string to download
 * @param {string} filename - Filename for download
 */
export const downloadAsJson = (data, filename) => {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate filename with timestamp
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension (default: 'json')
 * @returns {string} Filename with timestamp
 */
export const generateFilename = (prefix, extension = 'json') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}-${timestamp}.${extension}`;
};
