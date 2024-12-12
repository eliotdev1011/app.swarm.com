import useAsyncState from '@swarm/core/hooks/async/useAsyncState'
import { ExtractProps } from '@swarm/types/props'
import { Button, Loader } from 'rimble-ui'

const LoaderButton = ({
  component = Button,
  onClick,
  disabled,
  loadingText,
  children,
  loading = false,
  loaderColor = 'white',
  ...props
}: ExtractProps<typeof Button>) => {
  const [actionLoading, setActionLoading] = useAsyncState(false)
  const handleOnClick = () => {
    const promise = onClick()

    if (promise instanceof Promise) {
      setActionLoading(true)
      promise.finally(() => setActionLoading(false))
    }
  }

  const Tag = component

  return (
    <Tag
      {...props}
      onClick={handleOnClick}
      disabled={disabled || loading || actionLoading}
    >
      {loading || actionLoading
        ? loadingText || <Loader color={loaderColor} />
        : children}
    </Tag>
  )
}

export default LoaderButton
