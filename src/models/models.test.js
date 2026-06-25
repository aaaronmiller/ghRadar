import {
  createSearchProfile,
  createRepositorySnapshot,
  createComparisonSet,
  createExemplarProject,
  DEFAULT_SCORING_PROFILE,
} from '../models';

describe('Models', () => {
  describe('createSearchProfile', () => {
    it('should create a profile with defaults', () => {
      const profile = createSearchProfile();

      expect(profile).toHaveProperty('id');
      expect(profile).toHaveProperty('name', 'New Profile');
      expect(profile).toHaveProperty('description', '');
      expect(profile.filters).toBeDefined();
      expect(profile.filters.excludeArchived).toBe(true);
      expect(profile.scoringProfileId).toBe('default-v1');
    });

    it('should accept custom data', () => {
      const profile = createSearchProfile({
        name: 'My Profile',
        description: 'Test description',
        filters: {
          keywords: ['react', 'typescript'],
          language: 'JavaScript',
          minCommitsLast30Days: 10,
        },
      });

      expect(profile.name).toBe('My Profile');
      expect(profile.description).toBe('Test description');
      expect(profile.filters.keywords).toEqual(['react', 'typescript']);
      expect(profile.filters.language).toBe('JavaScript');
      expect(profile.filters.minCommitsLast30Days).toBe(10);
    });

    it('should preserve additional properties', () => {
      const profile = createSearchProfile({
        customField: 'test',
        nested: { a: 1, b: 2 },
      });

      expect(profile.customField).toBe('test');
      expect(profile.nested).toEqual({ a: 1, b: 2 });
    });
  });

  describe('createRepositorySnapshot', () => {
    it('should create a snapshot with defaults', () => {
      const snapshot = createRepositorySnapshot();

      expect(snapshot).toHaveProperty('id');
      expect(snapshot).toHaveProperty('repoId', '');
      expect(snapshot).toHaveProperty('collectedAt');
      expect(snapshot.metrics).toBeDefined();
      expect(snapshot.scores).toBeDefined();
      expect(snapshot.scores.overall).toBe(0);
    });

    it('should accept custom data', () => {
      const snapshot = createRepositorySnapshot({
        id: 'test-id',
        repoId: 'owner/repo',
        profileId: 'profile-1',
        metrics: {
          stars: 1000,
          forks: 100,
          recentCommits: 30,
        },
        scores: {
          overall: 0.85,
          activity: 0.9,
          momentum: 0.8,
        },
        source: 'api',
      });

      expect(snapshot.id).toBe('test-id');
      expect(snapshot.repoId).toBe('owner/repo');
      expect(snapshot.metrics.stars).toBe(1000);
      expect(snapshot.scores.overall).toBe(0.85);
      expect(snapshot.source).toBe('api');
    });

    it('should generate composite id from profileId, repoId, and timestamp', () => {
      const snapshot = createRepositorySnapshot({
        profileId: 'profile-1',
        repoId: 'owner/repo',
      });

      const parts = snapshot.id.split(':');
      expect(parts[0]).toBe('profile-1');
      expect(parts[1]).toBe('owner/repo');
      expect(parts.length).toBe(3);
    });
  });

  describe('createComparisonSet', () => {
    it('should create a comparison set with defaults', () => {
      const comparison = createComparisonSet();

      expect(comparison).toHaveProperty('id');
      expect(comparison).toHaveProperty('label', 'New Comparison');
      expect(comparison.repoIds).toEqual([]);
      expect(comparison.relatedSearchProfileId).toBeNull();
    });

    it('should accept custom data', () => {
      const comparison = createComparisonSet({
        label: 'My Comparison',
        repoIds: ['owner/repo1', 'owner/repo2'],
        relatedSearchProfileId: 'profile-1',
      });

      expect(comparison.label).toBe('My Comparison');
      expect(comparison.repoIds).toHaveLength(2);
      expect(comparison.relatedSearchProfileId).toBe('profile-1');
    });
  });

  describe('createExemplarProject', () => {
    it('should create an exemplar with defaults', () => {
      const exemplar = createExemplarProject();

      expect(exemplar).toHaveProperty('repoId', '');
      expect(exemplar.tags).toEqual([]);
      expect(exemplar.rationale).toBe('');
    });

    it('should accept custom data', () => {
      const exemplar = createExemplarProject({
        repoId: 'owner/repo',
        tags: ['agent-framework', 'high-quality'],
        rationale: 'Best example of agent patterns',
      });

      expect(exemplar.repoId).toBe('owner/repo');
      expect(exemplar.tags).toEqual(['agent-framework', 'high-quality']);
      expect(exemplar.rationale).toBe('Best example of agent patterns');
    });
  });

  describe('DEFAULT_SCORING_PROFILE', () => {
    it('should have all required weight keys', () => {
      const requiredKeys = [
        'activity',
        'momentum',
        'quality',
        'community',
        'relevance',
        'reputation',
      ];

      requiredKeys.forEach(key => {
        expect(DEFAULT_SCORING_PROFILE.weights).toHaveProperty(key);
      });
    });

    it('should have weights that sum to 1', () => {
      const weights = Object.values(DEFAULT_SCORING_PROFILE.weights);
      const sum = weights.reduce((acc, w) => acc + w, 0);
      expect(sum).toBeCloseTo(1, 2);
    });
  });
});
