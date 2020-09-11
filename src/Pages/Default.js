import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ProtectedRoute } from "../components/ProtectedRoute"
import LayoutSidenav from '../components/layoutSidenav'
import Home from '../Pages/Home'
import Menu from '../Pages/Menu'
import Login from '../Pages/Login'
import Logout from '../Pages/Logout'
import { isAuthenticated } from '../Helpers/Auth'
import TableBook from '../Pages/TableBook';

export default function Default() {
    return (
        <React.Fragment>
            {isAuthenticated() ?
                <main className="pos-nav-fixed">
                    <Navbar />
                    <div id="layoutSidenav">
                        <LayoutSidenav />
                        <Switch>
                            <ProtectedRoute exact path="/" component={Home} />
                            <ProtectedRoute exact path="/Menu" component={Menu} />
                            <ProtectedRoute path="/logout" component={Logout} />
                            <ProtectedRoute path="/TableBook" component={TableBook} />
                        </Switch>
                    </div>
                </main>
                :
                <Route path="/" component={Login} />
            }
        </React.Fragment>
    )
}
