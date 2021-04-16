import { createAction } from '@reduxjs/toolkit'

export const changeLanguage = createAction<{ language: string }>('language/change')
