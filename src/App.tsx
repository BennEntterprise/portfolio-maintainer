import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2Icon } from "lucide-react";
import { RootState } from "./redux/store";
import { setRepos as setReposInRedux } from "./redux/repoSlice";
import { useGitHub } from "./hooks/useGitHub";
import { Footer } from "./components/layout/Footer";
import SettingsModal from "./components/settings/SettingsModal";
import Header from "./components/layout/Header";
import { openSettings } from "./redux/settingsSlice";
import { SearchAndSortContainer } from "./components/settings/SearchAndSortContainer";
import RepoResultsContainer from "./components/RepoResultsContainer";
import { getLS, LOCAL_STORAGE_KEYS } from "./utils/localStorage";
import { selectTheme } from "./redux/themeSlice";

function App() {
  const { repos, error, fetchRepos, firstFetchComplete, loading } = useGitHub();
  const settingModalOpen = useSelector(
    (state: RootState) => state.settings.settingModalOpen
  );
  const reposRedux = useSelector((state: RootState) => state.repo.value);
  const theme = useSelector(selectTheme);

  const dispatch = useDispatch();
  useEffect(() => {
    const token = getLS(LOCAL_STORAGE_KEYS.VITE_GITHUB_TOKEN);
    if (!token) {
      dispatch(openSettings());
    } else {
      fetchRepos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setReposInRedux(repos));
  }, [dispatch, repos]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--app-bg-color)" }}>
      {settingModalOpen && <SettingsModal />}
      <div className="max-w-7xl mx-auto">
        <Header />
        {loading && (
          <div className="flex w-full justify-center">
            <Loader2Icon className="loading" />
          </div>
        )}
        {reposRedux.length > 0 && (
          <>
            <SearchAndSortContainer />
            <RepoResultsContainer />
          </>
        )}
        {!firstFetchComplete ? null : <Footer />}
      </div>
    </div>
  );
}

export default App;
