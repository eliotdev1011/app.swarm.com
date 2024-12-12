import { Action, AppState, ErrorState, Reducer } from '@swarm/types/state'

import { InitialState } from '@core/state/AppContext'
import {
  DISCONNECTED,
  ERROR_OCCURRED,
  INITIATED,
} from '@core/state/actions/action-types'

import uiReducer from './uiReducer'
import userReducer from './userReducer'

export const combineReducers = (
  reducers: { [k in keyof AppState]: Reducer<AppState[k]> },
): Reducer<AppState> => (state: AppState, action: Action) => {
  const newState = (Object.keys(reducers) as Array<keyof AppState>).reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: reducers[key]?.(state[key] as never, action),
    }),
    {} as AppState,
  )

  return newState
}

const errorReducer: Reducer<ErrorState> = (
  state: ErrorState,
  action: Action,
) => {
  switch (action.type) {
    case ERROR_OCCURRED:
      return {
        error: action.payload?.error,
      }
    case DISCONNECTED:
      return { ...InitialState.errors }
    default:
      return state
  }
}

const initiatedReducer: Reducer<boolean> = (state: boolean, action: Action) => {
  switch (action.type) {
    case INITIATED:
      return true
    default:
      return state
  }
}

export default combineReducers({
  initiated: initiatedReducer,
  ui: uiReducer,
  user: userReducer,
  errors: errorReducer,
})
