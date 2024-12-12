import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import config from '@swarm/core/config'
import api from '@swarm/core/services/api'
import { BrandNames } from '@swarm/core/shared/enums'
import { useUserId } from '@swarm/core/state/hooks'
import Dialog from '@swarm/ui/presentational/Dialog'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Heading, Link } from 'rimble-ui'
import styled from 'styled-components/macro'

import { checkIsMattereum } from 'src/shared/utils/brand'

const {
  docs: { terms, gettingStarted },
  mattereum: { terms: mattereumTerms },
} = config.resources

const CheckboxMarkupItem = styled(FormControlLabel)`
  margin-bottom: 15px;
`

interface ConnectIdentityPrivacyModalProps {
  onClose: () => void
  onNext: () => void
}

interface CheckboxLabelProps {
  beforeText?: string
  afterText?: string
  linkText: string
  href?: string
}

const CheckboxLabel = ({
  beforeText = '',
  afterText = '',
  linkText,
  href,
}: CheckboxLabelProps) => {
  return (
    <span>
      {beforeText}
      <Link
        href={href}
        color="primary"
        hoverColor="dark-gray"
        fontSize={2}
        fontWeight={3}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        {linkText}
      </Link>
      {afterText}
    </span>
  )
}

const ConnectIdentityPrivacyModal = ({
  onNext,
  onClose,
}: ConnectIdentityPrivacyModalProps) => {
  const { t } = useTranslation(['onboarding'])
  const [clickCounts, setClickCounts] = useState(0)
  const userId = useUserId()

  const isMattereum = checkIsMattereum()
  const requiredClicks = isMattereum ? 5 : 3

  const changeCheckbox = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.checked) {
      setClickCounts(clickCounts + 1)
    } else {
      setClickCounts(clickCounts - 1)
    }
  }

  const connect = useCallback(async () => {
    if (userId) {
      const exists = await api.addLog(userId, {
        type: 'agreeTerms',
        attributes: { createdAt: new Date().toISOString() },
      })

      if (exists) {
        onNext()
      }
    }
  }, [userId, onNext])

  return (
    <Dialog isOpen onClose={onClose} width={['100%', '630px']}>
      <Box m="15px">
        <Heading.h2 mt={0}>{t('connectIdentityPrivacy.header')}</Heading.h2>
        <CheckboxMarkupItem
          control={<Checkbox color="primary" onChange={changeCheckbox} />}
          label={
            <CheckboxLabel
              linkText={t('connectIdentityPrivacy.terms')}
              beforeText={`${t('connectIdentityPrivacy.1')} `}
              afterText="."
              href={terms.tos}
            />
          }
        />
        <CheckboxMarkupItem
          control={<Checkbox color="primary" onChange={changeCheckbox} />}
          label={
            <CheckboxLabel
              linkText={t('connectIdentityPrivacy.notUserPerson')}
              beforeText={`${t('connectIdentityPrivacy.2')} `}
              href={gettingStarted.limitations}
            />
          }
        />
        <CheckboxMarkupItem
          control={<Checkbox color="primary" onChange={changeCheckbox} />}
          label={
            <CheckboxLabel
              linkText={t('connectIdentityPrivacy.privacy')}
              beforeText={`${t('connectIdentityPrivacy.3Front')} `}
              afterText={` and ${t('connectIdentityPrivacy.3Back')}`}
              href={terms.privacy}
            />
          }
        />
        {isMattereum && (
          <>
            <CheckboxMarkupItem
              control={<Checkbox color="primary" onChange={changeCheckbox} />}
              label={
                <CheckboxLabel
                  linkText={t('connectIdentityPrivacy.terms')}
                  beforeText={`${t('connectIdentityPrivacy.1Brand', {
                    brand: BrandNames.mattereum,
                  })} `}
                  afterText="."
                  href={mattereumTerms.tos}
                />
              }
            />
            <CheckboxMarkupItem
              control={<Checkbox color="primary" onChange={changeCheckbox} />}
              label={
                <CheckboxLabel
                  linkText={t('connectIdentityPrivacy.privacy')}
                  beforeText={`${t('connectIdentityPrivacy.3Brand', {
                    brand: BrandNames.mattereum,
                  })} `}
                  afterText={` and ${t('connectIdentityPrivacy.3Back')}`}
                  href={mattereumTerms.privacy}
                />
              }
            />
          </>
        )}

        <Button
          size="medium"
          px={3}
          mt="10px"
          width="100%"
          color="primary"
          onClick={connect}
          disabled={clickCounts < requiredClicks}
        >
          {t('connectIdentityPrivacy.connect')}
        </Button>
      </Box>
    </Dialog>
  )
}

export default ConnectIdentityPrivacyModal
