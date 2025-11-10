const { listExemplars, saveExemplar } = require('./exemplarsService');

describe('ExemplarService', () => {
  it('saves and lists exemplars', async () => {
    const repoId = 'example/repo';
    await saveExemplar({ repoId, rationale: 'High quality' });

    const all = await listExemplars();
    const match = all.find((e) => e.repoId === repoId);
    expect(match).toBeTruthy();
    expect(match.rationale).toBe('High quality');
    expect(match.lastReviewedAt).toBeTruthy();
  });
});
