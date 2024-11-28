import { Octokit } from 'octokit';
import { useState } from 'react';
import { Repository } from '../types';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

export function useGitHub() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = async () => {
    try {
      setLoading(true);
      const data = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser)
     
      // Fetch pull requests count and README for each repo
      const reposWithDetails = await Promise.all(
        data.map(async (repo) => {
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
            readme: readme ? atob(readme.data.content) : '',
            organization: repo.full_name.split('/')[0],
            //  TODO: 
            // license: repo.license?.name || 'None',
            // size: repo.size,
            // todoFile: todoFile ? atob(todoFile.data.content) : '',
            // private: repo.private,
            // public: !repo.private,
            // archived: repo.archived,
            // active: !repo.archived
            // containerized: repo.topics.includes('containerized'),
            // Deployment.md: readme ? readme.data.content.includes('Deployment.md') : false,
          };
        })
      );

      setRepos(reposWithDetails as unknown as Repository[]);
      setError(null);
    } catch (err) {
      setError('Failed to fetch repositories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    repos,
    loading,
    error,
    fetchRepos,
  };
}