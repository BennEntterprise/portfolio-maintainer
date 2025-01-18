import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Repository } from '../types'

export interface RepoState {
    value: Repository[]
}

const initialState: RepoState = {
    value: [],
}

export const repoSlice = createSlice({
    name: 'repo',
    initialState,
    reducers: {
        setRepos: (state, action: PayloadAction<Repository[]>) => {
            state.value = action.payload
        },
    },
})

export const { setRepos } = repoSlice.actions

export default repoSlice.reducer