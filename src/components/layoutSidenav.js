import React from 'react'
import { NavLink } from 'react-router-dom'

function layoutSidenav() {
    return (
        <React.Fragment>
            <div id="layoutSidenav_nav">
                <nav className="pos-sidenav accordion pos-sidenav-dark" id="sidenavAccordion">
                    <div className="pos-sidenav-menu">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/" activeclassname="active"><span className="sidenav-icon orders-icon"></span> Orders</NavLink>
                            </li>
                            {/* <li className="nav-item">
                                <NavLink className="nav-link" to="/TableBook" activeclassname="active"><span className="sidenav-icon tables-icon"></span> Tables</NavLink>
                            </li> */}
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/KitchenTokenOrder" activeclassname="active"><span className="sidenav-icon kitchen-icon"></span> Kitchen</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/bills" activeclassname="active"><span className="sidenav-icon bills-icon"></span> Bills</NavLink>
                            </li>
                            {/* <li className="nav-item">
                                <NavLink className="nav-link" to="/setting" activeclassname="active"><span className="sidenav-icon setting-icon"></span> Setting</NavLink>
                            </li> */}
                        </ul>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    )
}

export default layoutSidenav
