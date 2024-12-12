import { Transaction, TransactionStatus, TransactionType } from '@swarm/types'
import { NativeToken, XToken } from '@swarm/types/tokens'
import { TransactionResult } from 'contract-proxy-kit'
import { providers } from 'ethers'
import pick from 'lodash/pick'

import { transactionsLocalStorage } from '@core/shared/localStorage'
import { big, ZERO } from '@core/shared/utils/helpers'
import { account$, provider$ } from '@core/web3'

import { getCachedExchangeRates } from '../exchange-rates'

interface TransactionToken extends Pick<NativeToken, 'id' | 'symbol'> {
  name?: string
  xToken?: {
    id: string
  }
}

const calcValue = (
  action: TransactionType,
  tokensInAddresses: string[],
  tokensOutAddresses: string[],
  amountsIn: string[],
  amountsOut: string[],
) => {
  const exchangeRates = getCachedExchangeRates([
    ...tokensInAddresses,
    ...tokensOutAddresses,
  ])

  if (['swap', 'exitPool', 'exitPoolSingleOut'].includes(action)) {
    return tokensOutAddresses
      .reduce(
        (acc, tokensOutAddress, idx) =>
          big(amountsOut[idx])
            .times(exchangeRates[tokensOutAddress].exchangeRate || 0)
            .plus(acc),
        ZERO,
      )
      .toString()
  }

  if (['joinPool', 'joinPoolSingleIn'].includes(action)) {
    return tokensInAddresses
      .reduce(
        (acc, tokensInAddress, idx) =>
          big(amountsIn[idx])
            .times(exchangeRates[tokensInAddress].exchangeRate || 0)
            .plus(acc),
        ZERO,
      )
      .toString()
  }

  return '0'
}

export const trackTransaction = async (
  tokensIn: TransactionToken[],
  tokensOut: TransactionToken[],
  amountsIn: string[],
  amountsOut: string[],
  transactionResult: TransactionResult,
  action: TransactionType = 'swap',
  status: TransactionStatus = TransactionStatus.pending,
) => {
  const transactionResponse =
    transactionResult.transactionResponse as providers.TransactionResponse

  const tokensInAddresses = tokensIn.map((tokenIn) => {
    return tokenIn.id
  })
  const tokensOutAddresses = tokensOut.map((tokenOut) => {
    return tokenOut.id
  })

  const tx = {
    id: transactionResponse.hash,
    timestamp: Math.floor(new Date().getTime() / 1000),
    tokensIn,
    tokensOut,
    tokensInAddresses,
    tokensOutAddresses,
    tokenAmountsIn: amountsIn,
    tokenAmountsOut: amountsOut,
    userAddress: {
      id: account$.getValue() ?? '',
    },
    status,
    value: calcValue(
      action,
      tokensInAddresses,
      tokensOutAddresses,
      amountsIn,
      amountsOut,
    ),
    action,
  }

  const response = await provider$
    .getValue()
    .getTransaction(transactionResponse.hash)

  const newTx: Transaction = {
    ...tx,
    tokensIn: tx.tokensIn.map(
      ({ xToken, ...token }) =>
        ({
          ...pick(xToken, ['id', 'name', 'symbol', 'decimals']),
          token: pick(token, ['id', 'name', 'symbol', 'decimals']),
        } as XToken),
    ),
    tokensOut: tx.tokensOut.map(
      ({ xToken, ...token }) =>
        ({
          ...pick(xToken, ['id', 'name', 'symbol', 'decimals']),
          token: pick(token, ['id', 'name', 'symbol', 'decimals']),
        } as XToken),
    ),
  }

  // Persist the tracking of the new transaction
  const txs = transactionsLocalStorage.get()
  transactionsLocalStorage.set([...txs, newTx])

  response
    .wait(1)
    .then(() => {
      transactionsLocalStorage.set((prevTxs) =>
        prevTxs.map((existingTx) => {
          if (existingTx.id === response.hash) {
            return { ...existingTx, status: TransactionStatus.completed }
          }

          return existingTx
        }),
      )
    })
    .catch(() => {
      transactionsLocalStorage.set((prevTxs) =>
        prevTxs.map((existingTx) => {
          if (existingTx.id === response.hash) {
            return { ...existingTx, status: TransactionStatus.failed }
          }

          return existingTx
        }),
      )
    })
}
