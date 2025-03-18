import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { SortOption } from '../types';

export interface SortingState {
  sortedOptions: SortOption[];
  selectedSort: SortOption;
}

const initialState: SortingState = {
  sortedOptions: [
    { label: "Least Recently Updated", value: "updated", direction: "asc" },
    { label: "Recently Updated", value: "updated", direction: "desc" },
    { label: "Least Pull Requests", value: "pulls", direction: "asc" },
    { label: "Most Pull Requests", value: "pulls", direction: "desc" },
    { label: "Least Stars", value: "stars", direction: "asc" },
    { label: "Most Stars", value: "stars", direction: "desc" },
    { label: "Most Issues", value: "issues", direction: "desc"},
    { label: "Least Issues", value: "issues", direction: "asc"},
    { label: "Abc", value: "alphabetical", direction: "asc"},
    { label: "Zyx", value: "alphabetical", direction: "desc"},
  ],
  selectedSort: { label: "Least Recently Updated", value: "updated", direction: "asc" },
};

export const sortingSlice = createSlice({
  name: 'sorting',
  initialState,
  reducers: {
    setSort: (state, action) => {
      state.selectedSort = action.payload;
    },
  },
});

export const { setSort } = sortingSlice.actions;
export default sortingSlice.reducer;

export const selectedSortOption = (state: RootState) => state.sorting.selectedSort
export const selectSortOptions = (state: RootState) => state.sorting.sortedOptions