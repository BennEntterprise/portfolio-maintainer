import { useDispatch } from "react-redux";
import { closeSettings } from "../redux/settingsSlice";

const SettingsModal = () => {
  const dispatch = useDispatch();
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
          <p className="text-gray-700">Settings content goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;