const yotiEnvNames = Object.freeze([
  'REACT_APP_YOTI_STATUS_URL',
  'REACT_APP_YOTI_SCENARIO_ID',
  'REACT_APP_VOUCHERS_YOTI_SCENARIO_ID',
  'REACT_APP_YOTI_CLIENT_SDK_ID',
])

const edgeTagEnvNames = Object.freeze(['REACT_APP_EDGETAG_EDGE_URL'])

const moonpayWidgetEnvNames = Object.freeze([
  'REACT_APP_MOONPAY_WIDGET_API_KEY',
  'REACT_APP_MOONPAY_WIDGET_BASE_URL',
])

export const envNames = Object.freeze([
  'REACT_APP_INFURA_PROJECT_ID',
  'REACT_APP_API_URL',

  ...moonpayWidgetEnvNames,
  ...edgeTagEnvNames,
  ...yotiEnvNames,

  'REACT_APP_DEFAULT_CHAIN_ID',

  'REACT_APP_WALLET_CONNECT_PROJECT_ID',
])
