import React, { Component } from 'react'
import * as Api from '../Api/TableServices'
import { tableimage } from '../components/Image';

class TableBook extends Component {
    constructor(props) {
        super(props);
        document.title = this.props.title
        window.scrollTo(0, 0);

        this.state = {
            tableList: [],
        }
    }

    componentDidMount() {
        Api.getTableList().then((response) => {
            this.setState({ tableList: response.data })
        })
    }
    render() {
        const { tableList } = this.state
        return (
            <div id="layoutSidenav_content" >
                <div className="container-fluid">
                    <div className="row table-item-gutters">
                        <div className="col-xl-8 col-lg-8 col-md-7">
                            <ul className="nav nav-pills mb-2 categories-pills" id="pills-tab" role="tablist">
                                <li className="nav-item " role="presentation">
                                    <a className="nav-link active" id="pills-item-1-tab" data-toggle="pill" href="#pills-item-1" role="tab" aria-controls="pills-item-1" aria-selected="true">Dinning</a>
                                </li>
                                <li className="nav-item " role="presentation">
                                    <a className="nav-link" id="pills-item-2-tab" data-toggle="pill" href="#pills-item-2" role="tab" aria-controls="pills-item-2" aria-selected="false">Take Away</a>
                                </li>
                                <li className="nav-item " role="presentation">
                                    <a className="nav-link" id="pills-item-3-tab" data-toggle="pill" href="#pills-item-3" role="tab" aria-controls="pills-item-3" aria-selected="false">Delivery</a>
                                </li>
                            </ul>
                            <div className="tab-content categories-tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-item-1" role="tabpanel" aria-labelledby="pills-item-1-tab">
                                    <div className="row card-item-gutters">
                                        {tableList.map(tables =>
                                            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 d-flex" key={tables._id}>
                                                <div className="card white-box mb-10 border-0" >
                                                    <div className="card-body p-2 text-center">
                                                        <div className="card-item-price">{tables.property.capacity}</div>
                                                        <img src={tableimage} height="100" width="130" alt="" />
                                                        <div className="card-item-price mb-1">{tables.property.tablename}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="pills-item-2" role="tabpanel" aria-labelledby="pills-item-2-tab">
                                    <div className="row card-item-gutters">
                                        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 d-flex">
                                            <div className="card white-box mb-10 border-0" >
                                                <img src="images/card-img.jpg" className="card-img-top" alt="" />
                                                <div className="card-body p-2">
                                                    <div className="card-item-title mb-1">Paneer Butter Masala</div>
                                                    <div className="card-item-price">₹230</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade " id="pills-item-3" role="tabpanel" aria-labelledby="pills-item-3-tab">
                                    <div className="row card-item-gutters">
                                        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 d-flex">
                                            <div className="card white-box mb-10 border-0" >
                                                <img src="images/card-img.jpg" className="card-img-top" alt="" />
                                                <div className="card-body p-2">
                                                    <div className="card-item-title mb-1">Paneer Handi</div>
                                                    <div className="card-item-price">₹250</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-5" >
                            <div className="white-box mb-3">
                                <div className="d-flex person-table-p">
                                    <div className="flex-grow-1 person-title"> Reservetd List</div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Table</th>
                                                <th >Customer Name</th>
                                                <th >Mobile</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Table 1</td>
                                                <td >Ravi Patel</td>
                                                <td >+91 1245789632</td>
                                                <td>10:20 AM</td>
                                            </tr>
                                            <tr>
                                                <td>Table 1</td>
                                                <td >Ravi Patel</td>
                                                <td >+91 1245789632</td>
                                                <td>10:20 AM</td>
                                            </tr>
                                            <tr>
                                                <td>Table 1</td>
                                                <td >Ravi Patel</td>
                                                <td >+91 1245789632</td>
                                                <td>10:20 AM</td>
                                            </tr>
                                            <tr>
                                                <td>Table 1</td>
                                                <td >Ravi Patel</td>
                                                <td >+91 1245789632</td>
                                                <td>10:20 AM</td>
                                            </tr>
                                            <tr>
                                                <td>Table 1</td>
                                                <td >Ravi Patel</td>
                                                <td >+91 1245789632</td>
                                                <td>10:20 AM</td>
                                            </tr>
                                            <tr>
                                                <td>Table 1</td>
                                                <td >Ravi Patel</td>
                                                <td >+91 1245789632</td>
                                                <td>10:20 AM</td>
                                            </tr>
                                            <tr>
                                                <td>Table 1</td>
                                                <td >Ravi Patel</td>
                                                <td >+91 1245789632</td>
                                                <td>10:20 AM</td>
                                            </tr>
                                            <tr>
                                                <td>Table 1</td>
                                                <td >Ravi Patel</td>
                                                <td >+91 1245789632</td>
                                                <td>10:20 AM</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TableBook