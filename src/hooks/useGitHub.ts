import { Octokit } from 'octokit';
import { useState } from 'react';
import { Repository } from '../types';
import { useDispatch } from 'react-redux';
import { setAllFilters, setInitialOrgs } from '../redux/settingsSlice';
import { getLS, LOCAL_STORAGE_KEYS } from '../utils/localStorage';

const octokit = new Octokit({
  auth: getLS(LOCAL_STORAGE_KEYS.VITE_GITHUB_TOKEN)
});

export function useGitHub() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstFetchComplete, setFirstFetchComplete] = useState(false);
  const dispatch = useDispatch();

  /**
   *
   * @param {string} owner - the owner of a repo (either a username or an org name)
   * @param {string} repo - the name of the repo
   * @param  {Array<string>} filesToCheck - an array of strings we will attempt to find in filenames of the repo tree (case-insensitive)
   * @returns {Map<string, boolean>}
   */
  async function checkForFilesInTree(owner: string, repo: string, filesToCheck: Array<string>) {
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

      const searchResults = new Map(filesToCheck.map(fileName => [fileName, false]))

      // Check for The Files
      const filePathArray = Array.from(filePaths)
      filesToCheck.forEach(fileNameToFind => {
        const fileResult = filePathArray.some(filePath => filePath?.includes(fileNameToFind.toLowerCase()))
        searchResults.set(fileNameToFind, fileResult)
      })

      return searchResults
    } catch (error) {
      console.error('Error fetching repository tree:', error);
    }
  }

  const fetchRepos = async () => {
    try {
      setLoading(true);
      // HACK: Useful fo debugging with a smaller set of repos
      // const {data} = await octokit.rest.repos.listForAuthenticatedUser({
      //   per_page: 5
      // })
      const data = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser);

      const reposWithDetails = await Promise.all(
        data.map(async (repo) => {
          const [pulls, fileSearchResultsMap] = await Promise.all([
            octokit.rest.pulls.list({
              owner: repo.owner.login,
              repo: repo.name,
              state: 'open'
            }),
            checkForFilesInTree(repo.owner.login, repo.name, ['todo.md', 'Dockerfile','.devcontainer', 'readme.md']),
          ]);

          return {
            id: repo.id,
            name: repo.name,
            updated_at: repo.updated_at,
            description: repo.description || '',
            html_url: repo.html_url,
            full_name: repo.full_name,
            pulls_count: pulls.data.length,
            organization: repo.full_name.split('/')[0],
            open_issues_count: repo.open_issues_count,
            stargazers_count: repo.stargazers_count,
            private: !!repo.private,
            size: repo.size,
            archived: repo.archived,
            active: !repo.archived,
            license: repo.license?.name || 'None',
            hasReadme: !!fileSearchResultsMap?.get('readme.md'),
            hasTodo: !!fileSearchResultsMap?.get('todo.md'),
            hasDockerfile: !!fileSearchResultsMap?.get('dockerfile'),
            hasDevcontainer: !!fileSearchResultsMap?.get('.devcontainer')
          } satisfies Repository;
        })
      );

      const orgs = reposWithDetails.reduce((acc: string[], repo) => {
        const orgName = repo.full_name.split("/")[0];
        if (!acc.includes(orgName)) {
          acc.push(orgName);
        }
        return acc;
      }, []);

      setRepos(reposWithDetails);
      setError(null);
      setFirstFetchComplete(true)
      dispatch(setInitialOrgs(orgs))
      const filterState = getLS(LOCAL_STORAGE_KEYS.SAVED_SETTINGS);
      if (filterState) {
        const parsedFilterState = JSON.parse(filterState);
        dispatch(setAllFilters(parsedFilterState));
      }
    } catch (err) {
      setError('Failed to fetch repositories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    firstFetchComplete,
    repos,
    loading,
    error,
    fetchRepos,
  };
}