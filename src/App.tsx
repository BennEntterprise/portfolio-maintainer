import { useState, useMemo, useEffect } from "react";
import { Github, Loader } from "lucide-react";
import { RepoCard } from "./components/RepoCard";
import { SearchBar } from "./components/SearchBar";
import { SortSelect } from "./components/SortSelect";
import { useGitHub } from "./hooks/useGitHub";
import { SortOption } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { setRepos as setReposInRedux } from "./redux/repoSlice";
import { setInitialOrgs } from "./redux/filteringSlice";
import { RootState } from "./redux/store";

const sortOptions: SortOption[] = [
  { label: "Least Recently Updated", value: "updated", direction: "asc" },
  { label: "Recently Updated", value: "updated", direction: "desc" },
  { label: "Least Pull Requests", value: "pulls", direction: "asc" },
  { label: "Most Pull Requests", value: "pulls", direction: "desc" },
  { label: "Least Stars", value: "stars", direction: "asc" },
  { label: "Most Stars", value: "stars", direction: "desc" },
];

function App() {
  const { repos, loading, error, fetchRepos, sortRepos, searchRepos } =
    useGitHub();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const reposRedux = useSelector((state: RootState) => state.repo.value);

  // Some Local State for Filtering
  const [publicCheckbox, setPublicCheckbox] = useState(true);
  const [privateCheckbox, setPrivateCheckbox] = useState(true);
  const [active, setActive] = useState(true);
  const [archive, setArchive] = useState(true);
  const [selectedOrgs, setSelectedOrgs] = useState<Record<string, boolean>>({});

  // Take the Repos Returned from the Github Hook, and set them in Redux
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setReposInRedux(repos));
  }, [dispatch, repos]);

  useEffect(() => {
    const orgs = repos.reduce((acc: Record<string, boolean>, repo) => {
      const orgName = repo.full_name.split("/")[0];
      acc[orgName] = true;
      return acc;
    }, {});
    setSelectedOrgs(orgs);
  }, [repos]);

  const showFilters = useMemo(() => reposRedux.length > 0, [reposRedux]);

  // Get the Sorted/Filtered Repos from Redux
  const filteredAndSortedRepos = useMemo(() => {
    const filtered = searchRepos(reposRedux, searchTerm);
    return sortRepos(filtered, selectedSort);
  }, [reposRedux, searchTerm, selectedSort, searchRepos, sortRepos]);

  const availableOrgsList = useMemo(() => {
    const orgs = repos.reduce((acc: string[], repo) => {
      const orgName = repo.full_name.split("/")[0];
      if (!acc.includes(orgName)) {
        acc.push(orgName);
      }
      return acc;
    }, []);
    return orgs;
  }, [repos]);

  useEffect(() => {
    dispatch(setInitialOrgs(availableOrgsList));
  })

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

        {/*  Filtering Component*/}
        {showFilters && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Filters
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Visibility
                </h3>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="public"
                    name="visibility"
                    value="public"
                    className="mr-2"
                    checked={publicCheckbox}
                    onChange={() => setPublicCheckbox(!publicCheckbox)}
                  />
                  <label htmlFor="public" className="text-gray-700">
                    Public
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="private"
                    name="visibility"
                    value="private"
                    className="mr-2"
                    checked={privateCheckbox}
                    onChange={() => setPrivateCheckbox(!privateCheckbox)}
                  />
                  <label htmlFor="private" className="text-gray-700">
                    Private
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Status
                </h3>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="active"
                    name="status"
                    className="mr-2"
                    checked={active}
                    onChange={() => setActive(!active)}
                  />
                  <label htmlFor="active" className="text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="archive"
                    name="status"
                    className="mr-2"
                    checked={archive}
                    onChange={() => setArchive(!archive)}
                  />
                  <label htmlFor="archive" className="text-gray-700">
                    Archive
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Organization
                </h3>
                {availableOrgsList.map((org) => (
                  <div key={org} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={org}
                      name="organization"
                      className="mr-2"
                      value={org}
                      checked={selectedOrgs[org]}
                      onChange={(e) => {
                        setSelectedOrgs({
                          ...selectedOrgs,
                          [org]: e.target.checked,
                        });
                      }}
                    />
                    <label htmlFor={org} className="text-gray-700">
                      {org}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
