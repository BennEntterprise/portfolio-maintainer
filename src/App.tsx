import "react-tooltip/dist/react-tooltip.css";
import { Loader2Icon } from "lucide-react";
import { RootState } from "./redux/store";
import { setRepos as setReposInRedux } from "./redux/repoSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGitHub } from "./hooks/useGitHub";
import { Footer } from "./components/Footer";
import SettingsModal from "./components/SettingsModal";
import Header from "./components/Header";
import { openSettings } from "./redux/settingsSlice";
import { SearchAndSortContainer } from "./components/SearchAndSortContainer";
import RepoResultsContainer from "./components/RepoResultsContainer";

function App() {
  const { repos, error, fetchRepos, firstFetchComplete, loading } = useGitHub();
  const settingModalOpen = useSelector(
    (state: RootState) => state.settings.settingModalOpen
  );
  const reposRedux = useSelector((state: RootState) => state.repo.value);

  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("VITE_GITHUB_TOKEN");
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
