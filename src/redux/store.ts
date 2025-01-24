import searchSlice from './searchSlice';
import { configureStore } from '@reduxjs/toolkit'
import repoReducer from './repoSlice'
import settingsSlice from './settingsSlice'
import sortingSlice from './sortingSlice'
import themeSlice from './themeSlice'

export const store = configureStore({
  reducer: {
    repo: repoReducer,
    settings: settingsSlice,
    search: searchSlice,
    sorting: sortingSlice,
    theme: themeSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch