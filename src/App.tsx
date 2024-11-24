import { useState, useMemo } from 'react';
import { Github, Loader } from 'lucide-react';
import { RepoCard } from './components/RepoCard';
import { SearchBar } from './components/SearchBar';
import { SortSelect } from './components/SortSelect';
import { useGitHub } from './hooks/useGitHub';
import { SortOption } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { setRepos as setReposInRedux } from './redux/repoSlice';
import { RootState } from './redux/store';

const sortOptions: SortOption[] = [
  { label: 'Least Recently Updated', value: 'updated', direction: 'asc' },
  { label: 'Recently Updated', value: 'updated', direction: 'desc' },
  { label: 'Least Pull Requests', value: 'pulls', direction: 'asc' },
  { label: 'Most Pull Requests', value: 'pulls', direction: 'desc' },
  { label: 'Least Stars', value: 'stars', direction: 'asc' },
  { label: 'Most Stars', value: 'stars', direction: 'desc' },
];

function App() {
  const { repos, loading, error, fetchRepos, sortRepos, searchRepos } = useGitHub();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const reposRedux = useSelector((state: RootState) => state.repo.value);
  
  // Take the Repos Returned from the Github Hook, and set them in Redux
  const dispatch = useDispatch();
  dispatch(setReposInRedux(repos));

  // Get the Sorted/Filtered Repos from Redux
  const filteredAndSortedRepos = useMemo(() => {
    const filtered = searchRepos(reposRedux, searchTerm);
    return sortRepos(filtered, selectedSort);
  }, [reposRedux, searchTerm, selectedSort, searchRepos, sortRepos]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl">{error}</p>
          <p className="mt-2">Please check your GitHub token and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center justify-between w-full">
            <Github className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">GitHub Explorer</h1>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              onClick={fetchRepos}
            >Fetch Repos</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          <div>
            <SortSelect
              options={sortOptions}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
          </div>
        </div>

        {/* <div>
          <pre>{JSON.stringify(repos[0], null, 2)}</pre>
        </div> */}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedRepos.map(repo => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;