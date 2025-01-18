import { useDispatch } from "react-redux";
import { closeSettings } from "../redux/settingsSlice";
import { useState } from "react";

const SettingsModal = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(localStorage.getItem('VITE_GITHUB_TOKEN') || '');

  const handleSave = () => {
    localStorage.setItem('VITE_GITHUB_TOKEN', token);
    dispatch(closeSettings());
    window.location.reload(); // Reload to fetch repos with the new token
  };

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
        className="relative w-[80vw] h-[80vh]  max-w-4xl p-8 bg-white rounded-lg shadow-xl"
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
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;