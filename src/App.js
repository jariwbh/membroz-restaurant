import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import { ProtectedRoute } from "./components/ProtectedRoute";

import 'bootstrap/dist/css/bootstrap.min.css';
// import  './Styles/Common.css'
import './Assets/css/custom.css'

import LayoutSidenav from './components/layoutSidenav'

import Home from './Pages/Home'
import Menu from './Pages/Menu'
import Login from './Pages/Login'
import Logout from './Pages/Logout'

import { isAuthenticated } from './Helpers/Auth'
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        {isAuthenticated() ?
          <main className="pos-nav-fixed">
            <Navbar />
            <div id="layoutSidenav">
              <LayoutSidenav />
              <Switch>
                <ProtectedRoute exact path="/" component={Home} />
                <ProtectedRoute exact path="/menu" component={Menu} />
                <ProtectedRoute path="/logout" component={Logout} />
              </Switch>
            </div>
          </main>
          :
          <Route path="/login" component={Login} />
        }
      </BrowserRouter>
    );
  }
}

export default App;
