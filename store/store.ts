import {configureStore, getDefaultMiddleware, ConfigureStoreOptions} from '@reduxjs/toolkit'
import { rootReducer} from './reducers'
import { save, load } from 'redux-localstorage-simple'
const PERSISTED_KEYS: string[] = ['favorites', 'language']
const isClient = typeof window !== 'undefined'
const options: ConfigureStoreOptions = {
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()]
}
if (isClient) {
    (options.middleware as any[]).push(save({ states: PERSISTED_KEYS }))
    options.preloadedState = load({ states: PERSISTED_KEYS })
}
export const store = configureStore(options)

export default store