// src/components/settings/SettingsModal.tsx

import { useDispatch, useSelector } from "react-redux";
import { closeSettings, addExcludedRepo, removeExcludedRepo } from "../../redux/settingsSlice";
import { useCallback, useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { FilteringOptions } from "./FilteringOptions";
import { getLS, LOCAL_STORAGE_KEYS, setLS } from "../../utils/localStorage";

const SettingsModal = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(getLS(LOCAL_STORAGE_KEYS.VITE_GITHUB_TOKEN) || '');
  const [excludedRepoInput, setExcludedRepoInput] = useState('');
  const excludedRepos = useSelector((state: RootState) => state.settings.filters.excludedRepos);

  const handleSave = () => {
    setLS(LOCAL_STORAGE_KEYS.VITE_GITHUB_TOKEN, token);
    dispatch(closeSettings());
    window.location.reload(); // Reload to fetch repos with the new token
  };

  const handleAddExcludedRepo = () => {
    const repos = excludedRepoInput.split(',').map(repo => repo.trim());
    repos.forEach(repo => dispatch(addExcludedRepo(repo)));
    setExcludedRepoInput('');
  };

  const handleRemoveExcludedRepo = (repo: string) => {
    dispatch(removeExcludedRepo(repo));
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      dispatch(closeSettings());
    }
  },[dispatch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      id='dialog-background-and-contents'
      className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500/75"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        id='dialog-wrapper'
        className="relative w-[80vw] h-[80vh]  max-w-4xl p-8 bg-white rounded-lg shadow-xl overflow-scroll"
        >
        <div
          id='dialog-header'
          className="flex justify-between items-center mb-4"
          >
          <h3 className="text-2xl font-semibold text-gray-900" id="modal-title">
            Settings
          </h3>
          <button
            onClick={() => dispatch(closeSettings())}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <div
          id='dialog-main'
          className="mt-4">
          <p className="text-gray-700">Enter your GitHub token:</p>
            <div className="flex flex-row gap-2">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            <button
              onClick={handleSave}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
              >
              Save
            </button>
            </div>
        </div>
        <div>
          <FilteringOptions />
        </div>
        <div>
          <h3 className="text-gray-700 mt-4">Exclude Repositories:</h3>
          <div className="flex flex-row gap-2 mt-2">
            <input
              type="text"
              value={excludedRepoInput}
              onChange={(e) => setExcludedRepoInput(e.target.value)}
              placeholder="Enter repo names, comma separated"
              className="w-full p-2 border border-gray-300 rounded"
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
              <li key={repo} className="flex justify-between items-center">
                <span>{repo}</span>
                <button
                  onClick={() => handleRemoveExcludedRepo(repo)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;