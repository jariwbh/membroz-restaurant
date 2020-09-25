import React, { Component } from 'react'
import { addicon } from '../components/Image';

export default class WaitingTable extends Component {
    render() {
        return (
            <React.Fragment>

                <div className="tab-pane fade show active" id="pills-waiting-1" role="tabpanel" aria-labelledby="pills-waiting-1-tab">
                    <div className="person-table-p">
                        <div className="table-num-title"> Waiting List</div>
                    </div>
                    <div className="d-flex align-items-center customer-name-p">
                        <div className="flex-grow-1">
                            <form className="form-inline">
                                <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                            </form>
                        </div>
                        <div className="table-num-title ml-3">
                            <a id="WaitingTablemodel" data-toggle="modal" data-target="#ForWaitingTable" data-keyboard="false" data-backdrop="static" href="/#"><img src={addicon} alt="" /></a>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Mobile No</th>
                                    <th>Time</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Manisha Patel (4) </td>
                                    <td>98251 12540</td>
                                    <td>10:00</td>
                                </tr>
                                <tr>
                                    <td>Kamal Sharma (3) </td>
                                    <td>97251 12500</td>
                                    <td>11:00</td>
                                </tr>
                                <tr>
                                    <td>Amit Jariwala (2) </td>
                                    <td>84251 12540</td>
                                    <td>12:00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal fade" id="ForWaitingTable" tabIndex="-1" role="dialog" aria-labelledby="WaitingTableCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="WaitingTableLongTitle">Book Waiting Table</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <input type="radio" id="existcustomer" name="customer" value="existcustomer" className="mr-1" defaultChecked />
                                    <label htmlFor="existcustomer" className="mr-3">Exist Customer</label>
                                    <input type="radio" id="newcustomer" name="customer" value="newcustomer" className="mr-1" />
                                    <label htmlFor="newcustomer" className="mr-3">New Customer</label>
                                </div>
                                <form className="container mt-3" method="post" id="waitingForm" name="waitingForm" >
                                    {/* {error && <div className="alert alert-danger">{error}</div>} */}
                                    <div className="form-group row">
                                        <label htmlFor="customer" className="col-sm-4 col-form-label">Customer<span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input className="form-control" type="text" placeholder="Customer" name='customer' id="customer" />
                                            {/* <span className="help-block">{validation.customer.message}</span> */}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="noofperson" className="col-sm-4 col-form-label">No of Person <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="number" name='noofperson' placeholder="Enter No of Person" className="form-control" id="noofperson" value='' />
                                            {/* <span className="help-block">{validation.noofperson.message}</span> */}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="mobilenumber" className="col-sm-4 col-form-label">Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text" name='mobile_number' placeholder="Enter Mobile Number" className="form-control" id="mobile_number" value='' />
                                            {/* <span className="help-block">{validation.mobile_number.message}</span> */}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="time" className="col-sm-4 col-form-label">Time <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" name='time' id="timeid" value='' />
                                            {/* <span className="help-block">{validation.time.message}</span> */}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="date" className="col-sm-4 col-form-label">Date <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" name='date' id="dateid" defaultValue='' />
                                            {/* <span className="help-block">{validation.date.message}</span> */}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary mr-auto" le='true' data-dismiss="modal" name="allocate" >Allocate</button>
                                <button type="button" className="btn btn-primary" le='true' data-dismiss="modal" name="save" >Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
