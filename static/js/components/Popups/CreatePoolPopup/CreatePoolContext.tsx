import { useCpk } from '@swarm/core/contracts/cpk'
import useNativeTokens from '@swarm/core/hooks/data/useNativeTokens'
import useTransactionAlerts from '@swarm/core/hooks/i18n/useTransactionAlerts'
import { POLL_INTERVAL } from '@swarm/core/shared/consts'
import { DEFAULT_DECIMALS } from '@swarm/core/shared/consts/math'
import {
  excludeDOTCTokensFilter,
  getTokensFilter,
} from '@swarm/core/shared/subgraph'
import { mapBy, propNotIn } from '@swarm/core/shared/utils/collection'
import { big, safeDiv } from '@swarm/core/shared/utils/helpers/big-helpers'
import { cpkAllowancesLoading } from '@swarm/core/shared/utils/tokens/allowance'
import { balancesLoading } from '@swarm/core/shared/utils/tokens/balance'
import {
  injectContract,
  injectCpkAllowance,
  injectExchangeRate,
  injectTokenBalance,
  injectUsdBalance,
  useInjections,
} from '@swarm/core/shared/utils/tokens/injectors'
import {
  isSameEthereumAddress,
  useAccount,
  useReadyState,
} from '@swarm/core/web3'
import { ChildrenProps } from '@swarm/types'
import { ExtendedPoolToken } from '@swarm/types/tokens'
import { useSnackbar } from '@swarm/ui/swarm/Snackbar'
import { Formik, FormikErrors, useFormikContext } from 'formik'
import compact from 'lodash/compact'
import map from 'lodash/map'
import sumBy from 'lodash/sumBy'
import { createContext, useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'

import ActionManager from 'src/contracts/ActionManager'

import { DEFAULT_TOKEN_WEIGHT, newPoolInitialValues } from './consts'
import { deriveMaxAmounts, mergeTokenAssets } from './helpers'
import { FullCreatePoolAsset, NewPoolAsset, NewPoolSchema } from './types'
import { validate } from './validation'

import { useCreatePoolPopup } from '.'

export interface CreatePoolContextType {
  values: NewPoolSchema
  errors: FormikErrors<NewPoolSchema>
  nativeTokens: ExtendedPoolToken[]
  fullAssets: Map<string, FullCreatePoolAsset>
  dictionary: Map<string, ExtendedPoolToken>
  totalWeight: number
  addToken: () => void
  submit: () => Promise<void>
  loading: boolean
  updateAsset: (index: number, newAsset: Omit<NewPoolAsset, 'decimals'>) => void
}

export const CreatePoolContext = createContext<CreatePoolContextType>({
  values: newPoolInitialValues,
  errors: {},
  nativeTokens: [],
  fullAssets: new Map(),
  dictionary: new Map(),
  totalWeight: 0,
  addToken: () => {},
  submit: () => Promise.resolve(),
  loading: true,
  updateAsset: () => {},
})

interface Props extends ChildrenProps {
  isOpen: boolean
  isCreatingSmartPool: boolean
}

const CreatePoolManager = ({
  children,
  isOpen,
  isCreatingSmartPool,
}: Props) => {
  const account = useAccount()
  const cpk = useCpk()
  const ready = useReadyState()
  const history = useHistory()
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const { closeCreatePoolPopup } = useCreatePoolPopup()

  const { values, touched, errors, setFieldValue, resetForm, validateForm } =
    useFormikContext<NewPoolSchema>()

  const totalWeight = useMemo(
    () => sumBy(values.assets, (asset) => Number(asset.weight || 0)),
    [values.assets],
  )

  const { nativeTokens, loading } = useNativeTokens<ExtendedPoolToken>({
    skip: !ready || !isOpen,
    variables: {
      filter: getTokensFilter('Token', {
        and: [
          {
            ...excludeDOTCTokensFilter(),
          },
          {
            isLPT: false,
            paused: false,
          },
        ],
      }),
    },
    pollInterval: POLL_INTERVAL,
  })

  const fullTokens = useInjections<ExtendedPoolToken>(
    nativeTokens,
    useMemo(
      () => [
        injectTokenBalance(account),
        injectUsdBalance(account),
        injectTokenBalance(cpk?.address, 'cpkBalance'),
        injectCpkAllowance(account),
        injectContract(),
        injectExchangeRate(),
      ],
      [account, cpk?.address],
    ),
  )

  const dictionary: Map<string, ExtendedPoolToken> = useMemo(
    () => mapBy(fullTokens, 'id'),
    [fullTokens],
  )

  const assetTokens = useMemo(
    () =>
      compact(
        values.assets.map((asset) =>
          dictionary.get(asset.id),
        ) as ExtendedPoolToken[],
      ),
    [dictionary, values.assets],
  )

  const areAllowancesLoading = useMemo(
    () => cpkAllowancesLoading(assetTokens, account, cpk?.address),
    [assetTokens, account, cpk?.address],
  )

  const areBalancesLoading = useMemo(
    () => balancesLoading(assetTokens, account),
    [account, assetTokens],
  )

  const fullAssets: Map<string, FullCreatePoolAsset> = useMemo(() => {
    if (!values.assets.length) {
      return new Map()
    }

    const tokenAssets = mergeTokenAssets(values.assets, dictionary)

    return deriveMaxAmounts(tokenAssets)
  }, [dictionary, values.assets])

  // Expose the value to the form
  useEffect(() => {
    setFieldValue('isSmartPool', isCreatingSmartPool)
  }, [isCreatingSmartPool, setFieldValue])

  // Fill the initial values
  useEffect(() => {
    if (values.assets.length === 0 && fullTokens.length >= 2) {
      setFieldValue(
        'assets',
        fullTokens
          .slice(0, 2)
          .map(({ id, decimals }) => ({ id, decimals, amount: 0, weight: 1 })),
        false,
      )
    } else if (values.assets.length) {
      validateForm()
    }
  }, [fullTokens, setFieldValue, validateForm, values.assets.length])

  useEffect(() => {
    if (
      values.smartPool.rights.canChangeWeights ||
      values.smartPool.rights.canAddRemoveTokens
    ) {
      validateForm()
    }
  }, [
    values.smartPool.rights.canChangeWeights,
    values.smartPool.rights.canAddRemoveTokens,
    validateForm,
  ])

  // Set smart pool token name default value by joinin assets symbols with "-"
  useEffect(() => {
    if (
      fullTokens.length > 0 &&
      values.assets.length > 0 &&
      touched.smartPool?.tokenName !== true
    ) {
      setFieldValue(
        'smartPool.tokenName',
        values.assets
          .map((asset) => {
            const fullToken = fullTokens.find((token) => {
              return isSameEthereumAddress(token.id, asset.id)
            })

            if (fullToken === undefined) {
              return null
            }

            return fullToken.symbol
          })
          .filter((symbol) => {
            return symbol !== null
          })
          .join('-'),
        false,
      )
    }
  }, [fullTokens, values.assets, touched.smartPool, setFieldValue])

  const addToken = useCallback(() => {
    const firstRemainingToken = fullTokens.find(
      propNotIn('id', map(values.assets, 'id')),
    )

    if (firstRemainingToken) {
      setFieldValue(
        'assets',
        [
          ...values.assets,
          {
            id: firstRemainingToken.id,
            weight: DEFAULT_TOKEN_WEIGHT,
            amount: 0,
            decimals: firstRemainingToken.decimals,
          },
        ],
        false,
      )
    }
  }, [fullTokens, setFieldValue, values.assets])

  const createCorePool = useCallback(async () => {
    const fullAssetsValues = Array.from(fullAssets.values())
    const amounts = map(fullAssetsValues, 'amount')
    const weights = map(fullAssetsValues, 'weight')
    const poolName = `SM Pool: ${map(fullAssetsValues, 'symbol').join('-')}`

    try {
      const tx = await ActionManager.createCorePool(
        assetTokens,
        amounts,
        weights,
        values.swapFee,
        poolName,
      )

      await track(tx)

      resetForm()

      closeCreatePoolPopup()

      history.push('/pools/my-pools')
    } catch (e) {
      addError(e)
    }
  }, [
    fullAssets,
    assetTokens,
    values.swapFee,
    track,
    resetForm,
    history,
    addError,
    closeCreatePoolPopup,
  ])

  const createSmartPool = useCallback(async () => {
    const fullAssetsValues = Array.from(fullAssets.values())
    const amounts = map(fullAssetsValues, 'amount')
    const weights = map(fullAssetsValues, 'weight')

    const poolTokenName = `SM Smart Pool: ${values.smartPool.tokenName}`
    const poolTokenSymbol = values.smartPool.tokenSymbol
    const poolTokenInitialSupply = values.smartPool.initialSupply
    const poolRights = values.smartPool.rights

    const getPoolAddTokenTimeLockDuration = (): number => {
      if (poolRights.canAddRemoveTokens) {
        return values.smartPool.addTokenTimeLockDuration
      }

      return 0
    }

    const poolAddTokenTimeLockDuration = getPoolAddTokenTimeLockDuration()

    const getPoolMinimumGradualUpdateDuration = (): number => {
      if (poolRights.canChangeWeights) {
        return values.smartPool.minimumGradualUpdateDuration
      }

      // Ensure minimumGradualUpdateDuration >= addTokenTimeLockDuration on-chain constraint
      if (poolRights.canAddRemoveTokens) {
        return poolAddTokenTimeLockDuration
      }

      return 0
    }

    const poolMinimumGradualUpdateDuration =
      getPoolMinimumGradualUpdateDuration()

    try {
      const tx = await ActionManager.createSmartPool(
        assetTokens,
        amounts,
        weights,
        values.swapFee,
        poolTokenName,
        poolTokenSymbol,
        poolTokenInitialSupply,
        poolRights,
        poolMinimumGradualUpdateDuration,
        poolAddTokenTimeLockDuration,
      )

      await track(tx)

      resetForm()

      closeCreatePoolPopup()

      history.push('/pools/my-pools')
    } catch (e) {
      addError(e)
    }
  }, [
    fullAssets,
    values.smartPool,
    values.swapFee,
    assetTokens,
    track,
    resetForm,
    history,
    addError,
    closeCreatePoolPopup,
  ])

  const submit = useCallback(() => {
    if (isCreatingSmartPool) {
      return createSmartPool()
    }
    return createCorePool()
  }, [isCreatingSmartPool, createCorePool, createSmartPool])

  const updateAsset = useCallback(
    (index: number, newAsset: Omit<NewPoolAsset, 'decimals'>) => {
      const currentAsset = values.assets[index]

      if (newAsset.amount === 'Infinity') {
        setFieldValue(
          'assets',
          values.assets.map((asset) => {
            const assetToken = fullAssets.get(asset.id)

            return {
              ...asset,
              decimals: assetToken?.decimals ?? DEFAULT_DECIMALS,
              amount: assetToken?.maxAmount ?? '0',
            }
          }),
        )
      } else if (
        currentAsset.amount !== newAsset.amount ||
        currentAsset.weight !== newAsset.weight ||
        !isSameEthereumAddress(currentAsset.id, newAsset.id)
      ) {
        const baseAsset = isSameEthereumAddress(currentAsset.id, newAsset.id)
          ? newAsset
          : currentAsset

        const baseUsdAmount = safeDiv(
          big(baseAsset.amount).times(
            fullAssets.get(baseAsset.id)?.exchangeRate || 0,
          ),
          baseAsset.weight,
        )

        const newAssets = values.assets.map((asset, idx) => {
          const realAsset = idx === index ? newAsset : asset
          const assetToken = dictionary.get(realAsset.id)

          return {
            ...realAsset,
            decimals: assetToken?.decimals || DEFAULT_DECIMALS,
            amount: safeDiv(
              baseUsdAmount.times(Number(realAsset.weight) || 0),
              assetToken?.exchangeRate,
            ).toString(),
          }
        })

        setFieldValue('assets', newAssets)
      }
    },
    [dictionary, fullAssets, setFieldValue, values.assets],
  )

  const value = useMemo(
    () => ({
      nativeTokens: fullTokens,
      fullAssets,
      dictionary,
      totalWeight,
      addToken,
      values,
      errors,
      submit,
      loading: loading || areAllowancesLoading || areBalancesLoading,
      updateAsset,
    }),
    [
      addToken,
      areAllowancesLoading,
      areBalancesLoading,
      dictionary,
      errors,
      fullTokens,
      fullAssets,
      loading,
      submit,
      totalWeight,
      updateAsset,
      values,
    ],
  )

  return (
    <CreatePoolContext.Provider value={value}>
      {children}
    </CreatePoolContext.Provider>
  )
}

export const CreatePoolContextProvider = ({
  children,
  isOpen,
  isCreatingSmartPool,
}: Props) => {
  return (
    <Formik
      initialValues={newPoolInitialValues}
      onSubmit={() => {}}
      validate={validate}
    >
      <CreatePoolManager
        isOpen={isOpen}
        isCreatingSmartPool={isCreatingSmartPool}
      >
        {children}
      </CreatePoolManager>
    </Formik>
  )
}
