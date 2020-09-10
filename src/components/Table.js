import React from 'react'

export default function Table() {
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-xl-12">
                    <div className="white-box my-3">
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <ul className="nav nav-pills">
                                    <li className="nav-item">
                                        <a className="nav-link active" href="#">
                                            <div className="pos-table-bar-cap">Table</div>
                                            <div className="pos-table-bar-num">01</div>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">
                                            <div className="pos-table-bar-cap">Table</div>
                                            <div className="pos-table-bar-num">02</div>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">
                                            <div className="pos-table-bar-cap">Table</div>
                                            <div className="pos-table-bar-num">13</div>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">
                                            <div className="pos-table-bar-cap">Table</div>
                                            <div className="pos-table-bar-num">18</div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="d-flex align-items-center mr-2">
                                <button type="button" className="btn btn-primary btn-lg">New Order</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
