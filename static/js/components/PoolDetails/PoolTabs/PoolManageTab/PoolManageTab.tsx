import useDeepTranslation from '@swarm/core/hooks/i18n/useDeepTranslation'
import { normalize } from '@swarm/core/shared/utils/helpers/big-helpers'
import { isEnabled } from '@swarm/core/shared/utils/tokens/allowance'
import { PoolExpanded } from '@swarm/types'
import Grid from '@swarm/ui/presentational/Grid'
import ExplorerLink from '@swarm/ui/swarm/ExplorerLink'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import TokenSelect from '@swarm/ui/swarm/TokenSelect'
import React from 'react'
import { Box, Button, Flex, Input, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { matchPoolHasReachedLiquidityCap } from 'src/shared/utils/pool'

import { useApplyToken } from './hooks/useApplyToken'
import { useCommitToken } from './hooks/useCommitToken'
import { useEnableToken } from './hooks/useEnableToken'
import { useManageWhitelist } from './hooks/useManageWhitelist'
import { usePokeWeights } from './hooks/usePokeWeights'
import { useRemoveToken } from './hooks/useRemoveToken'
import { useUpdateLiquidityCap } from './hooks/useUpdateLiquidityCap'
import { useUpdatePublicSwap } from './hooks/useUpdatePublicSwap'
import { useUpdateSwapFee } from './hooks/useUpdateSwapFee'
import { useUpdateWeightInstantly } from './hooks/useUpdateWeightInstantly'
import { useUpdateWeightsGradually } from './hooks/useUpdateWeightsGradually'

const StyledLabel = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.grey};

  margin-bottom: 4px;
`

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;

  > li + li {
    margin-top: 16px;
  }
`

interface Props {
  pool: PoolExpanded
  refreshPool: () => void
}

