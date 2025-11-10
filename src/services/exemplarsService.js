// ExemplarService
// Manage curated exemplar projects in-memory.

const exemplars = new Map(); // repoId -> ExemplarProject

export const listExemplars = async () => {
  return Array.from(exemplars.values());
};

export const saveExemplar = async (exemplar) => {
  if (!exemplar || !exemplar.repoId) {
    throw new Error('Invalid exemplar: repoId is required');
  }

  const now = new Date().toISOString();
  const next = {
    tags: [],
    rationale: '',
    lastReviewedAt: now,
    ...exemplar,
    lastReviewedAt: exemplar.lastReviewedAt || now,
  };
  exemplars.set(next.repoId, next);
};
