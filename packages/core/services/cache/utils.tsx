export const getAllowanceCacheKey = (
  account: string,
  spenderAddress: string,
  id: string,
) =>
  `allowance_${account.toLowerCase()}_${spenderAddress.toLowerCase()}_${id.toLowerCase()}`

export const getBalanceCacheKey = (
  account: string,
  tokenAddress: string,
  tokenId?: string,
) => {
  const cacheKey = `balance_${account.toLowerCase()}_${tokenAddress.toLowerCase()}`
  const cacheKeyERC1155 = `${cacheKey}_${tokenId}`
  return tokenId ? cacheKeyERC1155 : cacheKey
}
