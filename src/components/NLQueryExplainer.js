import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, MessageSquare, Sparkles, ChevronRight, Copy,
  Check, RefreshCw, Loader2, ArrowRight, HelpCircle, Search
} from 'lucide-react';

/**
 * NLQueryExplainer - Natural Language Query Interface
 * Converts natural language queries to structured search profiles
 * and explains existing queries in natural language
 */
const NLQueryExplainer = ({
  onExecuteQuery,
  onExplainQuery,
  isProcessing = false,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [parsedQuery, setParsedQuery] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const [copied, setCopied] = useState(false);

  // Parse natural language into structured filters
  const parseQuery = useCallback((input) => {
    const query = input.toLowerCase().trim();
    const filters = {
      keywords: [],
      topics: [],
      language: null,
      minCommitsLast30Days: 0,
      minContributors: 0,
      excludeArchived: true,
      requireReadme: false,
    };

    // Extract language patterns
    const languages = ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin'];
    languages.forEach(lang => {
      if (query.includes(lang)) {
        filters.language = lang.charAt(0).toUpperCase() + lang.slice(1);
      }
    });

    // Extract topic patterns
    const topicPatterns = [
      { pattern: /react|reactjs|react\.js/gi, topic: 'react' },
      { pattern: /vue|vuejs|vue\.js/gi, topic: 'vue' },
      { pattern: /angular|angularjs/gi, topic: 'angular' },
      { pattern: /node|nodejs|node\.js/gi, topic: 'nodejs' },
      { pattern: /machine learning|ml|ai/gi, topic: 'machine-learning' },
      { pattern: /deep learning|dl/gi, topic: 'deep-learning' },
      { pattern: /api|rest|graphql/gi, topic: 'api' },
      { pattern: /cli|command.line/gi, topic: 'cli' },
      { pattern: /database|db|sql/gi, topic: 'database' },
      { pattern: /testing|test|tdd/gi, topic: 'testing' },
      { pattern: /docker|container/gi, topic: 'docker' },
      { pattern: /kubernetes|k8s/gi, topic: 'kubernetes' },
      { pattern: /blockchain|crypto/gi, topic: 'blockchain' },
      { pattern: /web3|ethereum/gi, topic: 'web3' },
      { pattern: /graph|graphdb/gi, topic: 'graph' },
      { pattern: /bots|chatbot/gi, topic: 'bots' },
    ];

    topicPatterns.forEach(({ pattern, topic }) => {
      if (pattern.test(query)) {
        filters.topics.push(topic);
      }
    });

    // Extract quality requirements
    if (query.includes('has readme') || query.includes('documented') || query.includes('well documented')) {
      filters.requireReadme = true;
    }

    // Extract numeric constraints
    const commitsMatch = query.match(/(\d+)\s*(?:commits?|contributions?)/);
    if (commitsMatch) {
      filters.minCommitsLast30Days = parseInt(commitsMatch[1], 10);
    }

    const contributorsMatch = query.match(/(\d+)\s*(?:contributor|developer|maintainer)/);
    if (contributorsMatch) {
      filters.minContributors = parseInt(contributorsMatch[1], 10);
    }

    // Extract archived filter
    if (query.includes('archived') && (query.includes('exclude') || query.includes('no') || query.includes('not'))) {
      filters.excludeArchived = true;
    } else if (query.includes('include archived')) {
      filters.excludeArchived = false;
    }

    // Extract keywords (exclude common words)
    const commonWords = new Set([
      'find', 'search', 'for', 'with', 'that', 'has', 'have', 'had',
      'and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'from',
      'by', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'not', 'no', 'show', 'me', 'repositories', 'repo', 'repos', 'projects',
      'github', 'popular', 'trending', 'top', 'best', 'good', 'great',
      'looking', 'need', 'want', 'find', 'some', 'all',
    ]);

    const words = query.split(/\s+/)
      .filter(w => w.length > 2 && !commonWords.has(w) && !languages.includes(w))
      .filter(w => !topicPatterns.some(t => t.pattern.test(w)));

    filters.keywords = [...new Set(words)];

    return filters;
  }, []);

  // Generate natural language explanation from filters
  const explainFilters = useCallback((filters) => {
    const parts = [];

    if (filters.keywords.length > 0) {
      parts.push(`Repositories matching keywords: "${filters.keywords.join(', ')}"`);
    }

    if (filters.topics.length > 0) {
      parts.push(`Tagged with topics: ${filters.topics.map(t => `"${t}"`).join(', ')}`);
    }

    if (filters.language) {
      parts.push(`Written in ${filters.language}`);
    }

    const activityParts = [];
    if (filters.minCommitsLast30Days > 0) {
      activityParts.push(`at least ${filters.minCommitsLast30Days} commits in the last 30 days`);
    }
    if (filters.minContributors > 0) {
      activityParts.push(`at least ${filters.minContributors} contributors`);
    }
    if (activityParts.length > 0) {
      parts.push(`With ${activityParts.join(' and ')}`);
    }

    if (filters.requireReadme) {
      parts.push('Must have a README');
    }

    if (filters.excludeArchived) {
      parts.push('Excluding archived repositories');
    }

    return parts.length > 0 ? parts.join('\n• ') : 'No specific filters applied (searching all repositories)';
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!queryInput.trim()) return;

    const parsed = parseQuery(queryInput);
    setParsedQuery(parsed);
    setExplanation(explainFilters(parsed));

    if (onExecuteQuery) {
      onExecuteQuery(parsed);
    }
  }, [queryInput, parseQuery, explainFilters, onExecuteQuery]);

  const handleExplain = useCallback(() => {
    if (!queryInput.trim() && !parsedQuery) return;

    const filters = parsedQuery || parseQuery(queryInput);
    setExplanation(explainFilters(filters));
  }, [queryInput, parsedQuery, parseQuery, explainFilters]);

  const copyToClipboard = useCallback(() => {
    const text = explanation || queryInput;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [explanation, queryInput]);

  const exampleQueries = [
    {
      text: "Find popular React repositories with over 1000 stars",
      filters: { keywords: [], topics: ['react'], minCommitsLast30Days: 0, minContributors: 0, language: 'JavaScript' }
    },
    {
      text: "Show me Python machine learning projects with good documentation",
      filters: { keywords: [], topics: ['machine-learning'], minCommitsLast30Days: 0, minContributors: 0, language: 'Python', requireReadme: true }
    },
    {
      text: "Find CLI tools in Go with at least 5 contributors and 50 commits",
      filters: { keywords: [], topics: ['cli'], minCommitsLast30Days: 50, minContributors: 5, language: 'Go' }
    },
    {
      text: "Show blockchain projects with over 100 stars that are not archived",
      filters: { keywords: [], topics: ['blockchain'], minCommitsLast30Days: 0, minContributors: 0, excludeArchived: true }
    },
    {
      text: "Find Docker Compose templates or Kubernetes configs",
      filters: { keywords: ['docker-compose', 'kubernetes'], topics: ['docker', 'kubernetes'], minCommitsLast30Days: 0, minContributors: 0 }
    },
  ];

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-neon-purple" />
          <div>
            <h3 className="text-lg font-bold text-white">Natural Language Search</h3>
            <p className="text-sm text-gray-400">Describe what you're looking for in plain English</p>
          </div>
        </div>
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="text-sm text-neon-blue hover:text-neon-blue/80 flex items-center gap-1"
        >
          <HelpCircle className="w-4 h-4" />
          Examples
        </button>
      </div>

      {/* Example Queries */}
      <AnimatePresence>
        {showExamples && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-dark-border overflow-hidden"
          >
            <div className="p-4 bg-dark-bg/50 space-y-2">
              <p className="text-sm text-gray-400 mb-3">Try these example queries:</p>
              {exampleQueries.map((example, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  onClick={() => {
                    setQueryInput(example.text);
                    const parsed = parseQuery(example.text);
                    setParsedQuery(parsed);
                    setExplanation(explainFilters(parsed));
                  }}
                  className="w-full text-left p-3 rounded-lg bg-dark-card border border-dark-border hover:border-neon-purple/30 transition-all"
                >
                  <p className="text-sm text-white">{example.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Topics: {example.filters.topics.join(', ')} | Language: {example.filters.language || 'Any'}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative"
        >
          <div className="relative">
            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Find React repositories with over 1000 stars and good documentation..."
              className="w-full pl-12 pr-24 py-4 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple resize-none"
              disabled={isProcessing}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {queryInput && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="button"
                  onClick={() => {
                    setQueryInput('');
                    setParsedQuery(null);
                    setExplanation(null);
                  }}
                  className="p-2 text-gray-500 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!queryInput.trim() || isProcessing}
                className="px-4 py-2 bg-neon-purple text-white font-medium rounded-lg hover:bg-neon-purple/90 disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isProcessing ? 'Processing...' : 'Search'}
              </motion.button>
            </div>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleExplain}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <Brain className="w-3 h-3" />
            Explain Query
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => {
              setQueryInput('popular repositories this week');
              handleSubmit();
            }}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <TrendingIcon className="w-3 h-3" />
            Trending
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => {
              setQueryInput('active open source projects with many contributors');
              handleSubmit();
            }}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <UsersIcon className="w-3 h-3" />
            Active Projects
          </button>
        </div>
      </div>

      {/* Explanation Panel */}
      <AnimatePresence>
        {explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-dark-border overflow-hidden"
          >
            <div className="p-4 bg-neon-purple/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neon-purple" />
                  <span className="text-sm font-medium text-white">Query Explanation</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-line">
                • {explanation}
              </div>

              {/* Parsed Filters Summary */}
              {parsedQuery && (
                <div className="mt-4 pt-4 border-t border-dark-border/50">
                  <p className="text-xs text-gray-500 mb-2">Detected Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {parsedQuery.keywords.length > 0 && (
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs">
                        Keywords: {parsedQuery.keywords.join(', ')}
                      </span>
                    )}
                    {parsedQuery.topics.length > 0 && (
                      <span className="px-2 py-1 bg-neon-purple/10 text-neon-purple rounded text-xs">
                        Topics: {parsedQuery.topics.join(', ')}
                      </span>
                    )}
                    {parsedQuery.language && (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                        Language: {parsedQuery.language}
                      </span>
                    )}
                    {parsedQuery.minCommitsLast30Days > 0 && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs">
                        Min Commits: {parsedQuery.minCommitsLast30Days}
                      </span>
                    )}
                    {parsedQuery.minContributors > 0 && (
                      <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs">
                        Min Contributors: {parsedQuery.minContributors}
                      </span>
                    )}
                    {parsedQuery.requireReadme && (
                      <span className="px-2 py-1 bg-pink-500/10 text-pink-400 rounded text-xs">
                        Requires README
                      </span>
                    )}
                    {parsedQuery.excludeArchived && (
                      <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded text-xs">
                        No Archived
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="p-4 border-t border-dark-border bg-dark-bg/30">
        <p className="text-xs text-gray-500">
          <span className="text-neon-purple">Tip:</span> Try including specific requirements like
          "with over X stars", "at least Y contributors", or "written in [language]".
          You can also mention topics like "machine learning", "docker", "api", etc.
        </p>
      </div>
    </div>
  );
};

// Simple trending icon component
const TrendingIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
);

// Simple users icon component
const UsersIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default NLQueryExplainer;
