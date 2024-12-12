import { NetworkId } from '@swarm/types/config'
import { secondsInDay } from 'date-fns'
import { ethers, utils } from 'ethers'

import { lastUsedNetworkIdLocalStorage } from '@core/shared/localStorage/lastUsedNetworkIdLocalStorage'

import { getAppConfig } from '../config'

import { getReadOnlyProvider } from './provider'

export const isNetworkSupported = (networkId: number) => {
  const { supportedChainIds } = getAppConfig()
  return supportedChainIds.includes(networkId)
}

export const storeNetworkId = (networkId: number) => {
  const isSupported = isNetworkSupported(networkId)
  if (isSupported) {
    lastUsedNetworkIdLocalStorage.set(networkId)
  }
}

export const getLastUsedNetworkId = (): NetworkId => {
  const { defaultChainId } = getAppConfig()
  const lastUsedNetworkId = lastUsedNetworkIdLocalStorage.get()

  if (lastUsedNetworkId !== null && isNetworkSupported(lastUsedNetworkId)) {
    return lastUsedNetworkId as NetworkId
  }

  storeNetworkId(defaultChainId)

  return defaultChainId
}

export const unifyAddressToId = (address: string) => {
  return address.toLowerCase()
}

export const unifyAddress = (address: string) => {
  try {
    return utils.getAddress(address.replace('×', 'x').toLowerCase())
  } catch {
    return address
  }
}

export const isSameEthereumAddress = (
  addressA?: string | null,
  addressB?: string | null,
): boolean => {
  if (
    addressA === null ||
    addressB === null ||
    addressA === undefined ||
    addressB === undefined
  ) {
    return false
  }

  try {
    return (
      ethers.utils.getAddress(unifyAddress(addressA)) ===
      ethers.utils.getAddress(unifyAddress(addressB))
    )
  } catch {
    return false
  }
}

export async function getTransactionGasFeePriceEstimate(
  signer: ethers.Signer,
  transaction: ethers.PopulatedTransaction,
): Promise<ethers.BigNumber> {
  const gasEstimate = await signer.estimateGas(transaction)

  if (gasEstimate === undefined) {
    return ethers.utils.parseEther('0')
  }

  const feeData = await signer.getFeeData()

  if (feeData === undefined || feeData.maxFeePerGas === null) {
    return ethers.utils.parseEther('0')
  }

  return gasEstimate.mul(feeData.maxFeePerGas)
}

export async function getAverageBlocksPerDay(
  blockInterval = 1000,
): Promise<number> {
  const provider = getReadOnlyProvider()

  const latestBlock = await provider.getBlock('latest')
  const latestBlockNumber = latestBlock.number
  const latestBlockTimestamp = latestBlock.timestamp

  const previousBlockNumber = latestBlockNumber - blockInterval
  const previousBlock = await provider.getBlock(previousBlockNumber)
  const previousBlockTimestamp = previousBlock.timestamp

  const timeInterval = latestBlockTimestamp - previousBlockTimestamp
  const blocksPerSecond = blockInterval / timeInterval

  const blocksPerDay = Math.round(secondsInDay * blocksPerSecond)
  return blocksPerDay
}

export async function getBlockNumberDaysAgo(daysAgo = 1): Promise<number> {
  const provider = getReadOnlyProvider()

  const latestBlock = await provider.getBlock('latest')
  const latestBlockNumber = latestBlock.number
  const averageBlocksPerDay = await getAverageBlocksPerDay(1000 * daysAgo)

  return latestBlockNumber - averageBlocksPerDay * daysAgo
}
