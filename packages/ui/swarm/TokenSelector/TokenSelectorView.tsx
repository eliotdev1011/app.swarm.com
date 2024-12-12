import { isNFT } from '@swarm/core/shared/utils/tokens/filters'
import { useAccount } from '@swarm/core/web3'
import { TokenSelectorAsset } from '@swarm/types/tokens'
import { useTranslation } from 'react-i18next'
import { Button, Loader, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import Label from '@ui/presentational/Form/Label'

import NftBalance from '../NftBalance'
import TokenBalance from '../TokenBalance'
import TokenIcon from '../TokenIcon'

import { TokenSelectorViewProps } from './types'

export const TokenSelectorButton = styled(Button.Outline)`
  width: 100%;
  height: 36px;
  color: ${({ theme }) => theme.colors.black};

  .button-text {
    align-items: center;
  }

  @media (min-width: ${({ theme }) => theme?.breakpoints[0]}) {
    height: 48px;
  }

  ${({ readonly }) =>
    readonly &&
    `
    opacity: 0.92;

    span {
      opacity: 0.5;
    }

    &:hover, &:active, &:focus {
      border-color: #999;
      cursor: default;
      box-shadow: none;
      
      &::before {
        opacity: 0; 
      }
    }
  `}
`

const TokenSelectorView = <T extends TokenSelectorAsset = TokenSelectorAsset>({
  selected,
  loading = false,
  emptyValue,
  readonly = false,
  onModalOpen,
}: TokenSelectorViewProps<T>) => {
  const { t } = useTranslation('swap')
  const account = useAccount()

  const renderBalance = () => {
    if (selected && isNFT(selected.type)) {
      return selected.address && selected.tokenId ? (
        <NftBalance
          contractAddress={selected.address}
          tokenId={selected.tokenId}
          account={account}
        />
      ) : null
    }

    return (
      <TokenBalance tokenAddress={selected?.id} account={account} base={4} />
    )
  }

  return (
    <>
      <Label right>
        {t('assets.balance')}
        <br />
        {renderBalance()}
      </Label>
      <TokenSelectorButton onClick={onModalOpen} readonly={readonly}>
        {loading && <Loader m="auto" />}
        {!loading && selected && (
          <>
            <TokenIcon
              mr={3}
              symbol={selected.symbol}
              name={selected.name}
              maxWidth="24px"
              width="24px"
              height="24px"
              logo={selected?.logo}
            />
            <Text.span>
              {selected.symbol?.toLocaleUpperCase() || '--'}
            </Text.span>
          </>
        )}
        {!loading && !selected && emptyValue}
      </TokenSelectorButton>
    </>
  )
}

export default TokenSelectorView
