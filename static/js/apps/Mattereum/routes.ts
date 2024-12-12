// BEWARE: this is the list of routes that are allowed
// whenever adding a new route, make sure to add it to this list!

const ROUTES = {
  HOMEPAGE: '/',
  VERIFY_EMAIL: '/verify-email',
  ONBOARDING: '/onboarding',
  SWAP: '/swap',
  DOTC: '/dotc',
  DOTC_CATEGORY: '/dotc/:category?',
  POOLS: '/pools/:category?',
  POOL_DETAILS: '/pool/:address',
  PASSPORT: '/passport',
  BUY: '/buy',
  BUY_CATEGORY: '/buy/:category',
}

export { ROUTES }
