import React from 'react'
import { Link } from 'react-router-dom';

function RunningTable(props) {
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-xl-12">
                    <div className="white-box my-3">
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <ul className="nav nav-pills">
                                    {props.runningTables.map(table =>
                                        <li className="nav-item" key={table._id} id={table._id}>
                                            <a className="nav-link active" href="#">
                                                <div className="pos-table-bar-cap">Table</div>
                                                <div className="pos-table-bar-num">{table.tableid.property.tablename}</div>
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="d-flex align-items-center mr-2">
                                <Link to="/tablebook">
                                    <button type="button" className="btn btn-primary btn-lg">New Order</button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment >
    )
}
export default RunningTable