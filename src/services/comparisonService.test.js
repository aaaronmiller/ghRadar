import { buildComparison } from './comparisonService';
import { saveSnapshots } from './snapshotsService';

describe('ComparisonService', () => {
  it('attaches snapshots for requested repos', async () => {
    const profileId = 'p-comp';
    await saveSnapshots(profileId, [
      { id: 's1', repoId: 'a/x' },
      { id: 's2', repoId: 'b/y' },
    ]);

    const set = {
      id: 'set1',
      label: 'Test',
      repoIds: ['a/x'],
      relatedSearchProfileId: profileId,
    };

    const result = await buildComparison(set);
    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0].repoId).toBe('a/x');
  });
});
