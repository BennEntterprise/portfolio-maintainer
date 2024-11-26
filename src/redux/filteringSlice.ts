import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        toggleArchive: (state) => {
            state.archiveCheckbox = !state.archiveCheckbox;
        },
        toggleActive: (state) => {
            state.activeCheckbox = !state.activeCheckbox;
        },
        togglePublic: (state) => {
            state.publicCheckbox = !state.publicCheckbox;
        },
        togglePrivate: (state) => {
            state.privateCheckbox = !state.privateCheckbox;
        },
        toggleOrg: (state, action: PayloadAction<string>) => {
            state.selectedOrgs[action.payload] = !state.selectedOrgs[action.payload];
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

export const {
    toggleArchive,
    toggleActive,
    togglePublic,
    togglePrivate,
    toggleOrg,
    setInitialOrgs
} = filterSlice.actions

export default filterSlice.reducer