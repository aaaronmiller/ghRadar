import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Star, GitFork, TrendingUp, Users, Code, Calendar,
  ExternalLink, Award, Zap, ArrowUpDown, Filter, ChevronDown
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';

/**
 * DiscoveryResultsView - Display search results with scores and comparison
 * Integrates with DiscoveryEngine, ScoringEngine, and SnapshotsService
 */
const DiscoveryResultsView = ({
  results = [],
  loading = false,
  error = null,
  onRetry,
  onCompare,
  onViewTrends,
  selectedRepos = [],
  onToggleSelect,
  sortBy = 'overall',
  sortOrder = 'desc',
  onSortChange,
}) => {
  // Sort results based on current sort settings
  const sortedResults = useMemo(() => {
    if (!results.length) return [];

    const sorted = [...results].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'stars':
          aVal = a.metrics?.stars || 0;
          bVal = b.metrics?.stars || 0;
          break;
        case 'forks':
          aVal = a.metrics?.forks || 0;
          bVal = b.metrics?.forks || 0;
          break;
        case 'activity':
          aVal = a.scores?.activity || 0;
          bVal = b.scores?.activity || 0;
          break;
        case 'momentum':
          aVal = a.scores?.momentum || 0;
          bVal = b.scores?.momentum || 0;
          break;
        case 'quality':
          aVal = a.scores?.quality || 0;
          bVal = b.scores?.quality || 0;
          break;
        case 'overall':
        default:
          aVal = a.scores?.overall || 0;
          bVal = b.scores?.overall || 0;
      }

      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return sorted;
  }, [results, sortBy, sortOrder]);

  // Get top 5 for radar chart comparison
  const radarData = useMemo(() => {
    const top5 = sortedResults.slice(0, 5);
    if (!top5.length) return [];

    const subjects = ['activity', 'momentum', 'quality', 'community', 'relevance', 'reputation'];

    return subjects.map(subject => {
      const entry = { subject: capitalize(subject) };
      top5.forEach((repo, i) => {
        entry[`repo${i + 1}`] = Math.round((repo.scores?.[subject] || 0) * 100);
      });
      return entry;
    });
  }, [sortedResults]);

  // Selected repos for comparison
  const comparisonRepos = useMemo(() => {
    return sortedResults.filter(r => selectedRepos.includes(r.repoId));
  }, [sortedResults, selectedRepos]);

  const handleToggleSort = (field) => {
    if (sortBy === field) {
      onSortChange(field, sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      onSortChange(field, 'desc');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num?.toString() || '0';
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-neon-green';
    if (score >= 0.6) return 'text-neon-blue';
    if (score >= 0.4) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 0.8) return 'bg-neon-green/20';
    if (score >= 0.6) return 'bg-neon-blue/20';
    if (score >= 0.4) return 'bg-yellow-400/20';
    return 'bg-gray-400/20';
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-dark-card border border-red-500/30 rounded-2xl p-8 text-center"
      >
        <p className="text-red-400 mb-4">{error}</p>
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg text-red-400 hover:bg-red-500/30"
          >
            Try Again
          </motion.button>
        )}
      </motion.div>
    );
  }

  if (!results.length && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center"
      >
        <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No results yet. Run a search to discover repositories.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">
            {loading ? 'Searching...' : `${sortedResults.length} Repositories Found`}
          </h3>
          <p className="text-sm text-gray-400">
            {comparisonRepos.length > 0
              ? `${comparisonRepos.length} selected for comparison`
              : 'Click to select repos for comparison'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {comparisonRepos.length >= 2 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCompare?.(comparisonRepos)}
              className="px-4 py-2 bg-neon-purple text-white font-medium rounded-lg hover:bg-neon-purple/90 transition-all flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Compare Selected
            </motion.button>
          )}
        </div>
      </div>

      {/* Overview Chart */}
      {sortedResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-4">Top 5 Score Comparison</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
                {sortedResults.slice(0, 5).map((repo, i) => (
                  <Radar
                    key={repo.repoId}
                    name={repo.repoId.split('/')[1]}
                    dataKey={`repo${i + 1}`}
                    stroke={['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'][i]}
                    fill={['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'][i]}
                    fillOpacity={0.1}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Sort Controls */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Sort by:</span>
        {[
          { key: 'overall', label: 'Overall' },
          { key: 'activity', label: 'Activity' },
          { key: 'momentum', label: 'Momentum' },
          { key: 'quality', label: 'Quality' },
          { key: 'stars', label: 'Stars' },
          { key: 'forks', label: 'Forks' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleToggleSort(key)}
            className={`px-3 py-1 rounded-lg transition-all ${
              sortBy === key
                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                : 'text-gray-400 hover:text-white hover:bg-dark-bg'
            }`}
          >
            {label} {sortBy === key && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {sortedResults.map((repo, index) => {
          const isSelected = selectedRepos.includes(repo.repoId);
          const owner = repo.repoId?.split('/')[0] || '';
          const name = repo.repoId?.split('/')[1] || repo.repoId;

          return (
            <motion.div
              key={repo.repoId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-dark-card border rounded-2xl p-4 transition-all cursor-pointer hover:border-neon-blue/50 ${
                isSelected ? 'border-neon-blue bg-neon-blue/5' : 'border-dark-border'
              }`}
              onClick={() => onToggleSelect?.(repo.repoId)}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(repo.repoId)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-dark-border bg-dark-bg text-neon-blue focus:ring-neon-blue focus:ring-offset-0"
                    />
                    <img
                      src={repo.owner?.avatar_url || `https://github.com/${owner}.png`}
                      alt={owner}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">
                        {owner}/{name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {repo.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="flex items-center gap-4 ml-11 text-sm">
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3" />
                      {formatNumber(repo.metrics?.stars)}
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <GitFork className="w-3 h-3" />
                      {formatNumber(repo.metrics?.forks)}
                    </span>
                    <span className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      +{formatNumber(repo.metrics?.starsDelta)} stars
                    </span>
                    {repo.metrics?.language && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Code className="w-3 h-3" />
                        {repo.metrics.language}
                      </span>
                    )}
                    {repo.metrics?.recentCommits > 0 && (
                      <span className="flex items-center gap-1 text-neon-purple">
                        <Zap className="w-3 h-3" />
                        {repo.metrics.recentCommits} commits
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Score */}
                <div className="flex flex-col items-end gap-2">
                  {/* Overall Score */}
                  <div className={`px-3 py-1 rounded-lg text-lg font-bold ${getScoreBgColor(repo.scores?.overall)} ${getScoreColor(repo.scores?.overall)}`}>
                    {Math.round((repo.scores?.overall || 0) * 100)}
                  </div>

                  {/* Sub-scores */}
                  <div className="flex items-center gap-1 text-xs">
                    {[
                      { key: 'activity', icon: Zap },
                      { key: 'momentum', icon: TrendingUp },
                      { key: 'quality', icon: Award },
                    ].map(({ key, icon: Icon }) => (
                      <div
                        key={key}
                        className={`px-1.5 py-0.5 rounded ${getScoreBgColor(repo.scores?.[key])} ${getScoreColor(repo.scores?.[key])}`}
                        title={key}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                    ))}
                  </div>

                  {/* View Trends */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewTrends?.(repo.repoId);
                    }}
                    className="text-xs text-neon-blue hover:text-neon-blue/80 flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" />
                    Trends
                  </button>
                </div>
              </div>

              {/* Expanded: Sub-scores */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-dark-border"
                >
                  <div className="grid grid-cols-6 gap-2 text-center">
                    {[
                      { key: 'activity', label: 'Activity' },
                      { key: 'momentum', label: 'Momentum' },
                      { key: 'quality', label: 'Quality' },
                      { key: 'community', label: 'Community' },
                      { key: 'relevance', label: 'Relevance' },
                      { key: 'reputation', label: 'Reputation' },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-1">
                        <div className={`text-lg font-bold ${getScoreColor(repo.scores?.[key])}`}>
                          {Math.round((repo.scores?.[key] || 0) * 100)}
                        </div>
                        <div className="text-xs text-gray-500">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Individual Metrics */}
                  <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Watchers:</span>{' '}
                      <span className="text-white">{formatNumber(repo.metrics?.watchers)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Contributors:</span>{' '}
                      <span className="text-white">{formatNumber(repo.metrics?.recentContributors)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Open Issues:</span>{' '}
                      <span className="text-white">{formatNumber(repo.metrics?.openIssues)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Open PRs:</span>{' '}
                      <span className="text-white">{formatNumber(repo.metrics?.openPRs)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default DiscoveryResultsView;
