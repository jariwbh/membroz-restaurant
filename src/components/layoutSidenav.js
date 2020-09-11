import React from 'react'
import { Link } from 'react-router-dom'

function layoutSidenav() {
    return (
        <React.Fragment>
            <div id="layoutSidenav_nav">
                <nav className="pos-sidenav accordion pos-sidenav-dark" id="sidenavAccordion">
                    <div className="pos-sidenav-menu">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/TableBook"><span className="sidenav-icon tables-icon"></span> Tables</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#"><span className="sidenav-icon kitchen-icon"></span> Kitchen</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#"><span className="sidenav-icon orders-icon"></span> Orders</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#"><span className="sidenav-icon bills-icon"></span> Bills</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#"><span className="sidenav-icon setting-icon"></span> Setting</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    )
}

export default layoutSidenav
