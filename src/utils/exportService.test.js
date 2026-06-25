import {
  exportSearchResults,
  exportSnapshots,
  exportComparisons,
  exportProfiles,
  exportAll,
  importData,
  generateFilename,
} from '../utils/exportService';

describe('Export Service', () => {
  describe('exportSearchResults', () => {
    const mockResults = [
      {
        repoId: 'owner/repo1',
        description: 'Test repo 1',
        owner: { login: 'owner', avatar_url: 'https://example.com/avatar.png' },
        metrics: {
          stars: 1000,
          forks: 100,
          watchers: 50,
          openIssues: 10,
          openPRs: 5,
          recentCommits: 30,
          recentContributors: 5,
          language: 'JavaScript',
          hasReadme: true,
          hasLicense: true,
          hasTests: true,
          hasCi: true,
        },
        scores: {
          overall: 0.85,
          activity: 0.9,
          momentum: 0.8,
          quality: 0.85,
          community: 0.75,
          relevance: 0.9,
          reputation: 0.8,
        },
      },
      {
        repoId: 'owner/repo2',
        description: 'Test repo 2',
        owner: { login: 'owner', avatar_url: 'https://example.com/avatar2.png' },
        metrics: { stars: 500, forks: 50 },
        scores: { overall: 0.7 },
      },
    ];

    it('should export results as JSON', () => {
      const json = exportSearchResults(mockResults);

      expect(typeof json).toBe('string');
      const parsed = JSON.parse(json);
      expect(parsed).toHaveLength(2);
    });

    it('should include repoId and basic info', () => {
      const json = exportSearchResults(mockResults);
      const parsed = JSON.parse(json);

      expect(parsed[0].repoId).toBe('owner/repo1');
      expect(parsed[0].description).toBe('Test repo 1');
      expect(parsed[0].url).toBe('https://github.com/owner/repo1');
    });

    it('should include metrics when option is enabled', () => {
      const json = exportSearchResults(mockResults, { includeMetrics: true });
      const parsed = JSON.parse(json);

      expect(parsed[0].metrics).toBeDefined();
      expect(parsed[0].metrics.stars).toBe(1000);
    });

    it('should exclude metrics when option is disabled', () => {
      const json = exportSearchResults(mockResults, { includeMetrics: false });
      const parsed = JSON.parse(json);

      expect(parsed[0].metrics).toBeUndefined();
    });

    it('should include scores when option is enabled', () => {
      const json = exportSearchResults(mockResults, { includeScores: true });
      const parsed = JSON.parse(json);

      expect(parsed[0].scores).toBeDefined();
      expect(parsed[0].scores.overall).toBe(0.85);
    });

    it('should include timestamps when option is enabled', () => {
      const json = exportSearchResults(mockResults, { includeTimestamps: true });
      const parsed = JSON.parse(json);

      expect(parsed[0].exportedAt).toBeDefined();
    });

    it('should format JSON with pretty print', () => {
      const json = exportSearchResults(mockResults, { prettyPrint: true });

      expect(json).toContain('\n');
    });

    it('should format JSON without pretty print', () => {
      const json = exportSearchResults(mockResults, { prettyPrint: false });

      expect(json).not.toContain('\n');
    });
  });

  describe('exportSnapshots', () => {
    const mockSnapshots = [
      {
        id: 'snap-1',
        repoId: 'owner/repo1',
        collectedAt: '2024-01-15T10:00:00Z',
        metrics: { stars: 1000 },
        scores: { overall: 0.85 },
      },
      {
        id: 'snap-2',
        repoId: 'owner/repo1',
        collectedAt: '2024-01-20T10:00:00Z',
        metrics: { stars: 1100 },
        scores: { overall: 0.87 },
      },
    ];

    it('should export snapshots as JSON', () => {
      const json = exportSnapshots(mockSnapshots);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(2);
    });

    it('should group by repo when option is enabled', () => {
      const json = exportSnapshots(mockSnapshots, { groupByRepo: true });
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].repoId).toBe('owner/repo1');
      expect(parsed[0].snapshots).toHaveLength(2);
      expect(parsed[0].snapshotCount).toBe(2);
    });

    it('should include date range when grouping', () => {
      const json = exportSnapshots(mockSnapshots, { groupByRepo: true });
      const parsed = JSON.parse(json);

      expect(parsed[0].dateRange).toBeDefined();
      expect(parsed[0].dateRange.earliest).toBeDefined();
      expect(parsed[0].dateRange.latest).toBeDefined();
    });
  });

  describe('exportComparisons', () => {
    const mockComparisons = [
      {
        id: 'comp-1',
        label: 'My Comparison',
        repoIds: ['owner/repo1', 'owner/repo2'],
        relatedSearchProfileId: 'profile-1',
        createdAt: '2024-01-15T10:00:00Z',
        snapshots: [
          { id: 'snap-1', repoId: 'owner/repo1', collectedAt: '2024-01-15T10:00:00Z' },
          { id: 'snap-2', repoId: 'owner/repo2', collectedAt: '2024-01-16T10:00:00Z' },
        ],
      },
    ];

    it('should export comparisons as JSON', () => {
      const json = exportComparisons(mockComparisons);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].label).toBe('My Comparison');
    });

    it('should include snapshots when option is enabled', () => {
      const json = exportComparisons(mockComparisons, { includeSnapshots: true });
      const parsed = JSON.parse(json);

      expect(parsed[0].snapshots).toHaveLength(2);
    });

    it('should exclude snapshots when option is disabled', () => {
      const json = exportComparisons(mockComparisons, { includeSnapshots: false });
      const parsed = JSON.parse(json);

      expect(parsed[0].snapshots).toBeUndefined();
    });
  });

  describe('exportProfiles', () => {
    const mockProfiles = [
      {
        id: 'profile-1',
        name: 'My Profile',
        description: 'Test profile',
        filters: { keywords: ['react'] },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ];

    it('should export profiles as JSON', () => {
      const json = exportProfiles(mockProfiles);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('My Profile');
    });

    it('should include exportedAt timestamp', () => {
      const json = exportProfiles(mockProfiles);
      const parsed = JSON.parse(json);

      expect(parsed[0].exportedAt).toBeDefined();
    });
  });

  describe('exportAll', () => {
    const mockData = {
      profiles: [{ id: 'profile-1', name: 'Test' }],
      snapshots: [{ id: 'snap-1' }],
      comparisons: [{ id: 'comp-1' }],
      exemplars: [{ repoId: 'owner/repo' }],
    };

    it('should export all data with version', () => {
      const json = exportAll(mockData);
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe('1.0.0');
      expect(parsed.profiles).toHaveLength(1);
      expect(parsed.snapshots).toHaveLength(1);
      expect(parsed.comparisons).toHaveLength(1);
      expect(parsed.exemplars).toHaveLength(1);
    });

    it('should handle empty data', () => {
      const json = exportAll({});
      const parsed = JSON.parse(json);

      expect(parsed.profiles).toEqual([]);
      expect(parsed.snapshots).toEqual([]);
    });
  });

  describe('importData', () => {
    it('should parse full backup format', () => {
      const backup = {
        version: '1.0.0',
        profiles: [{ id: 'profile-1' }],
        snapshots: [{ id: 'snap-1' }],
        comparisons: [],
        exemplars: [],
      };

      const result = importData(JSON.stringify(backup));

      expect(result.profiles).toHaveLength(1);
      expect(result.snapshots).toHaveLength(1);
      expect(result.importedAt).toBeDefined();
    });

    it('should parse profiles array format', () => {
      const profiles = [{ id: 'profile-1' }, { id: 'profile-2' }];

      const result = importData(JSON.stringify(profiles));

      expect(result.profiles).toHaveLength(2);
    });

    it('should throw on invalid JSON', () => {
      expect(() => importData('invalid json')).toThrow();
    });
  });

  describe('generateFilename', () => {
    it('should generate filename with prefix and timestamp', () => {
      const filename = generateFilename('results');

      // ISO timestamp with milliseconds: 2026-04-03T05-08-13-361Z
      expect(filename).toMatch(/^results-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/);
    });

    it('should use custom extension', () => {
      const filename = generateFilename('data', 'csv');

      expect(filename).toMatch(/\.csv$/);
    });
  });
});
