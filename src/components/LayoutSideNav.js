import React from 'react'
import { NavLink } from 'react-router-dom'

function LayoutSideNav() {
    return (
        <React.Fragment>
            <div id="layoutSidenav_nav">
                <nav className="pos-sidenav accordion pos-sidenav-dark" id="sidenavAccordion">
                    <div className="pos-sidenav-menu">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <NavLink exact className="nav-link" to="/" activeClassName="active"><span className="sidenav-icon orders-icon"></span> Orders</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact className="nav-link" to="/KitchenTokenOrder" activeClassName="active"><span className="sidenav-icon kitchen-icon"></span> Kitchen</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact className="nav-link" to="/bills" activeClassName="active"><span className="sidenav-icon bills-icon"></span> Bills</NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    )
}

export default LayoutSideNav
