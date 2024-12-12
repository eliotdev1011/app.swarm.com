import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import alertsEN from './locales/en/alerts.json'
import buyEN from './locales/en/buy.json'
import commonEN from './locales/en/common.json'
import errorsEN from './locales/en/errors.json'
import investEN from './locales/en/invest.json'
import lendBorrowEN from './locales/en/lend-borrow.json'
import liquidityModalsEN from './locales/en/liquidity-modals.json'
import modalsEN from './locales/en/modals.json'
import navigationEN from './locales/en/navigation.json'
import onboardingEN from './locales/en/onboarding.json'
import otcEN from './locales/en/otc.json'
import passportEN from './locales/en/passport.json'
import poolDetailsEN from './locales/en/poolDetails.json'
import poolsEN from './locales/en/pools.json'
import popupsEN from './locales/en/popups.json'
import stakingEN from './locales/en/staking.json'
import swapEN from './locales/en/swap.json'
import transactionEN from './locales/en/transaction.json'
import vouchersEN from './locales/en/vouchers.json'
import walletsEN from './locales/en/wallets.json'

const resources = {
  en: {
    onboarding: onboardingEN,
    modals: modalsEN,
    navigation: navigationEN,
    invest: investEN,
    swap: swapEN,
    passport: passportEN,
    pools: poolsEN,
    poolDetails: poolDetailsEN,
    popups: popupsEN,
    lendBorrow: lendBorrowEN,
    wallets: walletsEN,
    liquidityModals: liquidityModalsEN,
    transaction: transactionEN,
    alerts: alertsEN,
    vouchers: vouchersEN,
    errors: errorsEN,
    common: commonEN,
    otc: otcEN,
    staking: stakingEN,
    buy: buyEN,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
