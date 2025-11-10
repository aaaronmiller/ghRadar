// ComparisonService
// Build comparison sets enriched with snapshots.

import { listSnapshots } from './snapshotsService';

export const buildComparison = async (set) => {
  if (!set || !set.id || !Array.isArray(set.repoIds)) {
    throw new Error('Invalid ComparisonSet input');
  }

  const snapshots = [];
  if (set.relatedSearchProfileId) {
    const all = await listSnapshots(set.relatedSearchProfileId);
    for (const repoId of set.repoIds) {
      snapshots.push(...all.filter((s) => s.repoId === repoId));
    }
  }

  return {
    ...set,
    snapshots,
  };
};
