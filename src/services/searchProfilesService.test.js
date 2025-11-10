import { listProfiles, saveProfile, deleteProfile } from './searchProfilesService';

describe('SearchProfilesService', () => {
  it('includes the top-agent-frameworks preset', async () => {
    const profiles = await listProfiles();
    const preset = profiles.find((p) => p.id === 'top-agent-frameworks');
    expect(preset).toBeTruthy();
    expect(preset.filters).toBeTruthy();
  });

  it('can save and delete a custom profile', async () => {
    const id = 'custom-profile';
    await saveProfile({ id, name: 'Custom', filters: {} });

    let profiles = await listProfiles();
    expect(profiles.find((p) => p.id === id)).toBeTruthy();

    await deleteProfile(id);
    profiles = await listProfiles();
    expect(profiles.find((p) => p.id === id)).toBeFalsy();
  });
});
