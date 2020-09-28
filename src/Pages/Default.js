import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ProtectedRoute } from "../components/ProtectedRoute"
import Home from '../Pages/Home'
import Menu from '../Pages/Menu'
import Login from '../Pages/Login'
import Logout from '../Pages/Logout'
import TableBook from '../Pages/TableBook';
import KitchenTokenOrder from '../Pages/KitchenTokenOrder'
import ForgetPassword from './ForgotPassword'
import Orders from './Orders'
import Bills from './Bills'
import Setting from './Setting'
import MyProfile from './MyProfile'
import Test from './test'

export default function Default() {
    return (
        <React.Fragment>
            <Switch>
                <Route strict exact path="/login"
                    render={props => (
                        <Login {...props} component={Login} title="Restaurant - Login" />
                    )}
                />

                <Route exact path="/ForgetPassword" render={props => (
                    <ForgetPassword {...props} component={ForgetPassword} title="Forget Password" />
                )} />

                <ProtectedRoute exact path="/" title="Restaurant" component={Home} />
                <ProtectedRoute exact path="/home/:tableid" title="Restaurant" component={Home} />
                <Route exact path="/menu" title="Restaurant - Menu" component={Menu} />
                <ProtectedRoute path="/logout" component={Logout} />
                <ProtectedRoute path="/tableBook" title="Restaurant - Table" component={TableBook} />
                <ProtectedRoute path="/KitchenTokenOrder" title="Restaurant - Kitchen" component={KitchenTokenOrder} />

                <ProtectedRoute path="/orders" title="Restaurant - Orders" component={Orders} />
                <ProtectedRoute path="/bills" title="Restaurant - Bills" component={Bills} />
                <ProtectedRoute path="/setting" title="Restaurant - Setting" component={Setting} />
                <ProtectedRoute path="/myprofile" title="Restaurant - MyProfile" component={MyProfile} />
                <ProtectedRoute path="/test" title="Restaurant - MyProfile" component={Test} />
            </Switch>
        </React.Fragment>
    )
}
