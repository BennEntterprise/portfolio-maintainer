import { createSlice } from '@reduxjs/toolkit'


interface SettingsState {
    settingModalOpen: boolean;
}

const initialState: SettingsState = {
    settingModalOpen: false
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        openSettings: (state) => {
            state.settingModalOpen = true
        },
        closeSettings: (state) => {
            state.settingModalOpen = false
        },
        toggleSettings: (state) => {
            state.settingModalOpen = !state.settingModalOpen
        }
    }
})


export const { openSettings, closeSettings, toggleSettings } = settingsSlice.actions
export default settingsSlice.reducer