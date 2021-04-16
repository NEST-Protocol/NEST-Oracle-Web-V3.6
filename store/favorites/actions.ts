import { createAction } from '@reduxjs/toolkit'

export const addFavoriteToken = createAction<{ tokenSymbol: string }>('favorites/addToken')
export const removeFavoriteToken = createAction<{ tokenSymbol: string }>('favorites/removeToken')
