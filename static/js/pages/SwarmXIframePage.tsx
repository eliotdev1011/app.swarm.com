import { useWindowStorageSync } from '@swarm/core/hooks/useWindowStorageSync'
import { isMainnet } from '@swarm/core/shared/utils'
import { getLastUsedNetworkId } from '@swarm/core/web3'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history'
import { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { Flex, Loader } from 'rimble-ui'

import Layout from 'src/components/Layout'

type MessageData = {
  type: 'IFRAME_LOCATION_CHANGE'
  location: Location
}

const SwarmXIframePage = () => {
  const iframeRef = useWindowStorageSync()
  const history = useHistory()
  const currentLocation = useLocation()

  // Receive Location Change Messages From Iframe Window
  useEffect(() => {
    const handleLocationChangeMessage = (event: MessageEvent<MessageData>) => {
      if (event.data.type === 'IFRAME_LOCATION_CHANGE') {
        const iframeLocation = event.data.location

        if (
          iframeLocation.pathname !== currentLocation.pathname ||
          iframeLocation.search !== currentLocation.search ||
          iframeLocation.hash !== currentLocation.hash
        ) {
          history.replace({
            pathname: `/v1${iframeLocation.pathname}`,
            search: iframeLocation.search,
            hash: iframeLocation.hash,
          })
        }
      }
    }

    window.addEventListener('message', handleLocationChangeMessage)

    return () => {
      window.removeEventListener('message', handleLocationChangeMessage)
    }
  }, [
    currentLocation.hash,
    currentLocation.pathname,
    currentLocation.search,
    history,
  ])

  const [loading, setLoading] = useState(true)
  const handleIframeLoad = () => {
    setLoading(false)
  }

  const baseIframeUrl = isMainnet(getLastUsedNetworkId())
    ? 'https://dotc.eth.limo'
    : 'https://swarm-app-git-development-swarm-markets.vercel.app'

  const initialSrc = useRef(
    `${baseIframeUrl}/#${location.pathname.replace(
      '/v1',
      '',
    )}?embed_mode=main_content${location.search.replace('?', '&')}${
      location.hash
    }`,
  )

  return (
    <Layout scrollable>
      {loading && (
        <Flex
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Loader size="30px" m="auto" />
        </Flex>
      )}
      <iframe
        ref={iframeRef}
        onLoad={handleIframeLoad}
        style={{
          width: '100%',
          height: loading ? '0%' : '100%',
          border: 'none',
        }}
        src={initialSrc.current}
        allow="clipboard-read; clipboard-write"
      />
    </Layout>
  )
}

export default SwarmXIframePage
