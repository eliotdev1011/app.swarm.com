import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { useField } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Card, Heading, Input, Text } from 'rimble-ui'

import type { NewSmartPool } from './types'

const SmartPoolRights: React.FC = () => {
  const { t } = useTranslation('pools')

  const smartPoolField = useField<NewSmartPool>({
    name: 'smartPool',
  })
  const minimumGradualUpdateDurationField = useField<number>({
    name: 'smartPool.minimumGradualUpdateDuration',
  })
  const addTokenTimeLockDurationField = useField<number>({
    name: 'smartPool.addTokenTimeLockDuration',
  })

  const minimumGradualUpdateDurationError =
    minimumGradualUpdateDurationField[1].error
  const addTokenTimeLockDurationError = addTokenTimeLockDurationField[1].error

  const { rights, minimumGradualUpdateDuration, addTokenTimeLockDuration } =
    smartPoolField[0].value

  const setRightsField = (name: string, value: boolean) => {
    smartPoolField[2].setValue({
      ...smartPoolField[0].value,
      rights: {
        ...rights,
        [name]: value,
      },
    })
  }

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
        {t('createPool.smartPoolRights.title')}
      </Heading>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={rights.canPauseSwapping}
            onChange={(event) => {
              setRightsField('canPauseSwapping', event.target.checked)
            }}
          />
        }
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.canPauseSwapping')}
          </Text>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={rights.canChangeSwapFee}
            onChange={(event) => {
              setRightsField('canChangeSwapFee', event.target.checked)
            }}
          />
        }
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.canChangeSwapFee')}
          </Text>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={rights.canChangeWeights}
            onChange={(event) => {
              setRightsField('canChangeWeights', event.target.checked)
            }}
          />
        }
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.canChangeWeights')}
          </Text>
        }
      />
      <Collapse in={rights.canChangeWeights}>
        <Box pl={3} marginBottom={20}>
          <FormControlLabel
            control={
              <Input
                type="number"
                step={1}
                height="36px"
                p="10px 12px 10px 8px"
                width="97px"
                fontSize={1}
                fontWeight={5}
                boxShadow="none"
                bg="white"
                textAlign="right"
                value={minimumGradualUpdateDuration}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  smartPoolField[2].setValue({
                    ...smartPoolField[0].value,
                    minimumGradualUpdateDuration: parseInt(
                      event.target.value,
                      10,
                    ),
                  })
                }}
              />
            }
            label={
              <Text fontSize={1} color="grey" mr={3}>
                {t('createPool.smartPoolRights.minimumGradualUpdateDuration')}
              </Text>
            }
            labelPlacement="start"
          />
          {minimumGradualUpdateDurationError !== undefined ? (
            <FormHelperText error style={{ marginLeft: '16px' }}>
              {minimumGradualUpdateDurationError}
            </FormHelperText>
          ) : null}
        </Box>
      </Collapse>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={rights.canAddRemoveTokens}
            onChange={(event) => {
              setRightsField('canAddRemoveTokens', event.target.checked)
            }}
          />
        }
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.canAddRemoveTokens')}
          </Text>
        }
      />
      <Collapse in={rights.canAddRemoveTokens}>
        <Box pl={3} marginBottom={20}>
          <FormControlLabel
            control={
              <Input
                type="number"
                step={1}
                height="36px"
                p="10px 12px 10px 8px"
                width="97px"
                fontSize={1}
                fontWeight={5}
                boxShadow="none"
                bg="white"
                textAlign="right"
                value={addTokenTimeLockDuration}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  smartPoolField[2].setValue({
                    ...smartPoolField[0].value,
                    addTokenTimeLockDuration: parseInt(event.target.value, 10),
                  })
                }}
              />
            }
            label={
              <Text fontSize={1} color="grey" mr={3}>
                {t('createPool.smartPoolRights.addTokenTimeLockDuration')}
              </Text>
            }
            labelPlacement="start"
          />
          {addTokenTimeLockDurationError !== undefined ? (
            <FormHelperText error style={{ marginLeft: '16px' }}>
              {addTokenTimeLockDurationError}
            </FormHelperText>
          ) : null}
        </Box>
      </Collapse>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={rights.canWhitelistLPs}
            onChange={(event) => {
              setRightsField('canWhitelistLPs', event.target.checked)
            }}
          />
        }
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.canWhitelistLPs')}
          </Text>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={rights.canChangeCap}
            onChange={(event) => {
              setRightsField('canChangeCap', event.target.checked)
            }}
          />
        }
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.canChangeCap')}
          </Text>
        }
      />
    </Card>
  )
}

export default SmartPoolRights
