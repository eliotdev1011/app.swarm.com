/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import api from '@swarm/core/services/api'
import { jwtLocalStorage } from '@swarm/core/shared/localStorage/jwtLocalStorage'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'
import { useTheme } from '@swarm/ui/theme/useTheme'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Box, Flex, Link, Loader, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

import { AVAILABLE_FIATS } from 'src/components/Vouchers/Form/constants'
import { IVoucherResponse } from 'src/components/Vouchers/interfaces'
import { ROUTES } from 'src/routes'
import uploadImage from 'src/services/vouchers-image-upload'

const AnimatedFlex = styled(Flex)`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }
  ${(props) => props.animate && 'animation: fadeIn 1s 5 alternate;'}
`

const StyledSwarmLogo = styled(SvgIcon).attrs({ name: 'VouchersSwarmLogo' })`
  margin-top: 11px;
`

const VoucherCard = ({
  data,
  refetch,
  size = 'normal',
  animate,
}: {
  size?: 'small' | 'normal'
  data: IVoucherResponse
  animate?: boolean
  refetch: () => void
}) => {
  const { id, attributes } = data
  const { value, status, background } = attributes

  const [uploading, setUploading] = useState(false)
  const inputFile = useRef<HTMLInputElement | null>(null)
  const { t } = useTranslation('vouchers')
  const history = useHistory()
  const theme = useTheme()

  const handleCameraClick = () => inputFile.current?.click()
  const handleInputFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files?.length) {
      setUploading(true)
      const file = e.target.files[0]
      const imageURL = await uploadImage(file)

      if (imageURL) {
        await api.updateVouchersVoucherBackground(id, imageURL)
        refetch()
      }

      setUploading(false)
    }
  }
  const handleRedeemClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const authToken = jwtLocalStorage.get()

    if (authToken) {
      if (confirm(t('vouchersList.confirmRedeemMessage'))) {
        try {
          await api.redeemVoucher(id)
          refetch()
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('An error occurred while redeeming voucher', error)
        }
      }
    } else if (confirm(t('vouchersList.redeemRequiresOnboardingMessage'))) {
      history.push('/onboarding?vouchers_user_redeeming_voucher=true')
    }
  }

  const zoom = size === 'small' ? '70%' : '100%'
  const paymentCurrency = AVAILABLE_FIATS.find(
    (f) => f.code === value.payment_currency.toUpperCase(),
  )
  const bg =
    background.url ||
    'https://quickbuy-voucher-assets.s3.eu-central-1.amazonaws.com/06463a81-a0b2-4529-86df-26f1e9a9f6ad.png'

  return (
    <AnimatedFlex
      position="relative"
      flexDirection="column"
      bg="#D3D5E5"
      m={[2]}
      width="250px"
      height="134px"
      borderRadius="5px"
      boxShadow="2px 2px 3px #999999"
      padding="7px 14px"
      overflow="hidden"
      style={{ zoom }}
      animate={animate}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={theme.zIndices.layerZero}
        style={{
          backgroundImage: `url('${bg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Flex
        flex="2"
        justifyContent="space-between"
        zIndex={theme.zIndices.layerTwo}
      >
        <StyledSwarmLogo />
        <Flex mt="10px" flexDirection="column">
          <Text
            fontSize="12px"
            color="#ffffff"
            textAlign="right"
            fontWeight="600"
          >
            {value.currency.toUpperCase()}
          </Text>
          <Text
            fontSize="27px"
            color="#ffffff"
            marginLeft="3px"
            fontWeight="600"
          >
            {value.amount}
          </Text>
          <Text
            fontSize="12px"
            color="#ffffff"
            textAlign="right"
            fontWeight="600"
          >
            {`${paymentCurrency?.symbol}${value.payment_amount}`}
          </Text>
        </Flex>
      </Flex>
      <Flex
        flex="1"
        alignItems="flex-end"
        zIndex={theme.zIndices.layerTwo}
        justifyContent="space-between"
      >
        {status === 'pending' && (
          <Text fontSize={12} color="#ffffff">
            {t('vouchersList.pendingLabel')}
          </Text>
        )}
        {status === 'approved' && (
          <Link
            fontSize={12}
            color="#ffffff"
            onClick={handleRedeemClick}
            href={ROUTES.ONBOARDING}
          >
            {t('vouchersList.redeemButton')}
          </Link>
        )}
        {status === 'redeem_pending' && (
          <Text fontSize={12} color="#ffffff">
            {t('vouchersList.redeemInProgressLabel')}
          </Text>
        )}
        {status === 'redeemed' && (
          <Text fontSize={12} color="#ffffff">
            {t('vouchersList.redeemedLabel')}
          </Text>
        )}

        <input
          ref={inputFile}
          type="file"
          accept=".gif,.jpg,.jpeg,.png"
          hidden
          onChange={handleInputFileChange}
        />
        {status === 'approved' && (
          <>
            {uploading ? (
              <Loader />
            ) : (
              <SvgIcon
                name="Camera"
                stroke="#ffffff"
                cursor="pointer"
                width="20"
                height="20"
                onClick={handleCameraClick}
              />
            )}
          </>
        )}
      </Flex>
    </AnimatedFlex>
  )
}

export default VoucherCard
