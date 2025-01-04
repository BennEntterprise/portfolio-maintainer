import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from './store'; // Adjust the import according to your store file location
import { useSelector } from 'react-redux';

export interface FilterState {
    archiveCheckbox: boolean;
    activeCheckbox: boolean;
    publicCheckbox: boolean;
    privateCheckbox: boolean;
    selectedOrgs: Record<string, boolean>;
}

const initialState: FilterState = {
    archiveCheckbox: true,
    activeCheckbox: true,
    publicCheckbox: true,
    privateCheckbox: true,
    selectedOrgs: {},
}

export const filterSlice = createSlice({
    name: 'filtering',
    initialState,
    reducers: {
        toggleArchive: (state, action: PayloadAction<boolean | undefined>) => {
            if ( action.payload !== undefined ) {
                state.archiveCheckbox = action.payload;
            } else {
                state.archiveCheckbox = !state.archiveCheckbox;
            }
        },
        toggleActive: (state, action: PayloadAction<boolean | undefined>) => {
            if ( action.payload !== undefined ) {
                state.activeCheckbox = action.payload;
            } else {
                state.activeCheckbox = !state.activeCheckbox;
            }
        },
        togglePublic: (state, action: PayloadAction<boolean | undefined>) => {
            if ( action.payload !== undefined ) {
                state.publicCheckbox = action.payload;
            } else {
                state.publicCheckbox = !state.publicCheckbox;
            }
        },
        togglePrivate: (state, action: PayloadAction<boolean | undefined>) => {
            if ( action.payload !== undefined ) {
                state.privateCheckbox = action.payload;
            } else {
                state.privateCheckbox = !state.privateCheckbox;
            }
        },
        toggleOrg: (state, action: PayloadAction<string>) => {
            state.selectedOrgs[action.payload] = !state.selectedOrgs[action.payload];
        },
        restoreFiltersToTrue: (state) => {
            state.archiveCheckbox = true;
            state.activeCheckbox = true;
            state.publicCheckbox = true;
            state.privateCheckbox = true;
            // Set all orgs to true
            Object.keys(state.selectedOrgs).forEach(key => {
                state.selectedOrgs[key] = true;
            })
        },
        setBulkOrgs: (state, action: PayloadAction<Record<string, boolean>>) => {
            Object.keys(action.payload).forEach(key => {
                state.selectedOrgs[key] = action.payload[key] || false
            })
        },
        setInitialOrgs: (state, action: PayloadAction<string[]>) => {
            const orgs = action.payload.reduce((acc: Record<string, boolean>, org) => {
                acc[org] = true;
                return acc;
            }, {});
            state.selectedOrgs = orgs;
        }
    },
})

export const useArchiveCheckbox = () => useSelector((state: RootState) => state.filtering.archiveCheckbox);
export const useActiveCheckbox = () => useSelector((state: RootState) => state.filtering.activeCheckbox);
export const usePublicCheckbox = () => useSelector((state: RootState) => state.filtering.publicCheckbox);
export const usePrivateCheckbox = () => useSelector((state: RootState) => state.filtering.privateCheckbox);
export const useSelectedOrgs = () => useSelector((state: RootState) => state.filtering.selectedOrgs);

export const {
    setBulkOrgs,
    toggleArchive,
    toggleActive,
    togglePublic,
    togglePrivate,
    toggleOrg,
    restoreFiltersToTrue,
    setInitialOrgs
} = filterSlice.actions

export default filterSlice.reducer