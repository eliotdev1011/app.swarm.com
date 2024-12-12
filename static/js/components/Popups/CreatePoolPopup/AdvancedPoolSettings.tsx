import { FormHelperText } from '@material-ui/core'
import { ToggleButtonOption } from '@swarm/types'
import Grid from '@swarm/ui/presentational/Grid'
import Tooltip from '@swarm/ui/presentational/Tooltip'
import { useField } from 'formik'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Card, Flex, Heading, Input, Text } from 'rimble-ui'

import ToggleButtonGroup from 'src/components/ToggleButtonGroup'

import CreatePoolButton from './CreatePoolButton'

const swapFeeOptions: ToggleButtonOption[] = [
  {
    value: 0.1,
    label: '0.1%',
  },
  {
    value: 0.15,
    label: '0.15%',
  },
  {
    value: 0.2,
    label: '0.2%',
  },
  {
    value: null,
    custom: true,
  },
]

interface Props {
  isShowingTokenSettings: boolean
}

const AdvancedPoolSettings: React.FC<Props> = (props: Props) => {
  const { isShowingTokenSettings } = props

  const { t } = useTranslation('pools')

  const swapFeeField = useField<number>({ name: 'swapFee' })

  const smartPoolTokenSymbolField = useField<string>({
    name: 'smartPool.tokenSymbol',
  })
  const smartPoolTokenNameField = useField<string>({
    name: 'smartPool.tokenName',
  })
  const smartPoolInitialSupplyField = useField<string>({
    name: 'smartPool.initialSupply',
  })

  const tokenSymbolFieldError = smartPoolTokenSymbolField[1].error
  const tokenNameFieldError = smartPoolTokenNameField[1].error
  const initialSupplyFieldError = smartPoolInitialSupplyField[1].error

  const handleSwapFeeChange = useCallback(
    (swapFee: number) => {
      swapFeeField[2].setValue(swapFee / 100)
    },
    [swapFeeField],
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
        fontWeight={5}
        mb={2}
        mt={0}
        color="grey"
      >
        {t('createPool.advanced.title')}
      </Heading>
      <Flex alignItems="center" mt={3}>
        <Heading
          as="h4"
          fontSize={2}
          lineHeight="copy"
          fontWeight={5}
          m={0}
          color="black"
        >
          {t('createPool.advanced.swapFee')}
        </Heading>
        <Tooltip placement="top" message={t('createPool.advanced.tooltip')}>
          <Button variant="plain" height="16px" icononly icon="Help" ml={2} />
        </Tooltip>
      </Flex>
      <Box>
        <ToggleButtonGroup
          selectedValue={swapFeeField[0].value * 100}
          options={swapFeeOptions}
          onSelect={handleSwapFeeChange}
          error={swapFeeField[1].error}
        />
      </Box>
      {isShowingTokenSettings ? (
        <Grid gridTemplateColumns="1fr 1fr" gridGap={[3, 3, 3]} mt={3}>
          <Box>
            <Text color="black" fontWeight={5} mb={1}>
              {t('createPool.advanced.tokenSymbol')}
            </Text>
            <Input
              type="text"
              height="36px"
              p="10px 24px 10px 8px"
              fontWeight={5}
              boxShadow="none"
              bg="white"
              width="100%"
              {...smartPoolTokenSymbolField[0]}
            />
            {tokenSymbolFieldError !== undefined ? (
              <FormHelperText error>{tokenSymbolFieldError}</FormHelperText>
            ) : null}
          </Box>
          <Box>
            <Text color="black" fontWeight={5} mb={1}>
              {t('createPool.advanced.tokenName')}
            </Text>
            <Input
              type="text"
              height="36px"
              p="10px 24px 10px 8px"
              fontWeight={5}
              boxShadow="none"
              bg="white"
              width="100%"
              {...smartPoolTokenNameField[0]}
            />
            {tokenNameFieldError !== undefined ? (
              <FormHelperText error>{tokenNameFieldError}</FormHelperText>
            ) : null}
          </Box>
          <Box>
            <Text color="black" fontWeight={5} mb={1}>
              {t('createPool.advanced.initialSupply')}
            </Text>
            <Input
              type="number"
              height="36px"
              p="10px 24px 10px 8px"
              fontWeight={5}
              boxShadow="none"
              bg="white"
              width="100%"
              {...smartPoolInitialSupplyField[0]}
            />
            {initialSupplyFieldError !== undefined ? (
              <FormHelperText error>{initialSupplyFieldError}</FormHelperText>
            ) : null}
          </Box>
        </Grid>
      ) : null}
      <CreatePoolButton />
    </Card>
  )
}

export default AdvancedPoolSettings
