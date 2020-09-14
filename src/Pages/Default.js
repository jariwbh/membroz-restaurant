import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ProtectedRoute } from "../components/ProtectedRoute"
import Home from '../Pages/Home'
import Menu from '../Pages/Menu'
import Login from '../Pages/Login'
import Logout from '../Pages/Logout'
import TableBook from '../Pages/TableBook';
import Kitchen from './Kitchen'
import ForgetPassword from './ForgotPassword'

export default function Default() {
    return (
        <React.Fragment>
            <Switch>
                <Route strict exact path="/Login"
                    render={props => (
                        <Login {...props} component={Login} title="Restaurant - Login" />
                    )}
                />

                <Route exact path="/ForgetPassword" render={props => (
                    <ForgetPassword {...props} component={ForgetPassword} title="Forget Password" />
                )} />

                <ProtectedRoute exact path="/" title="Restaurant" component={Home} />
                <ProtectedRoute exact path="/Menu" title="Restaurant - Menu" component={Menu} />
                <ProtectedRoute path="/logout" component={Logout} />
                <ProtectedRoute path="/TableBook" title="Restaurant - Table" component={TableBook} />
                <ProtectedRoute path="/Kitchen" title="Restaurant - Kitchen" component={Kitchen} />
            </Switch>
        </React.Fragment>
    )
}
