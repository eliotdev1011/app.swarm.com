import { big } from '@swarm/core/shared/utils/helpers/big-helpers'
import Divider from '@swarm/ui/presentational/Divider'
import { FieldArray, FormikErrors, useField } from 'formik'
import { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Card, Heading, Loader, Text } from 'rimble-ui'

import AssetItem from './AssetItem'
import { CreatePoolContext } from './CreatePoolContext'
import { AMOUNT_EXCEEDS_BALANCE } from './consts'
import { NewPoolAsset } from './types'

const Assets = () => {
  const { t } = useTranslation('pools')
  const { errors, addToken, updateAsset } = useContext(CreatePoolContext)
  const [field, meta] = useField<NewPoolAsset[]>({ name: 'assets' })

  const assets = field.value

  const loading = assets.length === 0

  const error = typeof meta.error === 'string' ? meta.error : null

  const balanceTooBigError = useMemo(() => {
    const assetsError = errors.assets as unknown as FormikErrors<NewPoolAsset>[]
    if (
      Array.isArray(errors.assets) &&
      assetsError.find((assetError) => {
        return assetError?.amount === AMOUNT_EXCEEDS_BALANCE
      })
    ) {
      return AMOUNT_EXCEEDS_BALANCE
    }

    return undefined
  }, [errors.assets])

  const assetAmountTooSmallError = useMemo<string | undefined>(() => {
    const assetErrors = errors as {
      [key: string]: { amount?: string }
    }

    const getAssetIndexAmountError = (index: number): string | undefined => {
      return assetErrors[`assets[${index}]`]?.amount
    }

    const amountErrorIndex = assets.findIndex((asset, index) => {
      const assetIndexAmountError = getAssetIndexAmountError(index)
      return big(asset.amount).gt(0) && assetIndexAmountError !== undefined
    })

    if (amountErrorIndex >= 0) {
      return getAssetIndexAmountError(amountErrorIndex)
    }

    return undefined
  }, [assets, errors])

  const assetWeightNotInRangeError = useMemo<string | undefined>(() => {
    const assetErrors = errors as {
      [key: string]: { weight?: string }
    }

    const getAssetIndexWeightError = (index: number): string | undefined => {
      return assetErrors[`assets[${index}]`]?.weight
    }

    const weightErrorIndex = assets.findIndex((asset, index) => {
      const assetIndexWeightError = getAssetIndexWeightError(index)
      return big(asset.weight).gt(0) && assetIndexWeightError !== undefined
    })

    if (weightErrorIndex >= 0) {
      return getAssetIndexWeightError(weightErrorIndex)
    }

    return undefined
  }, [assets, errors])

  const handleAssetItemChange = useCallback(
    (index: number) => (newAsset: Omit<NewPoolAsset, 'decimals'>) =>
      updateAsset(index, newAsset),
    [updateAsset],
  )

  return (
    <Card
      p="20px"
      borderRadius={1}
      boxShadow={4}
      border="0"
      display="flex"
      flexDirection="column"
      width="100%"
      height="fit-content"
    >
      <Heading
        fontSize={3}
        lineHeight="20px"
        fontWeight={4}
        mb={2}
        mt={0}
        color="grey"
      >
        {t('createPool.assets.title')}
      </Heading>
      <Divider mt="16px" mb="0" />
      <FieldArray
        {...field}
        render={({ remove }) => (
          <>
            {loading ? (
              <Loader mx="auto" mt={3} />
            ) : (
              assets.map((item, index) => (
                <AssetItem
                  key={item.id}
                  index={index}
                  showRemoveButton={assets.length > 2}
                  onRemove={() => remove(index)}
                  onChange={handleAssetItemChange(index)}
                />
              ))
            )}
            <Text.span px={2} mt={3} color="danger">
              {error ||
                balanceTooBigError ||
                assetAmountTooSmallError ||
                assetWeightNotInRangeError}
            </Text.span>
            {assets.length < 5 && (
              <Button
                onClick={addToken}
                size="medium"
                px={3}
                width="fit-content"
                color="primary"
                icon="Add"
                mt={3}
                disabled={loading}
              >
                {t('createPool.assets.addToken')}
              </Button>
            )}
          </>
        )}
      />
    </Card>
  )
}

export default Assets
