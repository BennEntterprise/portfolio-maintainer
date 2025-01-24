import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from './store'
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

interface ThemeState {
  value: "light" | "dark";
}

const initialState: ThemeState = {
  value: systemTheme
};

alert(`Initial theme: ${initialState.value}`); // Debugging line
export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.value = action.payload;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

// Theme selector
export const selectTheme = (state: RootState) => state.theme.value;