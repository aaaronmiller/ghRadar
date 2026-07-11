// SnapshotsService
// Simple in-memory RepositorySnapshot storage with async interface.

const snapshotsByProfile = new Map(); // profileId -> RepositorySnapshot[]

const saveSnapshots = async (profileId, snapshots) => {
  if (!profileId) throw new Error('profileId is required');
  if (!Array.isArray(snapshots)) throw new Error('snapshots must be an array');

  const existing = snapshotsByProfile.get(profileId) || [];
  const next = [...existing, ...snapshots];
  snapshotsByProfile.set(profileId, next);
};

const listSnapshots = async (profileId, repoId) => {
  if (!profileId) throw new Error('profileId is required');
  const all = snapshotsByProfile.get(profileId) || [];
  if (!repoId) return all;
  return all.filter((s) => s.repoId === repoId);
};
export {
  saveSnapshots,
  listSnapshots,
};
