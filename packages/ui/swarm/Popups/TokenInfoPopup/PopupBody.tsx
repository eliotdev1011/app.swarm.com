import { propEquals } from '@swarm/core/shared/utils/collection'
import { splitBy } from '@swarm/core/shared/utils/collection/splitBy'
import { AbstractAsset } from '@swarm/types/tokens'
import { KyaProperty } from '@swarm/types/tokens/invest'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader, Text } from 'rimble-ui'

import Collapsible from '@ui/presentational/Collapsible'
import Divider from '@ui/presentational/Divider'

import PopupDataBox from './PopupDataBox'
import PopupDataRow from './PopupDataRow'

interface PopupBodyProps {
  token: AbstractAsset
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kyaInformation?: any
}

interface Property extends KyaProperty {
  // eslint-disable-next-line camelcase
  display_type?: string
}

const PopupBody = ({ kyaInformation }: PopupBodyProps) => {
  const { t } = useTranslation(['popups'])

  const properties = kyaInformation?.properties
  const loading = kyaInformation === undefined

  const [extraEntries, documents] = useMemo(
    () =>
      properties && properties.length
        ? splitBy<Property>(
            properties,
            propEquals('display_type', 'document'),
            2,
          )
        : [[], []],
    [properties],
  )

  const hasKya = !!kyaInformation

  if (loading) {
    return (
      <PopupDataBox gap="2px">
        <Divider thickness={2} />
        <Loader size="30px" mx="auto" />
      </PopupDataBox>
    )
  }

  if (!hasKya) {
    return (
      <PopupDataBox>
        <Divider thickness={2} />
        <Text.p textAlign="center" color="grey" fontWeight="bold">
          {t('assetInfo.notAvailable')}
        </Text.p>
      </PopupDataBox>
    )
  }

  return (
    <>
      <PopupDataBox>
        <Collapsible
          title={t('assetInfo.kya')}
          dividerThickness={2}
          defaultExpanded={true}
        >
          <PopupDataBox>
            {kyaInformation?.description && (
              <PopupDataRow
                key="description"
                label={t('assetInfo.description')}
                value={kyaInformation.description as string}
              />
            )}
            {extraEntries.map((entry) => (
              <PopupDataRow
                key={entry.property_type}
                label={entry.property_type}
                value={entry.value}
              />
            ))}
          </PopupDataBox>
        </Collapsible>

        {!!documents.length && (
          <Collapsible title={t('assetInfo.documents')} mt={3}>
            <PopupDataBox>
              {documents.map((document) => (
                <PopupDataRow
                  key={document.property_type}
                  label={document.property_type}
                  value={document.value}
                  document
                  color="grey"
                />
              ))}
            </PopupDataBox>
          </Collapsible>
        )}
      </PopupDataBox>
    </>
  )
}

export default PopupBody
