import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { FilterState } from "./settingsSlice";
import { Repository, SortOption } from "../types";
import { RootState } from "./store";

export interface RepoState {
  value: Repository[];
}

const initialState: RepoState = {
  value: [],
};

export const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    setRepos: (state, action: PayloadAction<Repository[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setRepos } = repoSlice.actions;

export default repoSlice.reducer;

// Selectors
export const selectRepos = (state: RootState) => state.repo.value;

export const selectFilteredRepos = createSelector(
  [selectRepos, (state: RootState) => state.settings.filters],
  (repos, filterState: FilterState) => {
    return repos.filter((repo) => {
      const isArchived = !filterState.archiveCheckbox && repo.archived;
      const isActive = !filterState.activeCheckbox && !repo.archived;
      const isPublic = !filterState.publicCheckbox && !repo.private;
      const isPrivate = !filterState.privateCheckbox && repo.private;
      const isOrgSelected = !filterState.selectedOrgs[repo.organization || ""];
      const isExcluded = filterState.excludedRepos.includes(repo.name.toLowerCase());

      return !(
        isArchived ||
        isActive ||
        isPublic ||
        isPrivate ||
        isOrgSelected ||
        isExcluded
      );
    });
  }
);

export const selectSortedRepos = createSelector(
  [
    selectFilteredRepos,
    (_state: RootState, selectedSort: SortOption) => selectedSort,
  ],
  (repos, selectedSort) => {
    return [...repos].sort((a, b) => {
      const multiplier = selectedSort.direction === "desc" ? -1 : 1;

      switch (selectedSort.value) {
        case "alphabetical":
          return multiplier * a.name.localeCompare(b.name);
        case "pulls":
          return multiplier * ((a.pulls_count || 0) - (b.pulls_count || 0));
        case "updated":
          if (a.updated_at === null || b.updated_at === null) {
            throw new Error("Updated at is null");
          }
          return (
            multiplier *
            (new Date(a.updated_at).getTime() -
              new Date(b.updated_at).getTime())
          );
        case "stars":
          return multiplier * (a.stargazers_count - b.stargazers_count);
        case "issues":
          return multiplier * (a.open_issues_count - b.open_issues_count);
        default:
          return 0;
      }
    });
  }
);

export const selectSearchedRepos = createSelector(
  [selectSortedRepos, (state: RootState) => state.search.searchTerm],
  (repos, searchTerm) => {
    const term = searchTerm.toLowerCase();
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(term) ||
        repo.description?.toLowerCase().includes(term) ||
        repo.readme?.toLowerCase().includes(term)
    );
  }
);
