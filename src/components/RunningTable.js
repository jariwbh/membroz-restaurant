import React from 'react'
import { Link } from 'react-router-dom';

function RunningTable(props) {
    // console.log('selectedRunningTable :', props.selectedRunningTable)
    // console.log('props.runningTables :', props.runningTables)

    return (
        <React.Fragment>
            <div className="col-xl-8 col-lg-8 col-md-7">
                <div className="white-box my-3">
                    <div className="d-flex">
                        <div className="flex-grow-1">
                            <ul className="nav nav-pills">
                                {props.runningBillTableList}
                            </ul>
                        </div>
                        <div className="d-flex align-items-center mr-2"><button type="button" className="btn btn-primary btn-lg" onClick={props.newOrderHandler()}>New Order</button></div>
                        {/* <button type="button" className="btn btn-primary btn-lg" onClick={props.newOrderHandler()}>New Order</button> */}
                    </div>
                </div>
            </div>
        </React.Fragment >
    )
}
export default RunningTable