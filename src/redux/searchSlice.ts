import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { useSelector } from 'react-redux';

export interface SearchState {
    searchTerm: string;
}

const initialState: SearchState = {
    searchTerm: '',
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
    },
});

export const useSearchTerm = () => useSelector((state: RootState) => state.search.searchTerm);

export const { setSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;