import fromProviderEvent from '@core/observables/fromProviderEvent'

export const onEveryBlock$ = fromProviderEvent<number>('block')
