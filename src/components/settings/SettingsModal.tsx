import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExcludedRepo,
  closeSettings,
  removeExcludedRepo,
  restoreFiltersToTrue,
  setBulkOrgs,
  setInitialOrgs,
  setResultsPerPage,
  toggleActive,
  toggleArchive,
  toggleOrg,
  togglePrivate,
  togglePublic,
  useActiveCheckbox,
  useArchiveCheckbox,
  usePrivateCheckbox,
  usePublicCheckbox,
  useSelectedOrgs,
} from "../../redux/settingsSlice";
import { RootState } from "../../redux/store";
import { Repository } from "../../types";
import {
  deleteLS,
  getLS,
  LOCAL_STORAGE_KEYS,
  setLS,
} from "../../utils/localStorage";
import { toggleTheme } from "../../redux/themeSlice"; // Import the toggleTheme action

const SettingsModal = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(
    getLS(LOCAL_STORAGE_KEYS.VITE_GITHUB_TOKEN) || ""
  );
  const [excludedRepoInput, setExcludedRepoInput] = useState("");
  const excludedRepos = useSelector(
    (state: RootState) => state.settings.filters.excludedRepos
  );
  const resultsPerPage = useSelector(
    (state: RootState) => state.settings.resultsPerPage
  );
  const reposRedux = useSelector((state: RootState) => state.repo.value);
  const archiveCheckbox = useArchiveCheckbox();
  const activeCheckbox = useActiveCheckbox();
  const publicCheckbox = usePublicCheckbox();
  const privateCheckbox = usePrivateCheckbox();
  const selectedOrgs = useSelectedOrgs();
  const theme = useSelector((state: RootState) => state.theme.value);

  const availableOrgsList = useMemo(() => {
    const orgs = reposRedux.reduce((acc: string[], repo: Repository) => {
      const orgName = repo.full_name.split("/")[0];
      if (!acc.includes(orgName)) {
        acc.push(orgName);
      }
      return acc;
    }, []);
    return orgs;
  }, [reposRedux]);

  // TODO: refactor this into a utility file
  const saveFilterStatusToLocalStorage = () => {
    setLS(
      LOCAL_STORAGE_KEYS.SAVED_SETTINGS,
      JSON.stringify({
        activeCheckbox,
        archiveCheckbox,
        publicCheckbox,
        privateCheckbox,
        selectedOrgs,
      })
    );
  };

  // TODO: refactor this into a utility file
  const loadFilterStatusFromLocalStorage = useCallback(() => {
    const filterStatus = getLS(LOCAL_STORAGE_KEYS.SAVED_SETTINGS);
    if (filterStatus) {
      const filterStatusObj = JSON.parse(filterStatus);
      dispatch(toggleActive(filterStatusObj.activeCheckbox));
      dispatch(toggleArchive(filterStatusObj.archiveCheckbox));
      dispatch(togglePublic(filterStatusObj.publicCheckbox));
      dispatch(togglePrivate(filterStatusObj.privateCheckbox));
      dispatch(setBulkOrgs(filterStatusObj.selectedOrgs));
    }
  }, [dispatch]);

  // TODO: refactor this into a utility file
  const resetLocalStorageFilters = () => {
    deleteLS(LOCAL_STORAGE_KEYS.SAVED_SETTINGS);
    deleteLS(LOCAL_STORAGE_KEYS.VITE_GITHUB_TOKEN);
    dispatch(restoreFiltersToTrue());
  };

  useEffect(() => {
    dispatch(setInitialOrgs(availableOrgsList));
    loadFilterStatusFromLocalStorage();
  }, [
    reposRedux,
    availableOrgsList,
    dispatch,
    loadFilterStatusFromLocalStorage,
  ]);

  const handleSaveToken = () => {
    setLS(LOCAL_STORAGE_KEYS.VITE_GITHUB_TOKEN, token);
    dispatch(closeSettings());
    window.location.reload(); // Reload to fetch repos with the new token
  };

  const handleAddExcludedRepo = () => {
    const repos = excludedRepoInput.split(",").map((repo) => repo.trim());
    repos.forEach((repo) => dispatch(addExcludedRepo(repo)));
    setExcludedRepoInput("");
  };

  const handleRemoveExcludedRepo = (repo: string) => {
    dispatch(removeExcludedRepo(repo));
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(closeSettings());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      id="dialog-background-and-contents"
      className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500/75"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="dialog-wrapper"
        className="relative w-[80vw] h-[80vh]  max-w-4xl p-8 bg-white rounded-lg shadow-xl overflow-scroll"
        style={{ backgroundColor: "var(--component-bg-color)" }}
      >
        <div
          id="dialog-header"
          className="flex justify-between items-center mb-4"
        >
          <h3
            id="modal-title"
            className="text-2xl font-semibold text-gray-900"
            style={{ color: "var(--text-color)" }}
          >
            Settings
          </h3>
          <button
            onClick={() => dispatch(closeSettings())}
            className="text-gray-500 hover:text-gray-700"
            style={{ color: "var(--text-color)" }}
          >
            Close
          </button>
        </div>
        <div id="dialog-main" className="mt-4">
          <p className="text-gray-700" style={{ color: "var(--text-color)" }}>
            Enter your GitHub token:
          </p>
          <div className="flex flex-row gap-2">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              style={{
                backgroundColor: "var(--component-bg-color)",
                color: "var(--text-color)",
              }}
            />
            <button
              onClick={handleSaveToken}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
        <div id="theme-toggle" className="my-4">
          <h3 className="text-gray-700" style={{ color: "var(--text-color)" }}>
            Theme:
          </h3>
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => dispatch(toggleTheme())}
              className="mr-2"
            />
            <span
              className="text-gray-700"
              style={{ color: "var(--text-color)" }}
            >
              Dark Mode
            </span>
          </label>
        </div>
        <div
          id="filtering-options"
          className="my-4 mx-1 border-2 rounded-md border-black-100 p-8 bg-slate-200"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Visibility</h3>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="public"
                  name="visibility"
                  value="public"
                  className="mr-2"
                  checked={publicCheckbox}
                  onChange={() => dispatch(togglePublic())}
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
                  onChange={() => dispatch(togglePrivate())}
                />
                <label htmlFor="private" className="text-gray-700">
                  Private
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Status</h3>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="active"
                  name="status"
                  className="mr-2"
                  checked={activeCheckbox}
                  onChange={() => dispatch(toggleActive())}
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
                  checked={archiveCheckbox}
                  onChange={() => dispatch(toggleArchive())}
                />
                <label htmlFor="archive" className="text-gray-700">
                  Archive
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Organization</h3>
              {availableOrgsList.map((org) => (
                <div key={org} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={org}
                    name="organization"
                    className="mr-2"
                    value={org}
                    // 👇 Bang Bang is needed to prevent undefined from throwing
                    // a warning in React: uncontrolled to controlled component.
                    checked={!!selectedOrgs[org]}
                    onChange={(e) => {
                      dispatch(toggleOrg(e.target.value));
                    }}
                  />
                  <label htmlFor={org} className="text-gray-700">
                    {org}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div
            id="filter-save-buttons"
            className="w-full flex justify-center mt-4"
          >
            <button
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              type="button"
              onClick={saveFilterStatusToLocalStorage}
            >
              Save All Except Token
            </button>
            {/* <button
          className="inline-flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 sm:ml-3 sm:w-auto"
          type="button"
          onClick={loadFilterStatusFromLocalStorage}
        >
          Load
        </button> */}
            <button
              className="inline-flex w-full justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 sm:ml-3 sm:w-auto"
              type="button"
              onClick={resetLocalStorageFilters}
            >
              Reset All (Including Token)
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-gray-700 mt-4" style={{ color: 'var(--text-color)' }}>Exclude Repositories:</h3>
          <div className="flex flex-row gap-2 mt-2">
            <input
              type="text"
              value={excludedRepoInput}
              onChange={(e) => setExcludedRepoInput(e.target.value)}
              placeholder="Enter repo names, comma separated"
              className="w-full p-2 border border-gray-300 rounded"
              style={{ backgroundColor: "var(--component-bg-color)", color: "var(--text-color)" }}
            />
            <button
              onClick={handleAddExcludedRepo}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add
            </button>
          </div>
          <ul className="mt-2">
            {excludedRepos?.map((repo) => (
              <li
                key={repo}
                className="flex justify-between items-center"
                style={{ color: "var(--text-color)" }}
              >
                <span>{repo}</span>
                <button
                  onClick={() => handleRemoveExcludedRepo(repo)}
                  className="text-red-600 hover:text-red-800"
                  style={{ color: "var(--text-color)" }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-gray-700 mt-4" style={{ color: 'var(--text-color)' }}>Results Per Page:</h3>
          <select
            value={resultsPerPage}
            onChange={(e) =>
              dispatch(setResultsPerPage(Number(e.target.value)))
            }
            className="w-full p-2 border border-gray-300 rounded"
            style={{ backgroundColor: "var(--component-bg-color)", color: "var(--text-color)" }}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
