import { useMediaQuery, useTheme } from '@material-ui/core'
import { Warning } from '@rimble/icons'
import { FlaggedFeatureName } from '@swarm/core/hooks/data/useFeatureFlags'
import { NativeToken } from '@swarm/types/tokens'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import FlaggedFeature from '@swarm/ui/swarm/FlaggedFeature'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import TokenIcon from '@swarm/ui/swarm/TokenIcon'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Heading, Text } from 'rimble-ui'

interface PoolHeadProps {
  poolToken: NativeToken
  extraRewards: boolean
  isSmartPool: boolean
  isAddingToken: boolean
  isChangingWeights: boolean
  onAddLiquidityClick: () => void
  onRemoveLiquidityClick: () => void
  isAddLiquidityDisabled: boolean
}

const PoolHead = ({
  poolToken: { name, symbol, xToken: xSPT },
  extraRewards,
  isSmartPool,
  isAddingToken,
  isChangingWeights,
  onAddLiquidityClick,
  onRemoveLiquidityClick,
  isAddLiquidityDisabled,
}: PoolHeadProps) => {
  const { t } = useTranslation('poolDetails')
  const theme = useTheme()
  const md = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Heading
      my={1}
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      flexWrap="wrap"
    >
      <Box display="flex">
        <TokenIcon symbol={symbol} name={name} width="32px" height="32px" />
        <Flex ml="2" flexDirection="column">
          <Text.span lineHeight="32px" fontSize={4} fontWeight={5} ml="8px">
            {name}
          </Text.span>
          <Text.span
            lineHeight="20px"
            fontSize="14px"
            fontWeight={5}
            ml="10px"
            color="grey"
          >
            {symbol}
          </Text.span>
        </Flex>
        {isAddingToken ? (
          <Tooltip placement="top" message={t('addTokenInProgress')}>
            <Warning
              size="20"
              ml={2}
              mr={3}
              style={{ marginTop: '4px' }}
              color="warning"
            />
          </Tooltip>
        ) : null}
        {isChangingWeights ? (
          <Tooltip placement="top" message={t('weightUpdateInProgress')}>
            <Warning
              size="20"
              ml={2}
              mr={3}
              style={{ marginTop: '4px' }}
              color="warning"
            />
          </Tooltip>
        ) : null}
        {extraRewards || isSmartPool ? (
          <Flex
            ml="3"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            style={{ gap: '8px' }}
          >
            {extraRewards ? (
              <Text.span
                style={{ flexShrink: 0 }}
                lineHeight="32px"
                fontSize={4}
                fontWeight={5}
              >
                <SvgIcon name="PoolExtraRewards" width="33px" />
              </Text.span>
            ) : null}
            {isSmartPool ? (
              <Text.span
                style={{ flexShrink: 0 }}
                lineHeight="32px"
                fontSize="0.75rem"
                fontWeight={5}
                color="primary"
                fontStyle="italic"
              >
                SMART
              </Text.span>
            ) : null}
          </Flex>
        ) : null}
      </Box>
      <Flex mt={['10px', '10px', '10px', 0]} flexWrap="nowrap">
        <FlaggedFeature name={FlaggedFeatureName.addLiqudity}>
          <Button
            onClick={onAddLiquidityClick}
            title={t('addLiquidity')}
            fontWeight="600"
            fontSize="16px"
            height="40px"
            icon={md ? 'Add' : ''}
            mr="16px"
            px={['10px', '16px']}
            disabled={isAddLiquidityDisabled || xSPT?.paused}
          >
            {t('addLiquidity')}
          </Button>
        </FlaggedFeature>
        <Button
          onClick={onRemoveLiquidityClick}
          title={t('removeLiquidity')}
          fontWeight="600"
          fontSize="16px"
          height="40px"
          icon={md ? 'Remove' : ''}
          mainColor="#262626"
          px={['10px', '16px']}
          disabled={xSPT?.paused}
        >
          {t('removeLiquidity')}
        </Button>
      </Flex>
    </Heading>
  )
}

export default PoolHead
