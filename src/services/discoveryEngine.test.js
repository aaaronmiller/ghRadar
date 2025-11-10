import axios from 'axios';
import { runAdvancedSearch } from './discoveryEngine';

jest.mock('axios');

const mockGet = jest.fn();
axios.create.mockReturnValue({ get: mockGet });

describe('DiscoveryEngine', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('builds snapshots from search results', async () => {
    mockGet.mockResolvedValue({
      data: {
        items: [
          {
            full_name: 'test/repo',
            stargazers_count: 10,
            forks_count: 1,
            watchers_count: 2,
            license: null,
          },
        ],
      },
    });

    const profile = { id: 'p', filters: { keywords: ['agent'] } };
    const snapshots = await runAdvancedSearch(profile);

    expect(mockGet).toHaveBeenCalled();
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0].repoId).toBe('test/repo');
    expect(snapshots[0].scores).toBeTruthy();
  });
});
