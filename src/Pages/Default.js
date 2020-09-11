import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ProtectedRoute } from "../components/ProtectedRoute"
import Home from '../Pages/Home'
import Menu from '../Pages/Menu'
import Login from '../Pages/Login'
import Logout from '../Pages/Logout'
import TableBook from '../Pages/TableBook';

export default function Default() {
    return (
        <React.Fragment>
            <Switch>
                <Route path="/Login" component={Login} />
                <ProtectedRoute exact path="/" component={Home} />
                <ProtectedRoute exact path="/Menu" component={Menu} />
                <ProtectedRoute path="/logout" component={Logout} />
                <ProtectedRoute path="/TableBook" component={TableBook} />
            </Switch>
        </React.Fragment>
    )
}
