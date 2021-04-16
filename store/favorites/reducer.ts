import { createReducer } from '@reduxjs/toolkit'
import {
    addFavoriteToken,
    removeFavoriteToken
} from './actions'
export interface FavoriteTokensState {
    tokens: string[]
}
export const initialState: FavoriteTokensState = {
    tokens: []
}
export default createReducer(initialState, builder =>
{
    builder
        .addCase(addFavoriteToken, (state, action) => {
        if (!state.tokens.includes(action.payload.tokenSymbol)) {
            state.tokens.push(action.payload.tokenSymbol)

        }})
        .addCase(removeFavoriteToken, (state, action)=> {
        if (state.tokens.includes(action.payload.tokenSymbol)) {
            state.tokens.splice(state.tokens.indexOf(action.payload.tokenSymbol), 1)
        }
    })
})
