import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, Target, TrendingUp, Calendar, Code,
  Users, GitFork, Star, Filter, X, Plus, Save, Play,
  ChevronDown, ChevronUp, Sliders, Brain, Zap, Award
} from 'lucide-react';
import { createSearchProfile, DEFAULT_SCORING_PROFILE } from '../models';

/**
 * AdvancedDiscoveryPanel - UI for creating and managing Search Profiles
 * Allows users to define filters, scoring weights, and run advanced repository discovery
 */
const AdvancedDiscoveryPanel = ({
  onRunSearch,
  onSaveProfile,
  onLoadProfile,
  savedProfiles = [],
  isSearching = false,
}) => {
  const [activeTab, setActiveTab] = useState('filters');
  const [expandedSection, setExpandedSection] = useState('basic');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileDescription, setProfileDescription] = useState('');

  // Current profile state
  const [profile, setProfile] = useState(createSearchProfile());

  // Scoring weights (mutable for what-if analysis)
  const [weights, setWeights] = useState({ ...DEFAULT_SCORING_PROFILE.weights });

  // Filter state
  const [filters, setFilters] = useState({
    keywords: [],
    topics: [],
    language: '',
    minCommitsLast30Days: 5,
    minContributors: 2,
    excludeArchived: true,
    requireReadme: false,
  });

  // Keyword input
  const [keywordInput, setKeywordInput] = useState('');
  const [topicInput, setTopicInput] = useState('');

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const addKeyword = useCallback(() => {
    if (keywordInput.trim()) {
      setFilters(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  }, [keywordInput]);

  const removeKeyword = useCallback((index) => {
    setFilters(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  }, []);

  const addTopic = useCallback(() => {
    if (topicInput.trim()) {
      setFilters(prev => ({
        ...prev,
        topics: [...prev.topics, topicInput.trim()],
      }));
      setTopicInput('');
    }
  }, [topicInput]);

  const removeTopic = useCallback((index) => {
    setFilters(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  }, []);

  const updateWeight = useCallback((key, value) => {
    setWeights(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  }, []);

  const normalizeWeights = useCallback(() => {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (total > 0) {
      const normalized = {};
      Object.entries(weights).forEach(([k, v]) => {
        normalized[k] = v / total;
      });
      setWeights(normalized);
    }
  }, [weights]);

  const handleRunSearch = useCallback(() => {
    const searchProfile = createSearchProfile({
      ...profile,
      filters,
      scoringProfileId: DEFAULT_SCORING_PROFILE.id,
    });
    onRunSearch(searchProfile, weights);
  }, [profile, filters, weights, onRunSearch]);

  const handleSaveProfile = useCallback(() => {
    if (!profileName.trim()) return;

    const newProfile = createSearchProfile({
      ...profile,
      name: profileName,
      description: profileDescription,
      filters,
    });

    onSaveProfile(newProfile, weights);
    setShowSaveDialog(false);
    setProfileName('');
    setProfileDescription('');
  }, [profile, profileName, profileDescription, filters, onSaveProfile]);

  const handleLoadProfile = useCallback((profileData) => {
    setProfile(profileData);
    setFilters(profileData.filters);
    if (profileData.scoringProfile?.weights) {
      setWeights(profileData.scoringProfile.weights);
    }
    onLoadProfile(profileData);
  }, [onLoadProfile]);

  const resetFilters = useCallback(() => {
    setFilters({
      keywords: [],
      topics: [],
      language: '',
      minCommitsLast30Days: 5,
      minContributors: 2,
      excludeArchived: true,
      requireReadme: false,
    });
    setWeights({ ...DEFAULT_SCORING_PROFILE.weights });
  }, []);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust',
    'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'Shell'
  ];

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-blue/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-neon-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Advanced Discovery</h2>
              <p className="text-sm text-gray-400">Create search profiles with custom filters and scoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSaveDialog(true)}
              className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-gray-300 hover:text-white hover:border-neon-blue transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRunSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-neon-blue text-black font-medium rounded-lg hover:bg-neon-blue/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {isSearching ? 'Searching...' : 'Run Search'}
            </motion.button>
          </div>
        </div>

        {/* Saved Profiles Dropdown */}
        {savedProfiles.length > 0 && (
          <div className="mt-4">
            <select
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                if (!isNaN(idx)) handleLoadProfile(savedProfiles[idx]);
              }}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
              value=""
            >
              <option value="">Load a saved profile...</option>
              {savedProfiles.map((p, i) => (
                <option key={p.id} value={i}>{p.name} - {p.description || 'No description'}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-border">
        {[
          { key: 'filters', label: 'Filters', icon: Filter },
          { key: 'scoring', label: 'Scoring', icon: Target },
          { key: 'preview', label: 'Preview', icon: Search },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5'
                : 'text-gray-400 hover:text-white hover:bg-dark-bg'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'filters' && (
            <motion.div
              key="filters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Search className="w-4 h-4 inline mr-1" />
                  Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Add keyword..."
                    className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addKeyword}
                    className="px-3 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-neon-blue/10 text-neon-blue rounded-full text-sm flex items-center gap-1">
                      {kw}
                      <button onClick={() => removeKeyword(i)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Award className="w-4 h-4 inline mr-1" />
                  Topics
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                    placeholder="Add topic..."
                    className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-neon-purple"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addTopic}
                    className="px-3 py-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.topics.map((topic, i) => (
                    <span key={i} className="px-2 py-1 bg-neon-purple/10 text-neon-purple rounded-full text-sm flex items-center gap-1">
                      {topic}
                      <button onClick={() => removeTopic(i)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Code className="w-4 h-4 inline mr-1" />
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => updateFilter('language', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
                >
                  <option value="">Any Language</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Numeric Filters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <GitFork className="w-4 h-4 inline mr-1" />
                    Min Commits (30 days)
                  </label>
                  <input
                    type="number"
                    value={filters.minCommitsLast30Days}
                    onChange={(e) => updateFilter('minCommitsLast30Days', parseInt(e.target.value, 10) || 0)}
                    min="0"
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Min Contributors
                  </label>
                  <input
                    type="number"
                    value={filters.minContributors}
                    onChange={(e) => updateFilter('minContributors', parseInt(e.target.value, 10) || 0)}
                    min="0"
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
                  />
                </div>
              </div>

              {/* Boolean Filters */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.excludeArchived}
                    onChange={(e) => updateFilter('excludeArchived', e.target.checked)}
                    className="w-4 h-4 rounded border-dark-border bg-dark-bg text-neon-blue focus:ring-neon-blue focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300">Exclude archived repositories</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.requireReadme}
                    onChange={(e) => updateFilter('requireReadme', e.target.checked)}
                    className="w-4 h-4 rounded border-dark-border bg-dark-bg text-neon-blue focus:ring-neon-blue focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300">Require README present</span>
                </label>
              </div>

              {/* Reset */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-gray-400 hover:text-white hover:border-red-500/50 transition-all"
              >
                Reset All Filters
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'scoring' && (
            <motion.div
              key="scoring"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">Scoring Weights</h3>
                  <p className="text-sm text-gray-400">Adjust how repositories are scored</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={normalizeWeights}
                  className="px-3 py-1 text-xs bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30"
                >
                  Normalize to 100%
                </motion.button>
              </div>

              {[
                { key: 'activity', label: 'Activity', desc: 'Recent commits, contributor count', color: 'neon-blue', icon: Zap },
                { key: 'momentum', label: 'Momentum', desc: 'Star/fork growth rate', color: 'neon-green', icon: TrendingUp },
                { key: 'quality', label: 'Quality', desc: 'Has README, tests, CI', color: 'neon-purple', icon: Award },
                { key: 'community', label: 'Community', desc: 'Stars, forks, watchers', color: 'yellow-400', icon: Users },
                { key: 'relevance', label: 'Relevance', desc: 'Keyword/topic match', color: 'pink-400', icon: Target },
                { key: 'reputation', label: 'Reputation', desc: 'Owner follow count', color: 'cyan-400', icon: Star },
              ].map(({ key, label, desc, color, icon: Icon }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 text-${color}`} />
                      <span className="text-sm font-medium text-gray-300">{label}</span>
                    </div>
                    <span className="text-sm text-white font-medium">{(weights[key] * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights[key]}
                    onChange={(e) => updateWeight(key, e.target.value)}
                    className={`w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer accent-${color}`}
                    style={{ accentColor: `var(--${color})` }}
                  />
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}

              {/* Weight Total */}
              <div className="pt-4 border-t border-dark-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Weight</span>
                  <span className={`text-lg font-bold ${Math.abs(Object.values(weights).reduce((s, w) => s + w, 0) - 1) < 0.01 ? 'text-neon-green' : 'text-red-400'}`}>
                    {(Object.values(weights).reduce((s, w) => s + w, 0) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-white">Search Query Preview</h3>
              <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
                <pre className="text-sm text-neon-green font-mono overflow-x-auto">
                  {buildQueryPreview(filters)}
                </pre>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Active Filters Summary</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {filters.keywords.length > 0 && (
                    <li>• Keywords: {filters.keywords.join(', ')}</li>
                  )}
                  {filters.topics.length > 0 && (
                    <li>• Topics: {filters.topics.map(t => `topic:${t}`).join(' ')}</li>
                  )}
                  {filters.language && (
                    <li>• Language: {filters.language}</li>
                  )}
                  <li>• Min commits (30 days): {filters.minCommitsLast30Days}</li>
                  <li>• Min contributors: {filters.minContributors}</li>
                  <li>• Exclude archived: {filters.excludeArchived ? 'Yes' : 'No'}</li>
                  <li>• Require README: {filters.requireReadme ? 'Yes' : 'No'}</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-bold text-white mb-4">Save Search Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Profile Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="My Awesome Search"
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                    placeholder="What does this profile search for?"
                    rows={3}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-gray-400 hover:text-white"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    disabled={!profileName.trim()}
                    className="flex-1 px-4 py-2 bg-neon-blue text-black font-medium rounded-lg hover:bg-neon-blue/90 disabled:opacity-50"
                  >
                    Save Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Build a preview string of the search query
 * @param {Object} filters
 * @returns {string}
 */
function buildQueryPreview(filters) {
  const parts = [];

  if (filters.keywords.length > 0) {
    parts.push(`Keywords: ${filters.keywords.join(' ')}`);
  }
  if (filters.topics.length > 0) {
    parts.push(`Topics: ${filters.topics.map(t => `topic:${t}`).join(' ')}`);
  }
  if (filters.language) {
    parts.push(`Language: language:${filters.language}`);
  }
  if (filters.minCommitsLast30Days > 0) {
    parts.push(`Min commits (30d): ${filters.minCommitsLast30Days}`);
  }
  if (filters.minContributors > 0) {
    parts.push(`Min contributors: ${filters.minContributors}`);
  }
  if (filters.excludeArchived) {
    parts.push('Archived: NOT archived');
  }
  if (filters.requireReadme) {
    parts.push('Has README: readme:present');
  }

  return parts.length > 0 ? parts.join('\n') : '(No filters - will search all repositories)';
}

export default AdvancedDiscoveryPanel;
