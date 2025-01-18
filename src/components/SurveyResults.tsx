import { ShieldQuestion } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectSearchedRepos } from "../redux/repoSlice";
import { RootState } from "../redux/store";
import { selectedSortOption } from "../redux/sortingSlice";

const SurveyResults = () => {
  const selectedSort = useSelector((state: RootState) =>
    selectedSortOption(state)
  );
  const filteredAndSortedRepos = useSelector((state: RootState) =>
    selectSearchedRepos(state, selectedSort)
  );

  const [satisfactory, unsatisfactory, optionalMissing] = useMemo(() => {
    let totalCheckboxes = 0;
    let totalXs = 0;
    let totalOptionalMissing = 0;
    filteredAndSortedRepos.forEach((repo) => {
      if (repo.hasDevcontainer) {
        totalCheckboxes += 1;
      } else {
        totalOptionalMissing += 1;
      }

      if (repo.hasDockerfile) {
        totalCheckboxes += 1;
      } else {
        totalOptionalMissing += 1;
      }

      if (repo.hasReadme) {
        totalCheckboxes += 1;
      } else {
        totalXs += 1;
      }

      if (repo.hasTodo) {
        totalCheckboxes += 1;
      } else {
        totalXs += 1;
      }

      if (repo.license) {
        totalCheckboxes += 1;
      } else {
        totalXs += 1;
      }
    });
    return [totalCheckboxes, totalXs, totalOptionalMissing];
  }, [filteredAndSortedRepos]);

  return (
    <div className="w-1/2 flex  flex-row items-center justify-center m-4">
      <span>Survey Results: </span>
      <span>{satisfactory} ✅</span>
      <span>{unsatisfactory} ❌</span>
      <span className="flex">
        {optionalMissing} <ShieldQuestion />
      </span>
    </div>
  );
};

export default SurveyResults