import searchSlice from './searchSlice';
import { configureStore } from '@reduxjs/toolkit'
import filteringSlice from './filteringSlice'
import repoReducer from './repoSlice'
import settingsSlice from './settingsSlice'
import sortingSlice from './sortingSlice'

export const store = configureStore({
  reducer: {
    repo: repoReducer,
    filtering: filteringSlice,
    settings: settingsSlice,
    search: searchSlice,
    sorting: sortingSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch