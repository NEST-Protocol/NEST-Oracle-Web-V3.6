import { createReducer } from '@reduxjs/toolkit'
import { changeLanguage } from './actions'
export const initialState = {
    language: ''
}
export default createReducer(initialState, builder =>
{
    builder
        .addCase(changeLanguage, (state, action) => {
        if (state.language !== action.payload.language) {
            state.language = action.payload.language
        }})
})
