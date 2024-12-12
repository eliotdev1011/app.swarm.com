import { AppState, ContextType, DispatchWithThunk } from '@swarm/types/state'
import { createContext, useContext, useEffect, useMemo, useRef } from 'react'

import useAsyncReducer from '@core/hooks/async/useAsyncReducer'
import useInitEdgetag from '@core/hooks/useInitEdgetag'
import {
  KycProvider,
  KycStatus,
  Tier,
  VerificationStatus,
} from '@core/shared/enums'
import { init } from '@core/state/actions/app'
import appReducer from '@core/state/reducers'
import store from '@core/state/store'
import { useAccount } from '@core/web3'

export const InitialState: AppState = {
  initiated: false,
  user: {
    verificationStatus: VerificationStatus.notVerified,
    kycStatus: KycStatus.notStarted,
    kycProvider: KycProvider.notVerified,
    tier: Tier.tier0,
    email: '',
    userHash: '',
    emailVerified: false,
    error: null,
    id: null,
    accounts: [],
    usdBalance: {
      nativeTokens: 0,
      poolTokens: 0,
    },
    docScanSessionWaiting: 0,
    docScanOutcomeReason: '',
  },
  ui: {
    alerts: [],
  },
  errors: {
    error: null,
  },
}

export const AppContext = createContext<ContextType<AppState>>({
  appState: InitialState,
  dispatch: () => {},
})

interface AppContextProviderProps {
  children: React.ReactNode
}

export function AppContextProvider(props: AppContextProviderProps) {
  useInitEdgetag()
  const { children } = props

  const [appState, dispatch] = useAsyncReducer<AppState>(
    appReducer,
    InitialState,
  )

  const initiatedRef = useRef(false)

  if (!store.isReady) {
    store.isReady = true
    store.dispatch = (value) => dispatch(value)
    Object.freeze(store)
  }

  const account = useAccount()

  useEffect(() => {
    if (!initiatedRef.current) {
      dispatch(init())

      initiatedRef.current = true
    }
  }, [account, appState.user.id, dispatch])

  const value = useMemo(() => {
    return { appState, dispatch }
  }, [appState, dispatch])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function connect<
  T,
  S extends Record<string, unknown> = Record<string, unknown>,
  D extends Record<string, unknown> = Record<string, unknown>
>(
  mapStateToProps: null | ((state: AppState, props: T) => S),
  mapDispatchToProps?: (dispatch: DispatchWithThunk<AppState>) => D | undefined,
) {
  // eslint-disable-next-line
  return (WrappedComponent: React.FC<any>) =>
    function ConnectedComponent(props: T) {
      const { appState: state, dispatch } = useContext(AppContext)

      const mappedState = useMemo(() => {
        if (mapStateToProps === null) {
          return {}
        }
        return mapStateToProps(state, props)
      }, [state, props])

      const mappedDispatch = useMemo(() => {
        if (mapDispatchToProps === undefined) {
          return {}
        }
        return mapDispatchToProps(dispatch)
      }, [dispatch])

      const allProps = useMemo(() => {
        return {
          ...props,
          ...mappedState,
          ...mappedDispatch,
        }
      }, [props, mappedState, mappedDispatch])

      return <WrappedComponent {...allProps} />
    }
}
