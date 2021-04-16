import { combineReducers } from 'redux'
import favorites from './favorites/reducer'
import language from './language/reducer'

export const rootReducer = combineReducers({
    favorites, language
})

export type RootState = ReturnType<typeof rootReducer>;
// export default rootReducer;