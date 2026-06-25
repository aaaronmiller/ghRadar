import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie,
  Cell, TrendingUp, TrendingDown, Star, GitFork, Users, Code,
  Activity, Award, Target, Crown, ArrowLeftRight, Download, X
} from 'lucide-react';

/**
 * ComparisonDashboard - Side-by-side repository comparison
 * Shows metrics, scores, and trends for multiple repositories
 */
const ComparisonDashboard = ({
  repos = [],
  snapshots = [],
  onClose,
  onExport,
}) => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedMetrics, setSelectedMetrics] = useState(['stars', 'forks', 'openIssues']);
  const [hoveredRepo, setHoveredRepo] = useState(null);

  // Default colors for repos
  const repoColors = ['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

  // Normalize data for comparison
  const normalizedData = useMemo(() => {
    return repos.map((repo, idx) => {
      const repoSnapshots = snapshots.filter(s => s.repoId === repo.repoId);
      const latestSnapshot = repoSnapshots[repoSnapshots.length - 1] || {};

      return {
        ...repo,
        color: repoColors[idx % repoColors.length],
        metrics: {
          stars: repo.metrics?.stars || 0,
          forks: repo.metrics?.forks || 0,
          watchers: repo.metrics?.watchers || 0,
          openIssues: repo.metrics?.openIssues || 0,
          openPRs: repo.metrics?.openPRs || 0,
          recentCommits: repo.metrics?.recentCommits || 0,
          recentContributors: repo.metrics?.recentContributors || 0,
        },
        scores: {
          overall: repo.scores?.overall || 0,
          activity: repo.scores?.activity || 0,
          momentum: repo.scores?.momentum || 0,
          quality: repo.scores?.quality || 0,
          community: repo.scores?.community || 0,
          relevance: repo.scores?.relevance || 0,
          reputation: repo.scores?.reputation || 0,
        },
        snapshotHistory: repoSnapshots,
      };
    });
  }, [repos, snapshots]);

  // Radar chart data
  const radarData = useMemo(() => {
    const subjects = ['activity', 'momentum', 'quality', 'community', 'relevance', 'reputation'];
    return subjects.map(subject => {
      const entry = { subject: capitalize(subject) };
      normalizedData.forEach((repo, idx) => {
        entry[`repo${idx}`] = Math.round((repo.scores?.[subject] || 0) * 100);
      });
      return entry;
    });
  }, [normalizedData]);

  // Bar chart data
  const barData = useMemo(() => {
    return normalizedData.map(repo => ({
      name: repo.repoId?.split('/')[1] || repo.repoId,
      stars: repo.metrics.stars,
      forks: repo.metrics.forks,
      watchers: repo.metrics.watchers,
      openIssues: repo.metrics.openIssues,
      recentCommits: repo.metrics.recentCommits,
    }));
  }, [normalizedData]);

  // Score comparison data
  const scoreData = useMemo(() => {
    const metrics = ['activity', 'momentum', 'quality', 'community', 'relevance', 'reputation'];
    return metrics.map(metric => {
      const entry = { name: capitalize(metric) };
      normalizedData.forEach((repo, idx) => {
        entry[`repo${idx}`] = Math.round((repo.scores?.[metric] || 0) * 100);
      });
      return entry;
    });
  }, [normalizedData]);

  // Winner determination for each metric
  const winners = useMemo(() => {
    const result = {};
    const metrics = ['stars', 'forks', 'watchers', 'openIssues', 'recentCommits', 'recentContributors'];

    metrics.forEach(metric => {
      let maxVal = -Infinity;
      let winnerIdx = -1;
      normalizedData.forEach((repo, idx) => {
        const val = metric === 'openIssues'
          ? -repo.metrics[metric] // Lower is better for issues
          : repo.metrics[metric];
        if (val > maxVal) {
          maxVal = val;
          winnerIdx = idx;
        }
      });
      if (winnerIdx >= 0) {
        result[metric] = { winnerIdx, value: normalizedData[winnerIdx].metrics[metric] };
      }
    });

    return result;
  }, [normalizedData]);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num?.toString() || '0';
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  if (repos.length < 2) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center"
      >
        <ArrowLeftRight className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Select at least 2 repositories to compare.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowLeftRight className="w-5 h-5 text-neon-purple" />
          <h3 className="text-lg font-bold text-white">Repository Comparison</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-dark-bg rounded-lg p-1">
            {['overview', 'scores', 'metrics', 'trends'].map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all capitalize ${
                  activeView === view
                    ? 'bg-neon-purple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Export */}
          {onExport && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onExport(normalizedData)}
              className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-gray-400 hover:text-white flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          )}

          {onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 bg-dark-bg border border-dark-border rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Repo Pills */}
      <div className="p-4 border-b border-dark-border flex items-center gap-2 overflow-x-auto">
        {normalizedData.map((repo, idx) => (
          <div
            key={repo.repoId}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-bg border border-dark-border"
            style={{ borderColor: repo.color }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: repo.color }}
            />
            <span className="text-sm text-white whitespace-nowrap">
              {repo.repoId?.split('/')[1]}
            </span>
            <span className={`text-xs font-bold ${
              repo.scores.overall >= 0.8 ? 'text-neon-green' :
              repo.scores.overall >= 0.6 ? 'text-neon-blue' :
              'text-gray-400'
            }`}>
              {Math.round(repo.scores.overall * 100)}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Radar Chart */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4">Score Comparison</h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
                      {normalizedData.map((repo, idx) => (
                        <Radar
                          key={repo.repoId}
                          name={repo.repoId?.split('/')[1]}
                          dataKey={`repo${idx}`}
                          stroke={repo.color}
                          fill={repo.color}
                          fillOpacity={0.1}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {normalizedData.map((repo, idx) => (
                  <div
                    key={repo.repoId}
                    className="p-4 rounded-xl border"
                    style={{ borderColor: `${repo.color}40`, backgroundColor: `${repo.color}08` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: repo.color }}
                      />
                      <span className="text-sm font-medium text-white">
                        {repo.repoId?.split('/')[1]}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-gray-500">Stars</div>
                        <div className="text-white font-medium flex items-center gap-1">
                          {winners.stars?.winnerIdx === idx && (
                            <Crown className="w-3 h-3 text-yellow-400" />
                          )}
                          {formatNumber(repo.metrics.stars)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Forks</div>
                        <div className="text-white font-medium flex items-center gap-1">
                          {winners.forks?.winnerIdx === idx && (
                            <Crown className="w-3 h-3 text-yellow-400" />
                          )}
                          {formatNumber(repo.metrics.forks)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Score</div>
                        <div className="text-neon-purple font-medium">
                          {Math.round(repo.scores.overall * 100)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Issues</div>
                        <div className="text-white font-medium">
                          {formatNumber(repo.metrics.openIssues)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'scores' && (
            <motion.div
              key="scores"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h4 className="text-sm font-medium text-gray-400 mb-4">Detailed Score Breakdown</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" domain={[0, 100]} stroke="#6B7280" fontSize={11} />
                    <YAxis type="category" dataKey="name" stroke="#6B7280" fontSize={11} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    {normalizedData.map((repo, idx) => (
                      <Bar
                        key={repo.repoId}
                        dataKey={`repo${idx}`}
                        name={repo.repoId?.split('/')[1]}
                        fill={repo.color}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeView === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h4 className="text-sm font-medium text-gray-400 mb-4">Repository Metrics</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="stars" fill="#F59E0B" name="Stars" />
                    <Bar dataKey="forks" fill="#3B82F6" name="Forks" />
                    <Bar dataKey="watchers" fill="#10B981" name="Watchers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Metrics Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left py-2 px-3 text-gray-400 font-medium">Metric</th>
                      {normalizedData.map(repo => (
                        <th key={repo.repoId} className="text-right py-2 px-3" style={{ color: repo.color }}>
                          {repo.repoId?.split('/')[1]}
                        </th>
                      ))}
                      <th className="text-right py-2 px-3 text-gray-400">Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'stars', label: 'Stars', icon: Star, format: formatNumber },
                      { key: 'forks', label: 'Forks', icon: GitFork, format: formatNumber },
                      { key: 'watchers', label: 'Watchers', icon: Users, format: formatNumber },
                      { key: 'openIssues', label: 'Open Issues', icon: Code, format: formatNumber, lower: true },
                      { key: 'recentCommits', label: 'Recent Commits', icon: Activity, format: formatNumber },
                      { key: 'recentContributors', label: 'Contributors', icon: Users, format: formatNumber },
                    ].map(({ key, label, format, lower }) => {
                      const winner = winners[key];
                      return (
                        <tr key={key} className="border-b border-dark-border/50">
                          <td className="py-2 px-3 text-gray-400">{label}</td>
                          {normalizedData.map((repo, idx) => (
                            <td key={repo.repoId} className="text-right py-2 px-3 text-white">
                              {format(repo.metrics[key])}
                            </td>
                          ))}
                          <td className="text-right py-2 px-3" style={{ color: normalizedData[winner?.winnerIdx]?.color }}>
                            {winner && `${normalizedData[winner.winnerIdx]?.repoId?.split('/')[1]} (${format(winner.value)})`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeView === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h4 className="text-sm font-medium text-gray-400 mb-4">Historical Trends</h4>
              {normalizedData.some(r => r.snapshotHistory.length > 1) ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey={(d) => d.collectedAt}
                        stroke="#6B7280"
                        fontSize={11}
                        tickFormatter={(val) => new Date(val).toLocaleDateString()}
                      />
                      <YAxis stroke="#6B7280" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                        }}
                        labelFormatter={(val) => new Date(val).toLocaleString()}
                      />
                      <Legend />
                      {normalizedData.map((repo) => (
                        <Line
                          key={repo.repoId}
                          type="monotone"
                          data={repo.snapshotHistory}
                          dataKey={(s) => Math.round((s.scores?.overall || 0) * 100)}
                          name={`${repo.repoId?.split('/')[1]} Score`}
                          stroke={repo.color}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Not enough snapshot data for trends.</p>
                    <p className="text-sm">Run periodic searches to collect historical data.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComparisonDashboard;
