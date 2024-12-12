import { ChildrenProps } from '@swarm/types/index'

interface WrapperProps extends ChildrenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ComponentType<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any
}

export type WithWrapper<Props, WrapperType> = Props & {
  wrapper?: WrapperType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any
}

const Wrapper = ({ children, component, ...props }: WrapperProps) => {
  const WrapperComponent = component

  if (WrapperComponent) {
    return <WrapperComponent {...props}>{children}</WrapperComponent>
  }

  return <>{children}</>
}

export default Wrapper
