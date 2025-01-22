import { useMemo, useState } from "react";
import Pager from "./Pager";
import { selectSearchedRepos } from "../redux/repoSlice";
import { selectedSortOption } from "../redux/sortingSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { RepoCard } from "./card/RepoCard";

const RepoResultsContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const selectedSort = useSelector((state: RootState) =>
    selectedSortOption(state)
  );
  const filteredAndSortedRepos = useSelector((state: RootState) =>
    selectSearchedRepos(state, selectedSort)
  );
  const resultsPerPage = useSelector((state: RootState) => state.settings.resultsPerPage);

  const paginatedRepos = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    return filteredAndSortedRepos.slice(
      startIndex,
      startIndex + resultsPerPage
    );
  }, [filteredAndSortedRepos, currentPage, resultsPerPage]);

  return (
    <div className="flex flex-col items-center">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {paginatedRepos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
      {filteredAndSortedRepos.length > 0 && (
        <Pager
          totalEntries={filteredAndSortedRepos.length}
          entriesPerPage={resultsPerPage}
          currentPage={currentPage}
          onEntriesPerPageChange={() => {}} // No-op since we handle this in SettingsModal
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default RepoResultsContainer;