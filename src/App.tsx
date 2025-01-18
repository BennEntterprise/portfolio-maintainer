import "react-tooltip/dist/react-tooltip.css";
import { Loader2Icon } from "lucide-react";
import { RepoCard } from "./components/RepoCard";
import { RootState } from "./redux/store";
import { setRepos as setReposInRedux } from "./redux/repoSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGitHub } from "./hooks/useGitHub";
import { Footer } from "./components/Footer";
import Pager from "./components/Pager";
import SettingsModal from "./components/SettingsModal";
import Header from "./components/Header";
import SurveyResults from "./components/SurveyResults";
import { openSettings } from "./redux/settingsSlice";
import { selectSearchedRepos } from "./redux/repoSlice";
import { SearchAndSortContainer } from "./components/SearchAndSortContainer";
import { selectedSortOption } from "./redux/sortingSlice";

function App() {
  const { repos, error, fetchRepos, firstFetchComplete, loading } = useGitHub();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const settingModalOpen = useSelector(
    (state: RootState) => state.settings.settingModalOpen
  );
  const reposRedux = useSelector((state: RootState) => state.repo.value);
  const selectedSort = useSelector((state: RootState) =>
    selectedSortOption(state)
  );

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

  const filteredAndSortedRepos = useSelector((state: RootState) =>
    selectSearchedRepos(state, selectedSort)
  );

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
      {settingModalOpen && <SettingsModal />}
      <div className="max-w-7xl mx-auto">
        <Header />
        {loading && (
          <div className="flex w-full justify-center">
            <Loader2Icon className="loading" />
          </div>
        )}

        {reposRedux.length > 0 && <SearchAndSortContainer />}

        {reposRedux.length > 0 && (
          <div className="flex flex-col items-center">
            <Pager
              totalEntries={filteredAndSortedRepos.length}
              entriesPerPage={entriesPerPage}
              currentPage={currentPage}
              onEntriesPerPageChange={setEntriesPerPage}
              onPageChange={setCurrentPage}
            />
            <SurveyResults />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
            {filteredAndSortedRepos.length > 0 && (
              <Pager
                totalEntries={filteredAndSortedRepos.length}
                entriesPerPage={entriesPerPage}
                currentPage={currentPage}
                onEntriesPerPageChange={setEntriesPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}

        {!firstFetchComplete ? null : <Footer />}
      </div>
    </div>
  );
}

export default App;
