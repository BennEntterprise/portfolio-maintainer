import { toggleSettings } from '../redux/settingsSlice'
import { useDispatch } from "react-redux";
import { Github, Settings as SettingsCog } from "lucide-react";

const Header = () => {
  const dispatch = useDispatch();

  return (
    <header className="flex items-center justify-start mb-8">
      <div className="flex items-center justify-between w-full">
        <Github className="w-8 h-8 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">GitHub Explorer</h1>
        <SettingsCog onClick={() => dispatch(toggleSettings())} />
      </div>
    </header>
  );
};

export default Header;