import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  Legend, TrendingUp, TrendingDown, Star, GitFork, Users,
  Calendar, Clock, Download, Trash2, RefreshCw, ChevronDown
} from 'lucide-react';
import {
  snapshotsService
} from '../services/snapshotsService';

/**
 * TrendsAndSnapshotsView - Visualize repository trends and historical snapshots
 * Shows star/fork growth, score changes over time, and snapshot comparison
 */
const TrendsAndSnapshotsView = ({
  repoId,
  snapshots = [],
  onClose,
  onCompareSnapshots,
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['stars', 'forks']);
  const [showSnapshotList, setShowSnapshotList] = useState(false);
  const [selectedSnapshots, setSelectedSnapshots] = useState([]);

  // Get snapshots for this repo
  const repoSnapshots = useMemo(() => {
    if (!repoId) return snapshots;
    return snapshots.filter(s => s.repoId === repoId);
  }, [repoId, snapshots]);

  // Sort snapshots by date
  const sortedSnapshots = useMemo(() => {
    return [...repoSnapshots].sort(
      (a, b) => new Date(a.collectedAt) - new Date(b.collectedAt)
    );
  }, [repoSnapshots]);

  // Filter by time range
  const filteredSnapshots = useMemo(() => {
    if (!sortedSnapshots.length) return [];

    const now = new Date();
    const ranges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      'all': Infinity,
    };

    const cutoff = new Date(now.getTime() - ranges[timeRange]);
    return sortedSnapshots.filter(s => new Date(s.collectedAt) >= cutoff);
  }, [sortedSnapshots, timeRange]);

  // Chart data transformation
  const chartData = useMemo(() => {
    return filteredSnapshots.map(s => ({
      date: new Date(s.collectedAt).toLocaleDateString(),
      timestamp: new Date(s.collectedAt).getTime(),
      stars: s.metrics?.stars || 0,
      starsDelta: s.metrics?.starsDelta || 0,
      forks: s.metrics?.forks || 0,
      watchers: s.metrics?.watchers || 0,
      openIssues: s.metrics?.openIssues || 0,
      recentCommits: s.metrics?.recentCommits || 0,
      recentContributors: s.metrics?.recentContributors || 0,
      overall: Math.round((s.scores?.overall || 0) * 100),
      activity: Math.round((s.scores?.activity || 0) * 100),
      momentum: Math.round((s.scores?.momentum || 0) * 100),
      quality: Math.round((s.scores?.quality || 0) * 100),
      community: Math.round((s.scores?.community || 0) * 100),
    }));
  }, [filteredSnapshots]);

  // Calculate trends
  const trends = useMemo(() => {
    if (filteredSnapshots.length < 2) return null;

    const latest = filteredSnapshots[filteredSnapshots.length - 1];
    const oldest = filteredSnapshots[0];

    const starsDiff = (latest.metrics?.stars || 0) - (oldest.metrics?.stars || 0);
    const forksDiff = (latest.metrics?.forks || 0) - (oldest.metrics?.forks || 0);
    const scoreDiff = (latest.scores?.overall || 0) - (oldest.scores?.overall || 0);

    return {
      stars: starsDiff,
      starsPercent: oldest.metrics?.stars > 0 ? (starsDiff / oldest.metrics.stars) * 100 : 0,
      forks: forksDiff,
      forksPercent: oldest.metrics?.forks > 0 ? (forksDiff / oldest.metrics.forks) * 100 : 0,
      score: scoreDiff,
      scorePercent: oldest.scores?.overall > 0 ? (scoreDiff / oldest.scores.overall) * 100 : 0,
    };
  }, [filteredSnapshots]);

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const toggleSnapshotSelection = (snapshotId) => {
    setSelectedSnapshots(prev =>
      prev.includes(snapshotId)
        ? prev.filter(id => id !== snapshotId)
        : [...prev, snapshotId]
    );
  };

  const handleDeleteSnapshot = (snapshotId) => {
    snapshotsService.deleteSnapshot(snapshotId);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num?.toString() || '0';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  if (!repoId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center"
      >
        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Select a repository to view trends and snapshots.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-neon-blue" />
          <div>
            <h3 className="text-lg font-bold text-white">Repository Trends</h3>
            <p className="text-sm text-gray-400">{repoId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex bg-dark-bg rounded-lg p-1">
            {['7d', '30d', '90d', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  timeRange === range
                    ? 'bg-neon-blue text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === 'all' ? 'All' : range}
              </button>
            ))}
          </div>

          {/* Snapshot List Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSnapshotList(!showSnapshotList)}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${
              showSnapshotList
                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                : 'bg-dark-bg text-gray-400 border border-dark-border hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Snapshots ({sortedSnapshots.length})
          </motion.button>

          {onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 bg-dark-bg border border-dark-border rounded-lg text-gray-400 hover:text-white"
            >
              ×
            </motion.button>
          )}
        </div>
      </div>

      {/* Trends Summary */}
      {trends && (
        <div className="p-4 border-b border-dark-border bg-dark-bg/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-center gap-3">
              <div className={`p-2 rounded-lg ${trends.stars >= 0 ? 'bg-neon-green/20' : 'bg-red-500/20'}`}>
                {trends.stars >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-neon-green" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div>
                <div className={`text-lg font-bold ${trends.stars >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                  {trends.stars >= 0 ? '+' : ''}{formatNumber(trends.stars)}
                </div>
                <div className="text-xs text-gray-500">Stars ({trends.starsPercent.toFixed(1)}%)</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className={`p-2 rounded-lg ${trends.forks >= 0 ? 'bg-neon-blue/20' : 'bg-red-500/20'}`}>
                {trends.forks >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-neon-blue" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div>
                <div className={`text-lg font-bold ${trends.forks >= 0 ? 'text-neon-blue' : 'text-red-400'}`}>
                  {trends.forks >= 0 ? '+' : ''}{formatNumber(trends.forks)}
                </div>
                <div className="text-xs text-gray-500">Forks ({trends.forksPercent.toFixed(1)}%)</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className={`p-2 rounded-lg ${trends.score >= 0 ? 'bg-neon-purple/20' : 'bg-red-500/20'}`}>
                {trends.score >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-neon-purple" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div>
                <div className={`text-lg font-bold ${trends.score >= 0 ? 'text-neon-purple' : 'text-red-400'}`}>
                  {trends.score >= 0 ? '+' : ''}{Math.round(trends.score * 100)}
                </div>
                <div className="text-xs text-gray-500">Score ({trends.scorePercent.toFixed(1)}%)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot List Panel */}
      <AnimatePresence>
        {showSnapshotList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-dark-border overflow-hidden"
          >
            <div className="p-4 max-h-64 overflow-y-auto">
              {sortedSnapshots.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No snapshots yet.</p>
              ) : (
                <div className="space-y-2">
                  {sortedSnapshots.map((snapshot, idx) => (
                    <div
                      key={snapshot.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedSnapshots.includes(snapshot.id)
                          ? 'bg-neon-purple/10 border border-neon-purple/30'
                          : 'bg-dark-bg hover:bg-dark-bg/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedSnapshots.includes(snapshot.id)}
                          onChange={() => toggleSnapshotSelection(snapshot.id)}
                          className="w-4 h-4 rounded border-dark-border bg-dark-bg text-neon-purple focus:ring-neon-purple focus:ring-offset-0"
                        />
                        <div>
                          <div className="text-sm text-white">{formatDate(snapshot.collectedAt)}</div>
                          <div className="text-xs text-gray-500">
                            Score: {Math.round((snapshot.scores?.overall || 0) * 100)} |
                            Stars: {formatNumber(snapshot.metrics?.stars)} |
                            Forks: {formatNumber(snapshot.metrics?.forks)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {snapshot.source && (
                          <span className="text-xs text-gray-500">{snapshot.source}</span>
                        )}
                        <button
                          onClick={() => handleDeleteSnapshot(snapshot.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSnapshots.length >= 2 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const selected = sortedSnapshots.filter(s => selectedSnapshots.includes(s.id));
                    onCompareSnapshots?.(selected);
                    setSelectedSnapshots([]);
                  }}
                  className="mt-3 w-full px-4 py-2 bg-neon-purple text-white font-medium rounded-lg hover:bg-neon-purple/90"
                >
                  Compare Selected Snapshots
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric Toggles */}
      <div className="p-4 border-b border-dark-border">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'stars', label: 'Stars', icon: Star, color: 'yellow' },
            { key: 'forks', label: 'Forks', icon: GitFork, color: 'blue' },
            { key: 'overall', label: 'Overall Score', icon: TrendingUp, color: 'purple' },
            { key: 'activity', label: 'Activity', icon: Users, color: 'green' },
            { key: 'momentum', label: 'Momentum', icon: TrendingUp, color: 'cyan' },
          ].map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                selectedMetrics.includes(key)
                  ? `bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`
                  : 'bg-dark-bg text-gray-400 border border-dark-border hover:text-white'
              }`}
              style={{
                borderColor: selectedMetrics.includes(key) ? `var(--${color}-500)` : undefined,
                color: selectedMetrics.includes(key) ? `var(--${color}-400)` : undefined,
              }}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        {chartData.length < 2 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Not enough data points to show trends.</p>
              <p className="text-sm">Run searches periodically to collect snapshots.</p>
            </div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStars" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorForks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />

                {selectedMetrics.includes('stars') && (
                  <Area
                    type="monotone"
                    dataKey="stars"
                    stroke="#F59E0B"
                    fillOpacity={1}
                    fill="url(#colorStars)"
                    name="Stars"
                  />
                )}
                {selectedMetrics.includes('forks') && (
                  <Area
                    type="monotone"
                    dataKey="forks"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorForks)"
                    name="Forks"
                  />
                )}
                {selectedMetrics.includes('overall') && (
                  <Area
                    type="monotone"
                    dataKey="overall"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    name="Score"
                  />
                )}
                {selectedMetrics.includes('activity') && (
                  <Line
                    type="monotone"
                    dataKey="activity"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    name="Activity"
                  />
                )}
                {selectedMetrics.includes('momentum') && (
                  <Line
                    type="monotone"
                    dataKey="momentum"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={false}
                    name="Momentum"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsAndSnapshotsView;
