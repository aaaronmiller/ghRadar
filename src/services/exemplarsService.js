// ExemplarService
// Manage curated exemplar projects in-memory.

const exemplars = new Map(); // repoId -> ExemplarProject

const listExemplars = async () => {
  return Array.from(exemplars.values());
};

const saveExemplar = async (exemplar) => {
  if (!exemplar || !exemplar.repoId) {
    throw new Error('Invalid exemplar: repoId is required');
  }

  const now = new Date().toISOString();
  const next = {
    tags: [],
    rationale: '',
    lastReviewedAt: now,
    ...exemplar,
  };
  // Preserve or set lastReviewedAt
  next.lastReviewedAt = next.lastReviewedAt || now;
  exemplars.set(next.repoId, next);
};
module.exports = {
  listExemplars,
  saveExemplar,
};