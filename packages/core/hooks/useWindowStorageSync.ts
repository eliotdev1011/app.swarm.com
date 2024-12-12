import { useEffect, useRef } from 'react'
import { LocalStorageService } from '@swarm/core/services/window-storage/local-storage'
import { useConnectWallet } from '@swarm/core/web3'

interface StorageChangeData {
  type: 'swarm-local-storage-change'
  key: string
  value: any
}
export function useWindowStorageSync() {
  const connectWallet = useConnectWallet()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Send Storage Change Messages From Current Window
  useEffect(() => {
    setTimeout(() => {
      if (iframeRef.current) {
        Object.entries(localStorage).forEach(([key, value]) => {
          try {
            value = JSON.parse(value)
          } catch (e) {}
          iframeRef.current!.contentWindow?.postMessage(
            {
              type: 'swarm-local-storage-change',
              key,
              value: value,
            },
            '*',
          )
        })
      }
    }, 1000)
    const { unsubscribe } = LocalStorageService.subscribe(
      (value: any, key: string) => {
        const messsage = {
          type: 'swarm-local-storage-change',
          key,
          value,
        }

        const parent = window.parent
        if (parent) {
          parent.postMessage(messsage, '*')
        }
        if (iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage(messsage, '*')
        }
      },
    )
    return () => {
      unsubscribe()
    }
  }, [])

  // Receive Storage Change Messages From Other Windows
  useEffect(() => {
    const storageListener = (event: MessageEvent<StorageChangeData>) => {
      const { type, key, value } = event.data
      if (type === 'swarm-local-storage-change') {
        localStorage.setItem(
          key,
          typeof value === 'string' ? value : JSON.stringify(value),
        )

        if (key === 'SELECTED_WALLET' && value) {
          connectWallet(value)
        }
      }
    }

    window.addEventListener('message', storageListener)

    return () => {
      window.removeEventListener('message', storageListener)
    }
  }, [])

  return iframeRef
}
