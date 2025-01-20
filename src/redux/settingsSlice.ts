import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  archiveCheckbox: boolean;
  activeCheckbox: boolean;
  publicCheckbox: boolean;
  privateCheckbox: boolean;
  selectedOrgs: Record<string, boolean>;
}

interface SettingsState {
  settingModalOpen: boolean;
  filters: FilterState;
}

const initialFilterState: FilterState = {
  archiveCheckbox: true,
  activeCheckbox: true,
  publicCheckbox: true,
  privateCheckbox: true,
  selectedOrgs: {},
};

const initialState: SettingsState = {
  settingModalOpen: false,
  filters: initialFilterState,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    openSettings: (state) => {
      state.settingModalOpen = true;
    },
    closeSettings: (state) => {
      state.settingModalOpen = false;
    },
    toggleSettings: (state) => {
      state.settingModalOpen = !state.settingModalOpen;
    },
    toggleArchive: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.archiveCheckbox = action.payload;
      } else {
        state.filters.archiveCheckbox = !state.filters.archiveCheckbox;
      }
    },
    toggleActive: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.activeCheckbox = action.payload;
      } else {
        state.filters.activeCheckbox = !state.filters.activeCheckbox;
      }
    },
    togglePublic: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.publicCheckbox = action.payload;
      } else {
        state.filters.publicCheckbox = !state.filters.publicCheckbox;
      }
    },
    togglePrivate: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.privateCheckbox = action.payload;
      } else {
        state.filters.privateCheckbox = !state.filters.privateCheckbox;
      }
    },
    toggleOrg: (state, action: PayloadAction<string>) => {
      state.filters.selectedOrgs[action.payload] = !state.filters.selectedOrgs[action.payload];
    },
    restoreFiltersToTrue: (state) => {
      state.filters.archiveCheckbox = true;
      state.filters.activeCheckbox = true;
      state.filters.publicCheckbox = true;
      state.filters.privateCheckbox = true;
      Object.keys(state.filters.selectedOrgs).forEach(key => {
        state.filters.selectedOrgs[key] = true;
      });
    },
    setBulkOrgs: (state, action: PayloadAction<Record<string, boolean>>) => {
      Object.keys(action.payload).forEach(key => {
        state.filters.selectedOrgs[key] = action.payload[key] || false;
      });
    },
    setInitialOrgs: (state, action: PayloadAction<string[]>) => {
      const orgs = action.payload.reduce((acc: Record<string, boolean>, org) => {
        acc[org] = true;
        return acc;
      }, {});
      state.filters.selectedOrgs = orgs;
    },
    setAllFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters.archiveCheckbox = action.payload.archiveCheckbox;
      state.filters.activeCheckbox = action.payload.activeCheckbox;
      state.filters.publicCheckbox = action.payload.publicCheckbox;
      state.filters.privateCheckbox = action.payload.privateCheckbox;
      state.filters.selectedOrgs = action.payload.selectedOrgs;
    },
  },
});

export const {
  openSettings,
  closeSettings,
  toggleSettings,
  toggleArchive,
  toggleActive,
  togglePublic,
  togglePrivate,
  toggleOrg,
  restoreFiltersToTrue,
  setBulkOrgs,
  setInitialOrgs,
  setAllFilters,
} = settingsSlice.actions;

export default settingsSlice.reducer;