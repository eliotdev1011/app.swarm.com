import { useExchangeRateOf } from '@swarm/core/observables/exchangeRateOf'
import { useTokenBalanceOf } from '@swarm/core/observables/tokenBalanceOf'
import { propNotIn } from '@swarm/core/shared/utils/collection/filters'
import { prettifyBalance } from '@swarm/core/shared/utils/formatting'
import { useAccount } from '@swarm/core/web3'
import Balance from '@swarm/ui/swarm/Balance'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import TokenSelect from '@swarm/ui/swarm/TokenSelect'
import { useField } from 'formik'
import map from 'lodash/map'
import omit from 'lodash/omit'
import { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'rimble-ui'

import { CreatePoolContext } from './CreatePoolContext'
import CustomInput from './CustomInput'
import CustomMaxInput from './CustomMaxInput'
import { AssetItemContainer, AssetItemGrid, RemoveIcon } from './components'
import { AMOUNT_EXCEEDS_BALANCE } from './consts'
import { NewPoolAsset } from './types'

interface AssetItemProps {
  showRemoveButton: boolean
  index: number
  onRemove: () => void
  onChange: (newAsset: Omit<NewPoolAsset, 'decimals'>) => void
}

const AssetItem = ({
  showRemoveButton = false,
  index,
  onRemove,
  onChange,
}: AssetItemProps) => {
  const { t } = useTranslation(['pools', 'errors'])
  const account = useAccount()

  const [idField] = useField<string>({
    name: `assets.${index}.id`,
  })

  const balance = useTokenBalanceOf(account, idField.value)
  const exchangeRate = useExchangeRateOf(idField.value)

  const { values, nativeTokens, dictionary, totalWeight, fullAssets } =
    useContext(CreatePoolContext)

  const [weightField, weightMeta] = useField<string>({
    name: `assets.${index}.weight`,
  })
  const [amountField, amountMeta, amountHelper] = useField<string>({
    name: `assets.${index}.amount`,
    validate: (value) =>
      balance && value && balance?.lt(value ?? 0)
        ? AMOUNT_EXCEEDS_BALANCE
        : undefined,
  })

  const weightPercentage = useMemo(
    () =>
      100 * (totalWeight ? (Number(weightField.value) ?? 0) / totalWeight : 0),
    [totalWeight, weightField.value],
  )

  const totalValue = useMemo(
    () => (exchangeRate ?? 0) * (Number(amountField.value) ?? 0),
    [amountField.value, exchangeRate],
  )

  const tokenOptions = useMemo(
    () =>
      nativeTokens
        .filter(propNotIn('id', map(values.assets, 'id')))
        .map(({ id, symbol }) => ({
          value: id,
          label: symbol.toLocaleUpperCase(),
        })),
    [nativeTokens, values.assets],
  )

  const selectedOption = useMemo(() => {
    const native = dictionary.get(idField.value)

    if (native) {
      return {
        id: idField.value,
        value: native.name,
        label: native.symbol.toLocaleUpperCase(),
      }
    }

    return undefined
  }, [dictionary, idField.value])

  const onAmountChangeCallback = useCallback(
    (amount: number) => {
      amountHelper.setTouched(true)
      onChange?.({
        id: idField.value,
        amount: amount.toString(),
        weight: weightField.value,
      })
    },
    [amountHelper, idField.value, onChange, weightField.value],
  )

  const onWeightChangeCallback = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const weight = e.target.value

      onChange?.({
        id: idField.value,
        amount: amountField.value,
        weight,
      })
    },
    [amountField.value, idField.value, onChange],
  )

  const onIdChangeCallback = useCallback(
    (e: { value: string; label: string } | null) => {
      if (e) {
        onChange?.({
          id: e.value,
          amount: amountField.value,
          weight: weightField.value,
        })
      }
    },
    [amountField.value, onChange, weightField.value],
  )

  return (
    <AssetItemContainer>
      <TokenSelect
        options={tokenOptions}
        value={selectedOption}
        onChange={onIdChangeCallback}
      />
      {showRemoveButton && (
        <RemoveIcon onClick={onRemove}>
          <SvgIcon name="Close" />
        </RemoveIcon>
      )}
      <AssetItemGrid>
        <Box className="value-item" mx={1} overflow="hidden">
          <Text color="grey" fontWeight={4} mb={2}>
            {t('createPool.assets.myBalance')}
          </Text>
          <Text.span
            color="black"
            display="inline-block"
            overflow="hidden"
            width="100%"
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={balance}
          >
            <Balance balance={balance} />
          </Text.span>
        </Box>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={1}>
            {t('createPool.assets.weight')}
          </Text>
          <CustomInput
            {...weightField}
            height="36px"
            p="0 8px"
            width="90%"
            fontWeight={5}
            boxShadow="none"
            bg="white"
            currentValue={weightField.value}
            onChange={onWeightChangeCallback}
            error={weightMeta.touched && weightMeta.error}
          />
        </div>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={2}>
            {t('createPool.assets.percent')}
          </Text>
          <Text color="black" title={weightPercentage}>
            {prettifyBalance(weightPercentage)}%
          </Text>
        </div>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={1}>
            {t('createPool.assets.amount')}
          </Text>
          <CustomMaxInput
            width="90%"
            fontWeight={5}
            boxShadow="none"
            value={Number(amountField.value)}
            onChange={onAmountChangeCallback}
            error={amountMeta.touched && amountMeta.error}
            max={fullAssets.get(idField.value)?.maxAmount ?? 0}
            inputProps={omit(amountField, ['onChange'])}
            showMax
          />
        </div>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={2}>
            {t('createPool.assets.price')}
          </Text>
          <Text.span color="black" title={exchangeRate}>
            ${exchangeRate ? prettifyBalance(exchangeRate) : '--'}
          </Text.span>
        </div>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={2}>
            {t('createPool.assets.totalValue')}
          </Text>
          <Text.span color="black" title={totalValue}>
            ${prettifyBalance(totalValue)}
          </Text.span>
        </div>
      </AssetItemGrid>
    </AssetItemContainer>
  )
}

export default AssetItem
