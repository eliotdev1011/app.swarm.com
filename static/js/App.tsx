import { ApolloProvider } from '@apollo/client'
import {
  createTheme,
  ThemeProvider as MaterialUIThemeProvider,
} from '@material-ui/core/styles'
import config from '@swarm/core/config'
import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import client from '@swarm/core/services/apollo'
import { RequestCacheProvider } from '@swarm/core/services/cache/useRequestCache'
import { AppContextProvider } from '@swarm/core/state/AppContext'
import { FeatureFlagsContextProvider } from '@swarm/core/state/FeatureFlagsContext'
import { FireworksProvider } from '@swarm/ui/presentational/Fireworks'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import Homepage from '@swarm/ui/swarm/Pages/Homepage'
import { SnackbarProvider } from '@swarm/ui/swarm/Snackbar'
import theme from '@swarm/ui/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Redirect, Route, BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components/macro'
import { QueryParamProvider } from 'use-query-params'

import { AffiliateProgram } from 'src/components/AffiliateProgram'
import EmailVerificationLandingPage from 'src/components/Onboarding/EmailVerificationLandingPage'
import { CreatePoolPopupProvider } from 'src/components/Popups/CreatePoolPopup'
import LendBorrowPage from 'src/pages/LendBorrowPage'
import Onboarding from 'src/pages/Onboarding'
import Passport from 'src/pages/Passport'
import Pools from 'src/pages/Pools'
import SinglePool from 'src/pages/SinglePool'
import Swap from 'src/pages/Swap'
import TestnetFaucet from 'src/pages/TestnetFaucet'
import Vouchers from 'src/pages/Vouchers'
import WalletsPage from 'src/pages/Wallets'

import DotcV2IframePage from './pages/DotcV2IframePage'
import SwarmXIframePage from './pages/SwarmXIframePage'
import { ROUTES } from './routes'

import './config-overrides'

const { isProduction } = config

const queryClient = new QueryClient()

function App() {
  return (
    <AppContextProvider>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          <RequestCacheProvider>
            <MaterialUIThemeProvider
              theme={createTheme({
                ...(theme as Record<string, unknown>),
                breakpoints: {
                  values: {
                    xs: 0,
                    sm: 640,
                    md: 832,
                    lg: 1024,
                    xl: 1920,
                  },
                },
              })}
            >
              <StyledComponentsThemeProvider theme={theme}>
                <SnackbarProvider>
                  <FireworksProvider>
                    <Router>
                      <QueryParamProvider ReactRouterRoute={Route}>
                        <AffiliateProgram>
                          <FeatureFlagsContextProvider>
                            <Route
                              exact
                              path={ROUTES.HOMEPAGE}
                              component={Homepage}
                            />
                            <Route
                              exact
                              path={ROUTES.VERIFY_EMAIL}
                              component={EmailVerificationLandingPage}
                            />
                            <Route
                              exact
                              path={ROUTES.ONBOARDING}
                              component={Onboarding}
                            />
                            {/* <Route
                              exact
                              path={[ROUTES.DOTC_V2]}
                              component={() => <Redirect to="/v2/dotc/" />}
                            />
                            <Route
                              exact
                              path={[ROUTES.DOTC_V2_CATEGORY]}
                              component={() => <DotcV2IframePage />}
                            /> */}
                            <Route
                              exact
                              path={[ROUTES.INVEST, ROUTES.INVEST_CATEGORY]}
                              component={() => <SwarmXIframePage />}
                            />
                            <FlaggedFeature
                              name={FlaggedFeatureName.swapService}
                              fallback={
                                <Route
                                  exact
                                  path={ROUTES.SWAP}
                                  component={() => (
                                    <Redirect to={ROUTES.DOTC} />
                                  )}
                                />
                              }
                            >
                              <Route
                                exact
                                path={ROUTES.SWAP}
                                component={Swap}
                              />
                            </FlaggedFeature>
                            <Route
                              exact
                              path={[ROUTES.DOTC, ROUTES.DOTC_CATEGORY]}
                              component={() => <SwarmXIframePage />}
                            />
                            <CreatePoolPopupProvider>
                              <Route
                                exact
                                path={[ROUTES.POOLS, ROUTES.POOLS_CATEGORY]}
                                component={Pools}
                              />
                              <Route
                                exact
                                path={ROUTES.POOL_DETAILS}
                                component={SinglePool}
                              />
                            </CreatePoolPopupProvider>
                            <FlaggedFeature
                              name={FlaggedFeatureName.lendBorrowPage}
                            >
                              <Route
                                exact
                                path={ROUTES.LENDING_AND_BORROWING}
                                component={LendBorrowPage}
                              />
                            </FlaggedFeature>
                            <Route
                              exact
                              path={ROUTES.WALLETS}
                              component={WalletsPage}
                            />
                            <Route
                              exact
                              path={ROUTES.PASSPORT}
                              component={Passport}
                            />
                            {!isProduction() && (
                              <Route
                                exact
                                path={ROUTES.TEST_FAUCET}
                                component={TestnetFaucet}
                              />
                            )}
                            <Route
                              path={ROUTES.VOUCHERS}
                              component={Vouchers}
                            />
                            {!window.location.pathname.startsWith('/v1') && (
                              <Route path="*">
                                <DotcV2IframePage />
                              </Route>
                            )}
                          </FeatureFlagsContextProvider>
                        </AffiliateProgram>
                      </QueryParamProvider>
                    </Router>
                  </FireworksProvider>
                </SnackbarProvider>
              </StyledComponentsThemeProvider>
            </MaterialUIThemeProvider>
          </RequestCacheProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </AppContextProvider>
  )
}

export default App
