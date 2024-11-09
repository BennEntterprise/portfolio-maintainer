import { useState, useEffect } from 'react';
import { Octokit } from 'octokit';
import { Repository, SortOption } from '../types';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

export function useGitHub() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = async () => {
    try {
      setLoading(true);
      const { data } = await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 1000,
        sort: 'updated',
        direction: 'desc'
      });

      
      // Filter by owner = 'Bennentterprise'
      const filteredData = data.filter(repo => repo.owner.login.toLowerCase() !== 'gumbandapp'.toLowerCase());
      console.log(filteredData);
      
      // Fetch pull requests count and README for each repo
      const reposWithDetails = await Promise.all(
        filteredData.map(async (repo) => {
          const [pulls, readme] = await Promise.all([
            octokit.rest.pulls.list({
              owner: repo.owner.login,
              repo: repo.name,
              state: 'open'
            }),
            octokit.rest.repos.getReadme({
              owner: repo.owner.login,
              repo: repo.name
            }).catch(() => null)
          ]);

          return {
            ...repo,
            pulls_count: pulls.data.length,
            readme: readme ? atob(readme.data.content) : ''
          };
        })
      );

      setRepos(reposWithDetails);
      setError(null);
    } catch (err) {
      setError('Failed to fetch repositories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortRepos = (repos: Repository[], option: SortOption) => {
    return [...repos].sort((a, b) => {
      const multiplier = option.direction === 'desc' ? -1 : 1;
      
      switch (option.value) {
        case 'pulls':
          return multiplier * ((a.pulls_count || 0) - (b.pulls_count || 0));
        case 'updated':
          return multiplier * (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
        case 'stars':
          return multiplier * (a.stargazers_count - b.stargazers_count);
        default:
          return 0;
      }
    });
  };

  const searchRepos = (repos: Repository[], searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return repos.filter(repo => 
      repo.name.toLowerCase().includes(term) ||
      (repo.description?.toLowerCase().includes(term)) ||
      (repo.readme?.toLowerCase().includes(term))
    );
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return {
    repos,
    loading,
    error,
    sortRepos,
    searchRepos
  };
}