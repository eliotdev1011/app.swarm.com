import { getFileUrl } from '@swarm/core/shared/utils/cdn'
import SvgIcon from '@swarm/ui/swarm/SvgIcon'

interface VendorIconProps {
  vendor: string
}

const VendorIcon = ({ vendor }: VendorIconProps) => {
  switch (vendor) {
    case 'yes':
      return <SvgIcon name="YesLogo" width="200px" />
    case 'yoti':
      return <SvgIcon name="YotiLogo" width="200px" />
    case 'docScan':
      return <img src={getFileUrl('DocScan.png')} width="66" alt="docscan" />
    case 'sumsub':
      return <SvgIcon name="SumsubKycCardLogo" width="200px" />
    default:
      return null
  }
}

export default VendorIcon
