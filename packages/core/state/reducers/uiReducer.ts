import { Action, Reducer, UI } from '@swarm/types/state'

import { InitialState } from '@core/state/AppContext'
import {
  ALERT_ADDED,
  ALERT_DISMISSED,
  ALERT_REMOVED,
  ALERTS_DISMISSED,
  ALERTS_REMOVED,
  DISCONNECTED,
} from '@core/state/actions/action-types'

const uiReducer: Reducer<UI> = (state: UI, action: Action) => {
  switch (action.type) {
    case ALERT_ADDED:
      return {
        ...state,
        alerts: [
          ...state.alerts,
          action.payload && { ...action.payload.alert },
        ],
      }
    case ALERT_DISMISSED: {
      const targetIndex = state.alerts.findIndex(
        (alert) => alert.key === action.payload?.key,
      )

      if (targetIndex !== -1) {
        return {
          ...state,
          alerts: [
            ...state.alerts.slice(0, targetIndex),
            { ...state.alerts[targetIndex], closing: true },
            ...state.alerts.slice(targetIndex + 1),
          ],
        }
      }

      return state
    }
    case ALERT_REMOVED: {
      const targetIndex = state.alerts.findIndex(
        (alert) => alert.key === action.payload?.key,
      )

      if (targetIndex !== -1) {
        return {
          ...state,
          alerts: [
            ...state.alerts.slice(0, targetIndex),
            ...state.alerts.slice(targetIndex + 1),
          ],
        }
      }
      return state
    }
    case ALERTS_DISMISSED: {
      return {
        ...state,
        alerts: state.alerts.map((alert) => ({ ...alert, closing: true })),
      }
    }
    case ALERTS_REMOVED: {
      return { ...state, alerts: [] }
    }
    case DISCONNECTED:
      return { ...InitialState.ui, alerts: [...state.alerts] }
    default:
      return state
  }
}

export default uiReducer
