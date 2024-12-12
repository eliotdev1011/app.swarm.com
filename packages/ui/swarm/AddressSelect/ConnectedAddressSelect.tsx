import { arrayWrap } from '@swarm/core/shared/utils'
import { propEquals } from '@swarm/core/shared/utils/collection'
import { useUserAccounts } from '@swarm/core/state/hooks/user'
import { isSameEthereumAddress, useAccount } from '@swarm/core/web3'
import compact from 'lodash/compact'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Props as ReactSelectProps } from 'react-select'

import AddressSelect, { AddressSelectOption } from '.'

interface ConnectedAddressSelectProps extends ReactSelectProps {
  selectedAddress: string | null
  onChange?: (selection: AddressSelectOption | null) => void
  extraOptions?: AddressSelectOption[]
}

const ConnectedAddressSelect = ({
  selectedAddress,
  onChange,
  ...props
}: ConnectedAddressSelectProps) => {
  const { t } = useTranslation(['invest', 'popups', 'common'])
  const account = useAccount()
  const accounts = useUserAccounts()

  const options = useMemo<AddressSelectOption[]>(() => {
    const uniqAddresses = uniq([
      ...arrayWrap(account),
      ...map(accounts || [], 'address'),
    ])

    return [
      ...compact(
        uniqAddresses.map((address) => {
          const existingAddress =
            accounts.length === 0
              ? {
                  label: '',
                  address: account,
                }
              : accounts.find(propEquals('address', address))

          if (existingAddress?.address) {
            return {
              value: existingAddress.address,
              label: existingAddress.label ?? '',
              connected: !!account && isSameEthereumAddress(account, address),
            }
          }

          return undefined
        }),
      ),
    ]
  }, [account, accounts])

  const selectedOption = useMemo(
    () =>
      selectedAddress
        ? {
            value: selectedAddress,
            label:
              options.find((option) =>
                isSameEthereumAddress(option.value, selectedAddress),
              )?.label || '',
          }
        : null,
    [options, selectedAddress],
  )

  return (
    <AddressSelect
      {...props}
      label={t('invest:redeemModal.selectAddress')}
      options={options}
      onChange={onChange}
      value={selectedOption}
    />
  )
}

export default ConnectedAddressSelect
