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

  /**
   * 
   * @param {string} owner 
   * @param {string} repo 
   * @param  {Array<string>} fileToCheck
   * @returns {boolean}
   */
  async function checkForFilesInTree(owner: string, repo: string, fileToCheck: string) {
    try {
      // Fetch the entire tree of the repository recursively
      const { data } = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: 'HEAD', // Start from the latest commit on the default branch
        recursive: 'true'   // Fetch the tree recursively
      });
  
      // Create a set of all file paths in the tree
      const filePaths = new Set(data.tree.map(item => item.path?.toLowerCase()));

      // Check for The File
      // const fileExists = filePaths.has(fileToCheck.toLowerCase()); // 👈 This only checks for exact (case insensitive match)
      const fileExistsAsSubstring = Array.from(filePaths).some(filePath => filePath?.toLowerCase().includes(fileToCheck.toLowerCase()))
      return fileExistsAsSubstring 
    } catch (error) {
      console.error('Error fetching repository tree:', error);
    }
  }

  const fetchRepos = async () => {
    try {
      setLoading(true);
      // HACK: Useful fo debugging with a smaller set of repos
      // const {data} = await  octokit.rest.repos.listForAuthenticatedUser({
      //   per_page: 5
      // })
      const data = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser)
      


      // Fetch pull requests count and README for each repo
      const reposWithDetails = await Promise.all(
        data.map(async (repo) => {
          const [pulls, readme, hasTodo, hasDockerfile, hasDevcontainer] = await Promise.all([
            octokit.rest.pulls.list({
              owner: repo.owner.login,
              repo: repo.name,
              state: 'open'
            }),
            octokit.rest.repos.getReadme({
              owner: repo.owner.login,
              repo: repo.name
            }).catch(() => null),
            checkForFilesInTree(repo.owner.login, repo.name, 'todo.md'),
            checkForFilesInTree(repo.owner.login, repo.name, 'Dockerfile'),
            checkForFilesInTree(repo.owner.login, repo.name, '.devcontainer')
          ]);

          return {
            // Basic Stuff 
            id: repo.id,
            name: repo.name,
            updated_at: repo.updated_at,
            description: repo.description || '',
            html_url: repo.html_url,
            full_name: repo.full_name,
            pulls_count: pulls.data.length,
            readme: readme ? atob(readme.data.content) : '',
            organization: repo.full_name.split('/')[0],
            open_issues_count: repo.open_issues_count,
            stargazers_count: repo.stargazers_count, 

            // Card Stuff
            private: !!repo.private, 
            size: repo.size,
            archived: repo.archived,
            active: !repo.archived,
            license: repo.license?.name || 'None',
            hasTodo: !!hasTodo,
            hasDockerfile: !!hasDockerfile,
            hasDevcontainer: !!hasDevcontainer
          } satisfies Repository;
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