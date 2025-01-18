import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "./SearchBar";
import { SortSelect } from "./SortSelect";
import { RootState } from "../redux/store";
import { useCallback } from "react";
import { setSearchTerm } from "../redux/searchSlice";
import { SortOption } from "../types";
import { setSort } from "../redux/sortingSlice";

export const SearchAndSortContainer = () => {
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  // const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const selectedSort = useSelector((state: RootState) => state.sorting.selectedSort);
  const sortOptions = useSelector((state: RootState) => state.sorting.sortedOptions);
  const dispatch = useDispatch();

  const setTerm = useCallback((term: string) => {
    dispatch(setSearchTerm(term));
  },[dispatch]);

  const setSortOption = useCallback((sort: SortOption) => {
    dispatch(setSort(sort));
  },[dispatch]);

  return (
    <section id="sort-search-filter-options" className="flex flex-col">
      <div
        id="search-and-filter-controls"
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="flex-1">
          <SearchBar searchTerm={searchTerm} onSearchChange={setTerm} />
        </div>
        <div>
          <SortSelect
            options={sortOptions}
            selectedSort={selectedSort}
            onSortChange={setSortOption}
          />
        </div>
      </div>
    </section>
  );
};
