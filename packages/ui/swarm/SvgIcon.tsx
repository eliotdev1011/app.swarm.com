import { getSvgUrl } from '@swarm/core/shared/utils/cdn'
import SVG, { Props as SVGProps } from 'react-inlinesvg'
import { Loader } from 'rimble-ui'

interface SvgIconProps extends Omit<SVGProps, 'src'> {
  external?: boolean
}

const SvgIcon = ({ name, external, ...rest }: SvgIconProps) =>
  name ? (
    <SVG
      src={external ? name : getSvgUrl(name)}
      loader={<Loader {...rest} />}
      {...rest}
    />
  ) : null

export default SvgIcon
