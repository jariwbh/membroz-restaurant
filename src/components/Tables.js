import React, { Component } from 'react'
import ReservedTable from './ReservedTable'
import WaitingTable from './WaitingTable'
export default class Tables extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="col-xl-4 col-lg-4 col-md-5" >
                    <div className="white-box mb-3 white-box-full" >
                        <ul className="nav nav-pills categories-pills person-table-p d-flex justify-content-around" id="pills-tab-list" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a className="nav-link active" id="pills-waiting-1-tab" data-toggle="pill" href="#pills-waiting-1" role="tab" aria-controls="pills-waiting-1" aria-selected="true">Waiting List</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="nav-link" id="pills-reserved-2-tab" data-toggle="pill" href="#pills-reserved-2" role="tab" aria-controls="pills-reserved-2" aria-selected="false">Reserved List</a>
                            </li>
                        </ul>
                        <div className="tab-content categories-tab-content" id="pills-tabContent-list">
                            <WaitingTable />
                            <ReservedTable />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
