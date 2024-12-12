import { UserAddress, UserData } from '@swarm/types/api-responses'
import BaseResponse from '@swarm/types/api-responses/base.response'
import UserStateAccount from '@swarm/types/state/user-account'

import { SupportedNetworkId } from '@core/shared/enums/supported-network-id'
import { isNetworkSupported, unifyAddress } from '@core/web3'

export const parseUserData = (entries: UserData) => ({
  email: entries.email,
  birthDate: entries.birth_date,
  firstName: entries.first_name,
  givenName: entries.given_name,
  fullName: entries.full_name,
  familyName: entries.family_name,
  iban: entries.iban,
  address: entries.structured_address
    ? entries.structured_address.formatted
    : null,
  structuredAddress: entries.structured_address,
  placeOfBirth: entries.place_of_birth,
  kycProvider: entries.provider,
  nationalities: entries.nationalities,
})

export const parseUserAddresses = (
  entries: BaseResponse<UserAddress>[],
): UserStateAccount[] => {
  return entries.map((addressInfo) => ({
    address: unifyAddress(addressInfo.attributes.address),
    ...(addressInfo.attributes?.label && {
      label: addressInfo.attributes.label,
    }),
    ...(addressInfo.attributes?.business_name && {
      businessName: addressInfo.attributes.business_name,
    }),
    cpkAddresses: addressInfo.attributes.cpk_addresses.reduce(
      (map, cpkInfo) => ({
        ...map,
        ...(isNetworkSupported(cpkInfo.chain_id) && {
          [cpkInfo.chain_id]: unifyAddress(cpkInfo.address),
        }),
      }),
      {} as Record<SupportedNetworkId, string>,
    ),
  }))
}
