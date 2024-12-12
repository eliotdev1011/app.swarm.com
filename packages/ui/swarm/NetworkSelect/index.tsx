import usePopupState from '@swarm/core/hooks/state/usePopupState'
import {
  BridgeName,
  commonEVMNetworks,
  IBridge,
  networksBridges,
} from '@swarm/core/shared/consts'
import {
  polygonInfoShowOnReloadLocalStorage,
  usePolygonInfoLocalStorage,
} from '@swarm/core/shared/localStorage'
import { propEquals } from '@swarm/core/shared/utils/collection/filters'
import { isPolygon } from '@swarm/core/shared/utils/config'
import { switchNetwork, useStoredNetworkId } from '@swarm/core/web3'
import { NetworkId } from '@swarm/types/config'
import omit from 'lodash/omit'
import { useEffect, useMemo } from 'react'
import { Props as ReactSelectProps } from 'react-select'

import PolygonInfoPopup from '../Popups/PolygonInfoPopup'

import { Menu } from './Menu'
import { getNetworkOptions, INetworkOption, Option } from './NetworkOptions'
import { SingleValue } from './SingleValues'
import { DropdownIndicator, StyledSelect } from './StyledSelect'

interface NetworkSelectProps extends ReactSelectProps {
  showPolygonPopup?: boolean
}

const NetworkSelect = ({
  showPolygonPopup = false,
  ...props
}: NetworkSelectProps) => {
  const networkId = useStoredNetworkId()
  const polygonInfoPopup = usePopupState(false)
  const networkOptions = getNetworkOptions()

  const { value: dontShowAgain } = usePolygonInfoLocalStorage()

  const selectedNetworkOption = useMemo(
    () => networkOptions.find(propEquals('value', networkId)),
    [networkId, networkOptions],
  )

  const handleSwitchNetwork = async (network: NetworkId | BridgeName) => {
    const bridge: IBridge = Object.values(networksBridges).find(
      (b: IBridge) => b.name === network,
    )
    if (bridge) {
      window.open(bridge.url, '_blank')
      return
    }

    if (network) {
      const params = commonEVMNetworks.find(propEquals('networkId', network))

      if (params !== undefined) {
        const success = await switchNetwork(params.networkId)
        if (success && isPolygon(params.networkId) && !dontShowAgain) {
          polygonInfoShowOnReloadLocalStorage.set(true)
        }
      }
    }
  }

  const onChange = async (selection: INetworkOption | null) => {
    if (selection) {
      await handleSwitchNetwork(selection.value)
    }
  }

  useEffect(() => {
    if (polygonInfoShowOnReloadLocalStorage.get() === true) {
      polygonInfoShowOnReloadLocalStorage.remove()
      polygonInfoPopup.open()
    }
  }, [polygonInfoPopup])

  return (
    <>
      <StyledSelect
        {...omit(props, ['theme'])}
        value={selectedNetworkOption}
        options={networkOptions}
        onChange={onChange}
        placeholder="Select Network"
        isSearchable={false}
        className="Select"
        classNamePrefix="Dropdown"
        components={{
          Menu,
          Option,
          DropdownIndicator,
          SingleValue,
        }}
      />

      {showPolygonPopup && (
        <PolygonInfoPopup
          isOpen={polygonInfoPopup.isOpen}
          onClose={polygonInfoPopup.close}
        />
      )}
    </>
  )
}

export default NetworkSelect
