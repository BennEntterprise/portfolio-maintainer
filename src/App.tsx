import { Github, Loader } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilteringOptions } from "./components/FilteringOptions";
import { RepoCard } from "./components/RepoCard";
import { SearchBar } from "./components/SearchBar";
import { SortSelect } from "./components/SortSelect";
import { useGitHub } from "./hooks/useGitHub";
import { setRepos as setReposInRedux } from "./redux/repoSlice";
import { RootState } from "./redux/store";
import { Repository, SortOption } from "./types";

const sortOptions: SortOption[] = [
  { label: "Least Recently Updated", value: "updated", direction: "asc" },
  { label: "Recently Updated", value: "updated", direction: "desc" },
  { label: "Least Pull Requests", value: "pulls", direction: "asc" },
  { label: "Most Pull Requests", value: "pulls", direction: "desc" },
  { label: "Least Stars", value: "stars", direction: "asc" },
  { label: "Most Stars", value: "stars", direction: "desc" },
];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const reposRedux = useSelector((state: RootState) => state.repo.value);
  const { repos, loading, error, fetchRepos } = useGitHub();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setReposInRedux(repos));
  }, [dispatch, repos]);

  const sortRepos = useCallback((repos: Repository[], option: SortOption) => {
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
  },[]);

  const searchRepos = useCallback((repos: Repository[], searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return repos.filter(repo => 
      repo.name.toLowerCase().includes(term) ||
      (repo.description?.toLowerCase().includes(term)) ||
      (repo.readme?.toLowerCase().includes(term))
    );
  },[]);

  // Get the Sorted/Filtered Repos from Redux
  const filteredAndSortedRepos = useMemo(() => {
    const searchedRepos = searchRepos(reposRedux, searchTerm);
    const sorted = sortRepos(searchedRepos, selectedSort);
    return sorted;
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
            <h1 className="text-3xl font-bold text-gray-900">
              GitHub Explorer
            </h1>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              onClick={fetchRepos}
            >
              Fetch Repos
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <div>
            <SortSelect
              options={sortOptions}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
          </div>
        </div>

        {/* <pre>{JSON.stringify(reposRedux[0], null, 2)}</pre> */}
        { (reposRedux.length > 0) && <FilteringOptions/> }

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
