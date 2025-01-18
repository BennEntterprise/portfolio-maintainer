import { useMemo, useState } from "react";
import SurveyResults from "./SurveyResults";
import Pager from ".//Pager";
import { selectSearchedRepos } from "../redux/repoSlice";
import { selectedSortOption } from "../redux/sortingSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { RepoCard } from "./RepoCard";

const RepoResultsContainer = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const selectedSort = useSelector((state: RootState) =>
    selectedSortOption(state)
  );
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

  return (
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
  )
}

export default RepoResultsContainer;