export const PoolManageTab: React.FC<Props> = (props) => {
  const { pool, refreshPool } = props

  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'manage'])

  const canPauseSwapping = pool.rights.includes('canPauseSwapping')
  const canChangeSwapFee = pool.rights.includes('canChangeSwapFee')
  const canChangeWeights = pool.rights.includes('canChangeWeights')
  const canAddRemoveTokens = pool.rights.includes('canAddRemoveTokens')
  const canWhitelistLPs = pool.rights.includes('canWhitelistLPs')
  const canChangeCap = pool.rights.includes('canChangeCap')

  const canDoNothing =
    canPauseSwapping === false &&
    canChangeSwapFee === false &&
    canChangeWeights === false &&
    canAddRemoveTokens === false &&
    canWhitelistLPs === false &&
    canChangeCap === false

  const { isEnablingToken, enableToken } = useEnableToken(refreshPool)

  const { newSwapFee, isUpdatingSwapFee, setNewSwapFee, updateSwapFee } =
    useUpdateSwapFee(pool, refreshPool)

  const {
    newLiquidityCap,
    isUpdatingLiquidityCap,
    setNewLiquidityCap,
    updateLiquidityCap,
  } = useUpdateLiquidityCap(pool, refreshPool)

  const { isUpdatingPublicSwap, updatePublicSwap } = useUpdatePublicSwap(
    pool,
    refreshPool,
  )

  const {
    possibleNewTokens,
    newToken,
    newTokenInitialSupply,
    newTokenWeight,
    isCommittingToken,
    isOverwrittingCommittedToken,
    setNewTokenAddress,
    setNewTokenInitialSupply,
    setNewTokenWeight,
    setIsOverwrittingCommittedToken,
    commitToken,
  } = useCommitToken(pool, refreshPool)

  const {
    tokenToApplyWithCpkAllowance,
    missingBlocksBeforeUnlock,
    canApplyToken,
    isTokenToApplyEnabled,
    isApplyingToken,
    applyToken,
  } = useApplyToken(pool, refreshPool)

  const { isRemovingToken, removeToken } = useRemoveToken(pool, refreshPool)

  const {
    newWeightsByTokenAddress,
    isUpdatingWeight,
    setNewWeight,
    updateWeightInstantly,
  } = useUpdateWeightInstantly(pool, refreshPool)

  const {
    newGradualWeightsByXTokenAddress,
    gradualUpdateStartBlock,
    gradualUpdateEndBlock,
    isGraduallyUpdatingWeights,
    setNewGradualWeight,
    setGradualUpdateStartBlock,
    setGradualUpdateEndBlock,
    updateWeightsGradually,
  } = useUpdateWeightsGradually(pool, refreshPool)

  const {
    missingBlocksBeforeStart,
    canPokeWeights,
    isPokingWeights,
    pokeWeights,
  } = usePokeWeights(pool, refreshPool)

  const {
    newAddressToWhitelist,
    isAddingToWhitelist,
    isRemovingFromWhitelist,
    setNewAddressToWhitelist,
    addToWhitelist,
    removeFromWhitelist,
  } = useManageWhitelist(pool, refreshPool)

  return (
    <Grid
      gridTemplateColumns={['1fr', '1fr 1fr']}
      gridGap={['16px', '32px']}
      mt="8px"
    >
      {canDoNothing ? <Text>Pool has not rights</Text> : null}

      {canChangeSwapFee ? (
        <Box>
          <StyledLabel>{t('updateSwapFee.title')}</StyledLabel>
          <Flex
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="center"
            style={{ gap: '8px' }}
          >
            <Input
              type="number"
              value={newSwapFee}
              placeholder={t('updateSwapFee.form.input.placeholder')}
              disabled={isUpdatingSwapFee}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNewSwapFee(event.target.value)
              }}
            />
            <Button
              disabled={isUpdatingSwapFee}
              onClick={() => {
                updateSwapFee(newSwapFee)
              }}
            >
              {t('updateSwapFee.form.submitButton.label')}
            </Button>
          </Flex>
        </Box>
      ) : null}

      {canChangeCap ? (
        <Box>
          <StyledLabel>{t('updateLiquidityCap.title')}</StyledLabel>
          <Flex
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="center"
            style={{ gap: '8px' }}
          >
            <Input
              type="number"
              value={newLiquidityCap}
              placeholder={t('updateLiquidityCap.form.input.placeholder')}
              disabled={isUpdatingLiquidityCap}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNewLiquidityCap(event.target.value)
              }}
            />
            <Button
              disabled={isUpdatingLiquidityCap}
              onClick={() => {
                updateLiquidityCap(newLiquidityCap)
              }}
            >
              {t('updateLiquidityCap.form.submitButton.label')}
            </Button>
          </Flex>
        </Box>
      ) : null}

      {canPauseSwapping ? (
        <Box>
          <StyledLabel>{t('updatePublicSwap.title')}</StyledLabel>
          <Flex
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="center"
            style={{ gap: '8px' }}
          >
            <Button
              disabled={isUpdatingPublicSwap}
              onClick={() => {
                updatePublicSwap(!pool.publicSwap)
              }}
            >
              {pool.publicSwap
                ? t('updatePublicSwap.form.setFalseButton.label')
                : t('updatePublicSwap.form.setTrueButton.label')}
            </Button>
          </Flex>
        </Box>
      ) : null}

      {canAddRemoveTokens ? (
        <Box>
          <StyledLabel>{t('addToken.title')}</StyledLabel>
          {pool.newCRPoolToken === null || isOverwrittingCommittedToken ? (
            <>
              <Flex
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                style={{ gap: '8px' }}
              >
                <TokenSelect
                  options={possibleNewTokens.map((possibleNewToken) => {
                    return {
                      value: possibleNewToken.address,
                      label: possibleNewToken.symbol,
                    }
                  })}
                  value={
                    newToken === undefined
                      ? undefined
                      : { value: newToken.address, label: newToken.symbol }
                  }
                  isDisabled={
                    isCommittingToken ||
                    pool.crpoolGradualWeightsUpdate !== null
                  }
                  onChange={(option) => {
                    if (option === null) {
                      return
                    }
                    setNewTokenAddress(option.value)
                  }}
                />
                <Input
                  type="number"
                  value={newTokenInitialSupply}
                  placeholder={t(
                    'addToken.form.initialSupplyInput.placeholder',
                  )}
                  disabled={
                    isCommittingToken ||
                    pool.crpoolGradualWeightsUpdate !== null
                  }
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNewTokenInitialSupply(event.target.value)
                  }}
                />
                <Input
                  type="number"
                  value={newTokenWeight}
                  placeholder={t('addToken.form.tokenWeightInput.placeholder')}
                  disabled={
                    isCommittingToken ||
                    pool.crpoolGradualWeightsUpdate !== null
                  }
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNewTokenWeight(event.target.value)
                  }}
                />
                <Button
                  disabled={
                    isCommittingToken ||
                    pool.crpoolGradualWeightsUpdate !== null
                  }
                  onClick={() => {
                    if (newToken === undefined) {
                      return
                    }
                    commitToken(newToken, newTokenInitialSupply, newTokenWeight)
                  }}
                >
                  {t('addToken.form.commitButton.label')}
                </Button>
                {pool.crpoolGradualWeightsUpdate !== null ? (
                  <Text>
                    {t('addToken.noAdditionWhileGradualWeightsUpdate')}
                  </Text>
                ) : null}
                {pool.newCRPoolToken !== null ? (
                  <Button
                    onClick={() => {
                      setIsOverwrittingCommittedToken(false)
                    }}
                  >
                    {t('addToken.form.cancelOverwriteCommitButton.label')}
                  </Button>
                ) : null}
              </Flex>
            </>
          ) : (
            <>
              <Flex
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                mt={3}
                style={{ gap: '16px' }}
              >
                <Flex ml={2} alignItems="center">
                  <TokenIcon
                    symbol={pool.newCRPoolToken.token.symbol}
                    name={pool.newCRPoolToken.token.name}
                    width="20px"
                    height="20px"
                    mr="10px"
                  />
                  <Text.span fontSize={2} fontWeight={5}>
                    {pool.newCRPoolToken.token.symbol}
                  </Text.span>
                  <Text.span fontSize={2} fontWeight={2} ml="8px">
                    {pool.newCRPoolToken.token.name}
                  </Text.span>
                  <ExplorerLink
                    type="token"
                    hash={pool.newCRPoolToken.token.address}
                    label=""
                  />
                </Flex>
                <Flex
                  ml={2}
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <Text fontSize={2} fontWeight={2}>
                    {t('addToken.committedToken.balance', {
                      balance: normalize(
                        pool.newCRPoolToken.balance,
                        pool.newCRPoolToken.token.decimals,
                      ),
                    })}
                  </Text>
                  <Text fontSize={2} fontWeight={2}>
                    {t('addToken.committedToken.weight', {
                      weight: pool.newCRPoolToken.denormWeight,
                    })}
                  </Text>
                </Flex>
                <Flex
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  style={{ gap: '8px' }}
                >
                  <Button
                    disabled={
                      canApplyToken === false ||
                      (isTokenToApplyEnabled
                        ? isApplyingToken
                        : isEnablingToken)
                    }
                    onClick={() => {
                      if (isTokenToApplyEnabled) {
                        applyToken()
                      } else if (tokenToApplyWithCpkAllowance !== null) {
                        enableToken(tokenToApplyWithCpkAllowance)
                      }
                    }}
                  >
                    {isTokenToApplyEnabled
                      ? t('addToken.form.applyButton.label')
                      : t('addToken.form.enableButton.label', {
                          symbol: pool.newCRPoolToken.token.symbol,
                        })}
                  </Button>
                  {canApplyToken === false &&
                  missingBlocksBeforeUnlock !== undefined &&
                  missingBlocksBeforeUnlock > 0 ? (
                    <Text>
                      {t('addToken.commitTokenTimeLockNotFinished', {
                        missingBlocksBeforeUnlock,
                      })}
                    </Text>
                  ) : null}
                  {canApplyToken === false &&
                  matchPoolHasReachedLiquidityCap(pool) ? (
                    <Text>{t('addToken.liquidityCapReached')}</Text>
                  ) : null}
                  {pool.newCRPoolToken !== null ? (
                    <Button
                      onClick={() => {
                        setIsOverwrittingCommittedToken(true)
                      }}
                    >
                      {t('addToken.form.overwriteCommitButton.label')}
                    </Button>
                  ) : null}
                </Flex>
              </Flex>
            </>
          )}
        </Box>
      ) : null}
      {canAddRemoveTokens ? (
        <Box>
          <StyledLabel>{t('removeToken.title')}</StyledLabel>
          <StyledList>
            {pool.tokens.map((token) => {
              return (
                <li key={token.id}>
                  <Flex
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    alignItems="center"
                    style={{ gap: '8px' }}
                  >
                    <Flex ml={2} alignItems="center">
                      <TokenIcon
                        symbol={token.symbol}
                        name={token.name}
                        width="20px"
                        height="20px"
                        mr="10px"
                      />
                      <Text.span fontSize={2} fontWeight={5}>
                        {token.symbol}
                      </Text.span>
                      <Text.span fontSize={2} fontWeight={2} ml="8px">
                        {token.name}
                      </Text.span>
                      <ExplorerLink
                        type="token"
                        hash={token.address}
                        label=""
                      />
                    </Flex>
                    <Button
                      disabled={
                        isRemovingToken ||
                        pool.tokens.length <= 2 ||
                        pool.newCRPoolToken !== null ||
                        pool.crpoolGradualWeightsUpdate !== null
                      }
                      onClick={() => {
                        removeToken(token.id)
                      }}
                      style={{ width: '80px', height: '32px' }}
                    >
                      {t('removeToken.form.removeButton.label')}
                    </Button>
                  </Flex>
                </li>
              )
            })}
          </StyledList>
          {pool.tokens.length <= 2 ? (
            <Text>{t('removeToken.noRemovalWhileTwoTokens')}</Text>
          ) : null}
          {pool.newCRPoolToken !== null ? (
            <Text>{t('removeToken.noRemovalWhileAddingToken')}</Text>
          ) : null}
          {pool.crpoolGradualWeightsUpdate !== null ? (
            <Text>{t('removeToken.noRemovalWhileGradualWeightsUpdate')}</Text>
          ) : null}
        </Box>
      ) : null}

      {canChangeWeights ? (
        <Box>
          <StyledLabel>{t('updateWeightInstantly.title')}</StyledLabel>
          <StyledList>
            {pool.tokens.map((token) => {
              const isFullBalanceApproved =
                token.balance !== undefined &&
                token.balance !== null &&
                isEnabled(token, token.balance)

              return (
                <li key={token.id}>
                  <Flex
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    alignItems="center"
                    style={{ gap: '16px' }}
                  >
                    <Flex ml={2} alignItems="center">
                      <TokenIcon
                        symbol={token.symbol}
                        name={token.name}
                        width="20px"
                        height="20px"
                        mr="10px"
                      />
                      <Text.span fontSize={2} fontWeight={5}>
                        {token.symbol}
                      </Text.span>
                      <Text.span fontSize={2} fontWeight={2} ml="8px">
                        {token.name}
                      </Text.span>
                      <ExplorerLink
                        type="token"
                        hash={token.address}
                        label=""
                      />
                    </Flex>
                    <Flex
                      flexWrap="wrap"
                      justifyContent="flex-start"
                      alignItems="center"
                      style={{ gap: '8px' }}
                    >
                      <Input
                        type="number"
                        value={newWeightsByTokenAddress[token.address]}
                        placeholder={t(
                          'updateWeightInstantly.form.input.placeholder',
                        )}
                        disabled={
                          isUpdatingWeight ||
                          (isFullBalanceApproved === false &&
                            isEnablingToken) ||
                          pool.crpoolGradualWeightsUpdate !== null
                        }
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          setNewWeight(token.address, event.target.value)
                        }}
                      />
                      <Button
                        disabled={
                          isUpdatingWeight ||
                          (isFullBalanceApproved === false &&
                            isEnablingToken) ||
                          pool.crpoolGradualWeightsUpdate !== null
                        }
                        onClick={() => {
                          if (isFullBalanceApproved) {
                            updateWeightInstantly(
                              token.address,
                              token.denormWeight,
                              newWeightsByTokenAddress[token.address],
                            )
                          } else {
                            enableToken(token)
                          }
                        }}
                      >
                        {isFullBalanceApproved
                          ? t('updateWeightInstantly.form.updateButton.label')
                          : t('updateWeightInstantly.form.enableButton.label', {
                              symbol: token.symbol,
                            })}
                      </Button>
                    </Flex>
                  </Flex>
                </li>
              )
            })}
          </StyledList>
          {pool.crpoolGradualWeightsUpdate !== null ? (
            <Text>
              {t(
                'updateWeightInstantly.noWeightUpdateWhileGradualWeightsUpdate',
              )}
            </Text>
          ) : null}
        </Box>
      ) : null}
      {canChangeWeights ? (
        <Box>
          <StyledLabel>{t('updateWeightsGradually.title')}</StyledLabel>
          {pool.crpoolGradualWeightsUpdate === null ? (
            <>
              <StyledList>
                {pool.tokens.map((token) => {
                  if (token.xToken === undefined) {
                    return null
                  }

                  return (
                    <li key={token.id}>
                      <Flex
                        flexWrap="wrap"
                        justifyContent="flex-start"
                        alignItems="center"
                        style={{ gap: '16px' }}
                      >
                        <Flex ml={2} alignItems="center">
                          <TokenIcon
                            symbol={token.symbol}
                            name={token.name}
                            width="20px"
                            height="20px"
                            mr="10px"
                          />
                          <Text.span fontSize={2} fontWeight={5}>
                            {token.symbol}
                          </Text.span>
                          <Text.span fontSize={2} fontWeight={2} ml="8px">
                            {token.name}
                          </Text.span>
                          <ExplorerLink
                            type="token"
                            hash={token.address}
                            label=""
                          />
                        </Flex>
                        <Flex
                          flexWrap="wrap"
                          justifyContent="flex-start"
                          alignItems="center"
                          style={{ gap: '8px' }}
                        >
                          <Input
                            type="number"
                            value={
                              newGradualWeightsByXTokenAddress[token.xToken.id]
                            }
                            placeholder={t(
                              'updateWeightsGradually.form.tokenWeightInput.placeholder',
                            )}
                            disabled={
                              isGraduallyUpdatingWeights ||
                              pool.newCRPoolToken !== null
                            }
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              if (token.xToken === undefined) {
                                return
                              }
                              setNewGradualWeight(
                                token.xToken.id,
                                event.target.value,
                              )
                            }}
                          />
                        </Flex>
                      </Flex>
                    </li>
                  )
                })}
              </StyledList>
              <Flex
                flexWrap="wrap"
                justifyContent="flex-start"
                alignItems="center"
                style={{ gap: '8px', marginBottom: '8px' }}
              >
                <Text style={{ width: '84px' }}>From block</Text>
                <Input
                  type="number"
                  step="1"
                  value={gradualUpdateStartBlock}
                  placeholder={t(
                    'updateWeightsGradually.form.startBlockInput.placeholder',
                  )}
                  disabled={
                    isGraduallyUpdatingWeights || pool.newCRPoolToken !== null
                  }
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setGradualUpdateStartBlock(parseInt(event.target.value, 10))
                  }}
                />
              </Flex>
              <Flex
                flexWrap="wrap"
                justifyContent="flex-start"
                alignItems="center"
                style={{ gap: '8px', marginBottom: '24px' }}
              >
                <Text style={{ width: '84px' }}>To block</Text>
                <Input
                  type="number"
                  step="1"
                  value={gradualUpdateEndBlock}
                  placeholder={t(
                    'updateWeightsGradually.form.endBlockInput.placeholder',
                  )}
                  disabled={
                    isGraduallyUpdatingWeights || pool.newCRPoolToken !== null
                  }
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setGradualUpdateEndBlock(parseInt(event.target.value, 10))
                  }}
                />
              </Flex>
              <Button
                disabled={
                  isGraduallyUpdatingWeights || pool.newCRPoolToken !== null
                }
                onClick={() => {
                  updateWeightsGradually(
                    pool.tokensList.map((poolTokenAddress) => {
                      return newGradualWeightsByXTokenAddress[poolTokenAddress]
                    }),
                    gradualUpdateStartBlock,
                    gradualUpdateEndBlock,
                  )
                }}
              >
                {t('updateWeightsGradually.form.updateButton.label')}
              </Button>
              {pool.newCRPoolToken !== null ? (
                <Text>
                  {t(
                    'updateWeightsGradually.noGradualWeightsUpdateRemovalWhileAddingToken',
                  )}
                </Text>
              ) : null}
            </>
          ) : (
            <>
              <StyledList>
                {pool.tokens.map((token) => {
                  const isFullBalanceApproved =
                    token.balance !== undefined &&
                    token.balance !== null &&
                    isEnabled(token, token.balance)

                  if (isFullBalanceApproved) {
                    return null
                  }

                  return (
                    <li key={token.id}>
                      <Button
                        disabled={isEnablingToken}
                        onClick={() => {
                          enableToken(token)
                        }}
                      >
                        {t('updateWeightsGradually.form.enableButton.label', {
                          symbol: token.symbol,
                        })}
                      </Button>
                    </li>
                  )
                })}
              </StyledList>
              <Button
                disabled={
                  isPokingWeights ||
                  canPokeWeights === false ||
                  pool.tokens.some((token) => {
                    const isFullBalanceApproved =
                      token.balance !== undefined &&
                      token.balance !== null &&
                      isEnabled(token, token.balance)

                    return isFullBalanceApproved === false
                  })
                }
                onClick={pokeWeights}
              >
                {t('updateWeightsGradually.form.pokeWeightButton.label')}
              </Button>
              {canPokeWeights === false ? (
                <Text>
                  {t('updateWeightsGradually.gradualUpdateNotStartedYet', {
                    missingBlocksBeforeStart:
                      missingBlocksBeforeStart !== undefined
                        ? missingBlocksBeforeStart
                        : '-',
                  })}
                </Text>
              ) : null}
            </>
          )}
        </Box>
      ) : null}

      {canWhitelistLPs ? (
        <Box>
          <StyledLabel>{t('manageWhitelist.title')}</StyledLabel>
          <Flex
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="center"
            style={{ gap: '8px', marginBottom: '24px' }}
          >
            <Input
              value={newAddressToWhitelist}
              placeholder={t('manageWhitelist.form.input.placeholder')}
              disabled={isAddingToWhitelist}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNewAddressToWhitelist(event.target.value)
              }}
            />
            <Button
              disabled={isAddingToWhitelist}
              onClick={() => {
                addToWhitelist(newAddressToWhitelist)
              }}
            >
              {t('manageWhitelist.form.addButton.label')}
            </Button>
          </Flex>
          {pool.whitelist.length === 0 ? <Text>List is empty</Text> : null}
          {pool.whitelist.length > 0 ? (
            <StyledList>
              {pool.whitelist.map((whitelistAddress) => {
                return (
                  <li key={whitelistAddress}>
                    <Flex
                      flexWrap="wrap"
                      justifyContent="flex-start"
                      alignItems="center"
                      style={{ gap: '8px' }}
                    >
                      <span>{whitelistAddress}</span>
                      <Button
                        disabled={isRemovingFromWhitelist}
                        onClick={() => {
                          removeFromWhitelist(whitelistAddress)
                        }}
                        style={{ width: '80px', height: '32px' }}
                      >
                        {t('manageWhitelist.form.removeButton.label')}
                      </Button>
                    </Flex>
                  </li>
                )
              })}
            </StyledList>
          ) : null}
        </Box>
      ) : null}
    </Grid>
  )
}
