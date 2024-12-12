// BEWARE: this is the list of routes that are allowed
// whenever adding a new route, make sure to add it to this list!

const ROUTES = {
  HOMEPAGE: '/v1/',
  VERIFY_EMAIL: '/v1/verify-email',
  ONBOARDING: '/v1/onboarding',
  INVEST: '/v1/invest',
  INVEST_CATEGORY: '/v1/invest/:category',
  SWAP: '/v1/swap',
  DOTC: '/v1/dotc',
  DOTC_CATEGORY: '/v1/dotc/:category?',
  POOLS: '/v1/pools',
  POOLS_CATEGORY: '/v1/pools/:category?',
  POOL_DETAILS: '/v1/pool/:address',
  LENDING_AND_BORROWING: '/v1/lend-borrow',
  WALLETS: '/v1/wallets',
  PASSPORT: '/v1/passport',
  TEST_FAUCET: '/v1/faucet',
  VOUCHERS: '/v1/vouchers',
  VOUCHERS_PAYMENT: '/v1/vouchers/payment',
  VOUCHERS_LIST: '/v1/ouchers/list',
  STAKING: '/v1/staking',
  STAKING_CATEGORY: '/v1/staking/:category',
  // DOTC_V2_CATEGORY: '/v2/dotc/*',
  // DOTC_V2: '/v2/dotc',
}

export { ROUTES }
