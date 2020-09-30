import React from 'react'
import Tables from '../components/Tables'

function TableBook(props) {

        return (
            <div id="layoutSidenav_content" >
                <main>
                    <div className="container-fluid">
                        <div className="row table-item-gutters my-3">
                            <Tables />

                            <div className="col-xl-8 col-lg-8 col-md-7">
                                <ul className="nav nav-pills mb-2 categories-pills table-no-pills" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link active" id="pills-table-1-tab" data-toggle="pill" href="#pills-table-1" role="tab" aria-controls="pills-table-1" aria-selected="true">All</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-table-2-tab" data-toggle="pill" href="#pills-table-2" role="tab" aria-controls="pills-table-2" aria-selected="false">Occupied <span className="table-status-tab occupied-bg"></span> </a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link " id="pills-table-3-tab" data-toggle="pill" href="#pills-table-3" role="tab" aria-controls="pills-table-3" aria-selected="false">Reserved <span className="table-status-tab reserved-bg"></span></a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link " id="pills-table-4-tab" data-toggle="pill" href="#pills-table-4" role="tab" aria-controls="pills-table-4" aria-selected="false">Blank <span className="table-status-tab blank-bg"></span></a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link " id="pills-table-5-tab" data-toggle="pill" href="#pills-table-5" role="tab" aria-controls="pills-table-5" aria-selected="false">Cleaning <span className="table-status-tab cleaning-bg"></span></a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link " id="pills-table-6-tab" data-toggle="pill" href="#pills-table-6" role="tab" aria-controls="pills-table-6" aria-selected="false">No Service <span className="table-status-tab no-service-bg"></span></a>
                                    </li>
                                </ul>
                                <div className="tab-content categories-tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-table-1" role="tabpanel" aria-labelledby="pills-table-1-tab">
                                        <div className="row card-item-gutters">
                                            {props.tableList}
                                            {/* {tableList.map(tables =>
                                                <Link to={"/home/tableid=" + tables._id} className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6" key={tables._id}>
                                                    <div className="card white-box mb-10 border-0 table-box-height occupied-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">{tables.property.capacity}</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-restaurant-title">{tables.property.tablename}</div>
                                                                <div className="table-number">01</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-table-2" role="tabpanel" aria-labelledby="pills-table-2-tab">
                                        2
                                  </div>
                                    <div className="tab-pane fade" id="pills-table-3" role="tabpanel" aria-labelledby="pills-table-3-tab">
                                        3
                                  </div>
                                    <div className="tab-pane fade" id="pills-table-4" role="tabpanel" aria-labelledby="pills-table-4-tab">
                                        4
                                  </div>
                                    <div className="tab-pane fade" id="pills-table-5" role="tabpanel" aria-labelledby="pills-table-5-tab">
                                        5
                                  </div>
                                    <div className="tab-pane fade" id="pills-table-6" role="tabpanel" aria-labelledby="pills-table-6-tab">
                                        6
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

export default TableBook