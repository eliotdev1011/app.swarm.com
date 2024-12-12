import { Route, Switch } from 'react-router'

import Form from 'src/components/Vouchers/Form'
import Vouchers from 'src/components/Vouchers/List'
import Payment from 'src/components/Vouchers/Payment'
import { ROUTES } from 'src/routes'

const QuickBuy = () => (
  <Switch>
    <Route exact path={ROUTES.VOUCHERS} component={Form} />
    <Route path={ROUTES.VOUCHERS_PAYMENT} component={Payment} />
    <Route path={ROUTES.VOUCHERS_LIST} component={Vouchers} />
  </Switch>
)

export default QuickBuy
