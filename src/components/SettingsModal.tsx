import { useDispatch } from "react-redux";
import {closeSettings} from '../redux/settingsSlice';

const SettingsModal = () => {
  const dispatch = useDispatch();
  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-gray-500/75 transition-opacity"
      aria-hidden="true"
    >
      <div
        id="modal-container"
        className="fixed inset-0 z-10 w-screen h-screen flex items-center justify-center"
      >
        <div
          id="modal-content"
          className="relative w-11/12 h-5/6 bg-white rounded-lg shadow-xl overflow-hidden"
        >
          <button
            onClick={() => dispatch(closeSettings())}
            className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
