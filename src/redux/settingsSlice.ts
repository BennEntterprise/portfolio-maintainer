import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { getSettingsLS } from '../utils/localStorage';
import { z } from 'zod';
export interface FilterState {
  archiveCheckbox: boolean;
  activeCheckbox: boolean;
  publicCheckbox: boolean;
  privateCheckbox: boolean;
  selectedOrgs: Record<string, boolean>;
  excludedRepos: Array<string>;
}

export interface SettingsState {
  settingModalOpen: boolean;
  filters: FilterState;
  resultsPerPage: number;
}

export const SettingsSchema = z.object({
  settingModalOpen: z.boolean(),
  filters: z.object({
    archiveCheckbox: z.boolean(),
    activeCheckbox: z.boolean(),
    publicCheckbox: z.boolean(),
    privateCheckbox: z.boolean(),
    selectedOrgs: z.record(z.boolean()),
    excludedRepos: z.array(z.string())
  }),
  resultsPerPage: z.number(),
})

let initialFilterState: FilterState;
const savedSettings = getSettingsLS();

if(!savedSettings) {
  initialFilterState = {
    archiveCheckbox: true,
    activeCheckbox: true,
    publicCheckbox: true,
    privateCheckbox: true,
    selectedOrgs: {},
    excludedRepos: []
  };
} else {
  if(savedSettings !== null) {
    initialFilterState = savedSettings.filters
    initialFilterState.excludedRepos = initialFilterState.excludedRepos || [];
  } else {
    initialFilterState = {
      archiveCheckbox: true,
      activeCheckbox: true,
      publicCheckbox: true,
      privateCheckbox: true,
      selectedOrgs: {},
      excludedRepos: []
    };
  }
}

const initialState: SettingsState = {
  settingModalOpen: false,
  filters: initialFilterState,
  resultsPerPage: 25, // Add this line
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
    addExcludedRepo: (state, action: PayloadAction<string>) => {
      state.filters.excludedRepos?.push(action.payload.toLowerCase());
    },
    removeExcludedRepo: (state, action: PayloadAction<string>) => {
      state.filters.excludedRepos = state.filters.excludedRepos.filter(
        (repo) => repo !== action.payload.toLowerCase( )
      );
    },
    setExcludedRepos: (state, action: PayloadAction<string[]>) => {
      state.filters.excludedRepos = action.payload;
    },
    setResultsPerPage: (state, action: PayloadAction<number>) => {
      state.resultsPerPage = action.payload;
    },
  },
});

export const useSettings = () => useSelector((state: RootState) => state.settings);
export const useArchiveCheckbox = () => useSelector((state: RootState) => state.settings.filters.archiveCheckbox);
export const useActiveCheckbox = () => useSelector((state: RootState) => state.settings.filters.activeCheckbox);
export const usePublicCheckbox = () => useSelector((state: RootState) => state.settings.filters.publicCheckbox);
export const usePrivateCheckbox = () => useSelector((state: RootState) => state.settings.filters.privateCheckbox);
export const useSelectedOrgs = () => useSelector((state: RootState) => state.settings.filters.selectedOrgs);

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
  addExcludedRepo,
  removeExcludedRepo,
  setExcludedRepos,
  setResultsPerPage,
} = settingsSlice.actions;

export default settingsSlice.reducer;