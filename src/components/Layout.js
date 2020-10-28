import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Navbar from '../components/Navbar'
import { isAuthenticated } from '../Helpers/Auth'
import LayoutSideNav from '../components/LayoutSideNav'
import { Redirect } from "react-router-dom"
import MyContext from './MyContext';

const Layout = ({ children }) => {
  const [searchtext, setSearchText] = useState('');

  return (
    <>
      {isAuthenticated() ?
        <main className="pos-nav-fixed">
          <Navbar searchText={(props) => setSearchText(props.target.value)} />
          <div id="layoutSidenav">
            <LayoutSideNav />
            <MyContext.Provider value={searchtext}>
              < >{children}</>
            </MyContext.Provider>
          </div>
        </main>
        : <Redirect to={{ pathname: '/login' }} />}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
