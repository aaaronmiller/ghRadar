import { saveSnapshots, listSnapshots } from './snapshotsService';

describe('SnapshotsService', () => {
  it('saves and lists snapshots by profile and repo', async () => {
    const profileId = 'p1';
    const snapshots = [
      { id: 's1', repoId: 'a/b' },
      { id: 's2', repoId: 'a/b' },
      { id: 's3', repoId: 'c/d' },
    ];

    await saveSnapshots(profileId, snapshots);

    const all = await listSnapshots(profileId);
    expect(all).toHaveLength(3);

    const filtered = await listSnapshots(profileId, 'a/b');
    expect(filtered).toHaveLength(2);
  });
});
