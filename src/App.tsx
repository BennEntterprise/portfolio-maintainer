import "react-tooltip/dist/react-tooltip.css";
import { FilteringOptions } from "./components/FilteringOptions";
import { FilterState } from "./redux/filteringSlice";
import { Github, Loader } from "lucide-react";
import { RepoCard } from "./components/RepoCard";
import { Repository, SortOption } from "./types";
import { RootState } from "./redux/store";
import { SearchBar } from "./components/SearchBar";
import { setRepos as setReposInRedux } from "./redux/repoSlice";
import { SortSelect } from "./components/SortSelect";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGitHub } from "./hooks/useGitHub";
import Pager from "./components/Pager";

const sortOptions: SortOption[] = [
  { label: "Least Recently Updated", value: "updated", direction: "asc" },
  { label: "Recently Updated", value: "updated", direction: "desc" },
  { label: "Least Pull Requests", value: "pulls", direction: "asc" },
  { label: "Most Pull Requests", value: "pulls", direction: "desc" },
  { label: "Least Stars", value: "stars", direction: "asc" },
  { label: "Most Stars", value: "stars", direction: "desc" },
];

function App() {
  const { repos, loading, error, fetchRepos } = useGitHub();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const reposRedux = useSelector((state: RootState) => state.repo.value);
  const filterState = useSelector((state: RootState) => state.filtering);

  const dispatch = useDispatch();

  // We set the repos gathered from the GitHub API
  // to the Redux store. We _could_ have done
  // this in the useGitHub hook, but I want
  // to keep hook logic separate
  // from Redux logic which is
  // why we're doing it here.
  useEffect(() => {
    dispatch(setReposInRedux(repos));
  }, [dispatch, repos]);

  const sortRepos = useCallback((repos: Repository[], option: SortOption) => {
    return [...repos].sort((a, b) => {
      const multiplier = option.direction === "desc" ? -1 : 1;

      switch (option.value) {
        case "pulls":
          return multiplier * ((a.pulls_count || 0) - (b.pulls_count || 0));
        case "updated":
          return (
            multiplier *
            (new Date(a.updated_at).getTime() -
              new Date(b.updated_at).getTime())
          );
        case "stars":
          return multiplier * (a.stargazers_count - b.stargazers_count);
        default:
          return 0;
      }
    });
  }, []);

  const searchRepos = useCallback(
    (reposRedux: Repository[], searchTerm: string) => {
      const term = searchTerm.toLowerCase();
      return reposRedux.filter(
        (repo) =>
          repo.name.toLowerCase().includes(term) ||
          repo.description?.toLowerCase().includes(term) ||
          repo.readme?.toLowerCase().includes(term)
      );
    },
    []
  );

  const filterRepos = useCallback(
    (repos: Repository[], filterState: FilterState) => {
      return repos.filter((repo) => {
        const isArchived = !filterState.archiveCheckbox && repo.archived;
        const isActive = !filterState.activeCheckbox && !repo.archived;
        const isPublic = !filterState.publicCheckbox && repo.private;
        const isPrivate = !filterState.privateCheckbox && !repo.private;
        const isOrgSelected =
          !filterState.selectedOrgs[repo.organization || ""];

        return !(
          isArchived ||
          isActive ||
          isPublic ||
          isPrivate ||
          isOrgSelected
        );
      });
    },
    []
  );

  // Get the Sorted/Filtered Repos from Redux
  const filteredAndSortedRepos = useMemo(() => {
    const filtered = filterRepos(reposRedux, filterState);
    const sorted = sortRepos(filtered, selectedSort);
    const searchedRepos = searchRepos(sorted, searchTerm);
    return searchedRepos;
  }, [
    reposRedux,
    searchTerm,
    selectedSort,
    searchRepos,
    sortRepos,
    filterRepos,
    filterState,
  ]);

  const paginatedRepos = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filteredAndSortedRepos.slice(
      startIndex,
      startIndex + entriesPerPage
    );
  }, [filteredAndSortedRepos, currentPage, entriesPerPage]);

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
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center justify-between w-full">
            <Github className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              GitHub Explorer
            </h1>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 flex flex-row items-center justify-center"
              onClick={fetchRepos}
            >
              <span>Fetch Repos</span>
              <span>
                {loading && (
                  <Loader
                    color="#fff"
                    className="w-4 h-4 animate-spin text-blue-500 ml-2"
                  />
                )}
              </span>
            </button>
          </div>
        </header>

        {reposRedux.length > 0 && (
          <section id="sort-search-filter-options" className="flex flex-col">
            <h2>Sort, Search & Filter Options</h2>
            <div
              id="search-and-filter-controls"
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
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
          </section>
        )}

        {reposRedux.length > 0 && (
          <>
            <FilteringOptions />
            <Pager
              totalEntries={filteredAndSortedRepos.length}
              entriesPerPage={entriesPerPage}
              currentPage={currentPage}
              onEntriesPerPageChange={setEntriesPerPage}
              onPageChange={setCurrentPage}
            />
            <div className="flex flex w-full justify-around">
              <p>Total Visible Repos: {filteredAndSortedRepos.length}</p>
              <p>Total Repos: {reposRedux.length}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
            <Pager
              totalEntries={filteredAndSortedRepos.length}
              entriesPerPage={entriesPerPage}
              currentPage={currentPage}
              onEntriesPerPageChange={setEntriesPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
