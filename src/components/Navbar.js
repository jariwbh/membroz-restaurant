import React from 'react'
import * as image from './Image'
import $ from 'jquery'
import { Link } from 'react-router-dom';
export default function Nav() {

    const sidebarToggle = () => {
        $("main").toggleClass("pos-sidenav-toggled");
    }

    return (
        <React.Fragment>
            <nav className="navbar navbar-expand-md navbar-light pos-navbar fixed-top shadow-bottom pos-topnav bg-white">
                <button className="navbar-toggler d-block" onClick={() => { sidebarToggle() }} id="sidebarToggle" > <span className="navbar-toggler-icon"></span></button>
                <Link className="navbar-brand" to="/"><img src={image.membrozlogo} alt="" /></Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span> </button>
                <div className="collapse navbar-collapse mt-3 mt-md-0" id="navbarSupportedContent">
                    <ul className="navbar-nav top-nav-right-icon-main ml-auto">
                        <li className="nav-item">
                            <form className="form-inline">
                                <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                            </form>
                        </li>
                        <li className="nav-item dropdown"> <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Terrace Restaurant</a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#">Ground Restaurant</a>
                                <a className="dropdown-item" href="#">Nest Restaurant</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown"> <a className="nav-link dropdown-toggle py-md-0" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src={image.userimage} className="user-img rounded-circle" alt="" /></a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#">My Profile</a>
                                <Link className="dropdown-item" to="/logout">Logout</Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </React.Fragment>
    )
}
