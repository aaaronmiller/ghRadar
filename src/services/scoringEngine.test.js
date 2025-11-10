const { scoreRepository } = require('./scoringEngine');

describe('scoreRepository', () => {
  it('produces higher scores for better metrics', () => {
    const low = scoreRepository({
      recentCommits: 0,
      recentContributors: 0,
      stars: 0,
      hasReadme: false,
      hasLicense: false,
      hasTests: false,
      hasCi: false,
    });

    const high = scoreRepository({
      recentCommits: 40,
      recentContributors: 8,
      stars: 5000,
      watchers: 400,
      forks: 300,
      hasReadme: true,
      hasLicense: true,
      hasTests: true,
      hasCi: true,
      starsDelta: 300,
      relevanceScore: 1,
      reputationScore: 1,
    });

    expect(high.overall).toBeGreaterThan(low.overall);
    expect(high.activity).toBeGreaterThan(low.activity);
    expect(high.quality).toBeGreaterThan(low.quality);
  });
});
