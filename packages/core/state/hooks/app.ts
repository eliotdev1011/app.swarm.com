import { selectInitiated } from '@core/state/selectors'
import useSelector from '@core/state/useSelector'

export const useInitiated = () => useSelector(selectInitiated)
