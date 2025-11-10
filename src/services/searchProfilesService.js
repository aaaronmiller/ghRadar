// SearchProfilesService
// In-memory SearchProfile management + curated presets.
// Follows existing service patterns: named exports, no default, stateless API.

const profiles = new Map();

// Curated preset profiles aligned with spec requirements
const presetProfiles = [
  {
    id: 'top-agent-frameworks',
    name: 'Top Agent Frameworks',
    description: 'Mature, active agent frameworks with strong community signals.',
    filters: {
      keywords: ['agent', 'framework'],
      topics: ['agent', 'ai-agent'],
      minCommitsLast30Days: 5,
      minContributors: 2,
      excludeArchived: true,
      requireReadme: true,
    },
    scoringProfileId: 'default-v1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// initialize presets into profiles map once
for (const p of presetProfiles) {
  profiles.set(p.id, p);
}

export const listProfiles = async () => {
  return Array.from(profiles.values());
};

export const saveProfile = async (profile) => {
  if (!profile || !profile.id) {
    throw new Error('Invalid profile: id is required');
  }
  const now = new Date().toISOString();
  const existing = profiles.get(profile.id);
  const next = {
    ...existing,
    ...profile,
    updatedAt: now,
    createdAt: existing?.createdAt || profile.createdAt || now,
  };
  profiles.set(next.id, next);
};

export const deleteProfile = async (id) => {
  if (!id) throw new Error('Profile id is required');
  profiles.delete(id);
};
