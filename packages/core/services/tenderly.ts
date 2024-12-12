/* eslint-disable no-console */
import { SimulationResponse } from '@swarm/types'

import config from '@core/config'
import { getCpk } from '@core/contracts/cpk'
import { getLastUsedNetworkId } from '@core/web3/utils'

// assuming environment variables TENDERLY_USER, TENDERLY_PROJECT and TENDERLY_ACCESS_KEY are set
// https://docs.tenderly.co/other/platform-access/how-to-find-the-project-slug-username-and-organization-name
// https://docs.tenderly.co/other/platform-access/how-to-generate-api-access-tokens
const { user, project, accessKey } = config.tenderlyPreferences

export interface TenderlyTransaction {
  from?: string
  to?: string
  data?: string
}

export const simulationToTransaction = ({ simulation }: SimulationResponse) => {
  return {
    from: simulation.from,
    to: simulation.to,
    error: simulation.error_message,
    method: simulation.method,
    network: simulation.network_id,
  }
}

const baseTenderlyRequest = async (endpoint: string, options: RequestInit) => {
  const apiUrl = 'https://api.tenderly.co/api/v1'
  const baseUrl = `${apiUrl}/account/${user}/project/${project}${endpoint}`

  const response = await fetch(baseUrl, {
    headers: {
      'X-Access-Key': accessKey as string,
      'content-type': 'application/json',
    },
    ...options,
  })
  return response.json()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const post = async <T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> =>
  baseTenderlyRequest(endpoint, {
    ...options,
    method: 'POST',
  })

export const batchedCPKSimulations = async (
  transactions: TenderlyTransaction[],
): Promise<ReturnType<typeof simulationToTransaction>[]> => {
  const cpk = getCpk()
  const networkId = getLastUsedNetworkId()

  const res = await post('/simulate-bundle', {
    body: JSON.stringify({
      simulations: transactions.map((transaction) => ({
        network_id: networkId, // network to simulate on
        save: true,
        save_if_fails: true,
        simulation_type: 'full',
        input: transaction.data,
        from: cpk.address,
        ...transaction,
      })),
    }),
  })
  console.log(res)
  return res.simulation_results.map(simulationToTransaction)
}
