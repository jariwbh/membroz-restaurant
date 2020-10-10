import React from "react"
import PropTypes from "prop-types"
import Navbar from '../components/Navbar'
import { isAuthenticated } from '../Helpers/Auth'
import LayoutSideNav from '../components/LayoutSideNav'
import { Redirect } from "react-router-dom"

const Layout = ({ children }) => {
  return (
    <>
      {isAuthenticated() ?
        <main className="pos-nav-fixed">
          <Navbar />
          <div id="layoutSidenav">
            <LayoutSideNav />
            < >{children}</>
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
