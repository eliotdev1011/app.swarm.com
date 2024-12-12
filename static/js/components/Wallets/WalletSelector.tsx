import { arrayWrap } from '@swarm/core/shared/utils'
import { propEquals } from '@swarm/core/shared/utils/collection/filters'
import { connect } from '@swarm/core/state/AppContext'
import {
  isSameEthereumAddress,
  unifyAddress,
  useAccount,
} from '@swarm/core/web3'
import { AppState } from '@swarm/types/state'
import UserStateAccount from '@swarm/types/state/user-account'
import AddressSelect, {
  AddressSelectOption,
} from '@swarm/ui/swarm/AddressSelect'
import Balance from '@swarm/ui/swarm/Balance'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Box, Flex, Heading, Text } from 'rimble-ui'

import LowBalancesSwitch from './LowBalancesSwitch'
import { useWalletsContext } from './WalletsContext'

interface WalletSelectorStateProps extends Record<string, unknown> {
  accounts: UserStateAccount[]
}

const WalletSelector = ({ accounts }: WalletSelectorStateProps) => {
  const account = useAccount()
  const { t } = useTranslation(['wallets'])
  const history = useHistory<{ preselectedAddress?: string }>()
  const {
    selectedAccount: selected,
    setSelectedAccount: onChange,
    userUsdBalance,
  } = useWalletsContext()

  const options = useMemo<AddressSelectOption[]>(() => {
    const uniqAddresses = uniq([
      ...arrayWrap(account),
      ...map(accounts || [], 'address'),
    ])

    return [
      ...uniqAddresses.map((address) => ({
        value: unifyAddress(address),
        label: accounts.find(propEquals('address', address))?.label || '',
        connected: !!account && isSameEthereumAddress(account, address),
      })),
      {
        value: '',
        label: t('walletSelector.addAddress'),
      },
    ]
  }, [account, accounts, t])

  const handleSelectChange = useCallback(
    (selection: AddressSelectOption | null) => {
      if (selection) {
        if (selection.value === '') {
          history.push('/passport#my-addresses')
        }
        onChange?.(unifyAddress(selection.value))
      } else {
        onChange?.(undefined)
      }
    },
    [history, onChange],
  )

  useEffect(() => {
    const { preselectedAddress } = history.location.state || {}

    if (preselectedAddress) {
      const preselectedOption =
        options.find(propEquals('value', unifyAddress(preselectedAddress))) ||
        null
      handleSelectChange(preselectedOption)
    } else {
      const activeOption = options.find(({ connected }) => !!connected) || null
      handleSelectChange(activeOption)
    }
  }, [options, handleSelectChange, history.location.state])

  return (
    <Flex
      width="100%"
      alignItems="flex-start"
      flexDirection={['column', 'row']}
      justifyContent="space-between"
      mb="24px"
    >
      <Box flexGrow="1" maxWidth={['100%', '532px']} width="100%">
        <Heading
          as="h4"
          fontSize={[1, 2]}
          lineHeight="copy"
          fontWeight={4}
          m={0}
          color="near-black"
        >
          {t('walletSelector.selectedAddress')}
        </Heading>
        <Box mt={2}>
          <AddressSelect
            options={options}
            onChange={handleSelectChange}
            value={
              selected
                ? {
                    value: unifyAddress(selected),
                    label:
                      options.find(propEquals('value', unifyAddress(selected)))
                        ?.label || '',
                  }
                : null
            }
          />
        </Box>
      </Box>
      <Box mt={[3, 0]} ml={2}>
        <Heading
          as="h4"
          fontSize={[1, 2]}
          lineHeight="copy"
          fontWeight={4}
          m={0}
          color="near-black"
          textAlign={['left', 'right']}
        >
          {t('walletSelector.walletTotalValue')}
        </Heading>
        <Flex alignItems="center" mt={2}>
          <LowBalancesSwitch />
          <Text
            fontWeight={4}
            color="near-black"
            fontSize={4}
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Balance
              balance={userUsdBalance?.totalUsdBalance}
              base={0}
              symbol="USD"
            />
          </Text>
        </Flex>
      </Box>
    </Flex>
  )
}

const mapStateToProps = ({ user: { accounts, id } }: AppState) => ({
  accounts,
  userId: id,
})

export default connect<Record<string, never>, WalletSelectorStateProps>(
  mapStateToProps,
)(WalletSelector)
