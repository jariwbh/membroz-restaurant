import React, { Component } from 'react'
import * as TableServicesApi from '../Api/TableServices';
import * as CustomerApi from '../Api/CustomerSevices';
import * as ReservedTableApi from '../Api/ReservedTableServices';
import * as allocatedTableApi from '../Api/allocatedTableServices';
import FormValidator from '../components/FormValidator';
import { deleteicon, addicon } from '../components/Image';
import moment from 'moment'
import $ from 'jquery'

export default class ReservedTable extends Component {
    constructor(props) {
        super(props);

        this.validator = new FormValidator([
            {
                field: 'customer',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter Customer Name.'
            },
            {
                field: 'mobile_number',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter Mobile No.'
            },
            {
                field: 'mobile_number',
                method: 'matches',
                args: [/^\(?\d\d\d\)? ?\d\d\d-?\d\d\d\d$/],
                validWhen: true,
                message: 'Enter valid Mobile No.'
            },
            {
                field: 'noofperson',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter no of person.'
            },
            {
                field: 'date',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter Date.'
            },
            {
                field: 'table',
                method: 'isEmpty',
                validWhen: false,
                message: 'select table.'
            },
            {
                field: 'time',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter time.'
            },
        ]);

        this.state = {
            customer: '',
            mobile_number: '',
            noofperson: '',
            time: moment().format('LT'),
            date: moment().format('L'),
            table: '',
            validation: this.validator.valid(),
            tableAvailableList: [],
            searchData: [],
            checkedvalue: 'existcustomer',
            reservationTableList: [],
            search: null,
            tableid: '',
            customerid: '',
            getcustomerid: '',
        }
        this.submitted = false;
        this.getReservationTableList = this.getReservationTableList.bind(this);
    }

    searchSpace = (event) => {
        let keyword = event.target.value;
        this.setState({ search: keyword })
    }

    getReservationTableList() {
        ReservedTableApi.getReservationTableList().then((response) => {
            this.setState({ reservationTableList: response.data })
        })
    }

    deleteReservationTableRecord(id) {
        ReservedTableApi.deleteReservationTableRecord(id).then(() => {
            this.getReservationTableList()
        })
    }

    handleInputChange = event => {
        console.log(event);
        if (this.state.checkedvalue === 'existcustomer') {
            if (event.target.name === 'customer') {
                const customer = this.state.searchData.find(x => x._id === event.target.value)
                this.setState({
                    mobile_number: customer.property.mobile_number,
                    customer: customer.property.fullname,
                    customerid: customer._id,
                });
            } else if (event.target.name === 'table') {
                const tabledata = this.state.tableAvailableList.find(x => x._id === event.target.value)
                this.setState({
                    tableid: tabledata._id,
                    table: tabledata.property.tablename
                });
            } else {
                this.setState({
                    [event.target.name]: event.target.value
                });
            }
        } else if (event.target.name === 'table') {
            const tabledata = this.state.tableAvailableList.find(x => x._id === event.target.value)
            this.setState({
                tableid: tabledata._id,
                table: tabledata.property.tablename
            });
        } else {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    }

    getCustomerDeatils = (id) => {
        $(function () {
            var mymodel = document.getElementById("mymodel")
            mymodel.click();
        });
        const customerdata = this.state.reservationTableList.find(x => x._id === id)
        console.log(id);
        this.setState({
            getcustomerid: customerdata._id,
            customerid: customerdata.property.customerid,
            customer: customerdata.property.customer,
            mobile_number: customerdata.property.mobile_number,
            noofperson: customerdata.property.noofperson,
            time: customerdata.property.time,
            date: moment(customerdata.property.date).format('L'),
            table: customerdata.property.table,
            tableid: customerdata.property.tableid
        });
        document.getElementById('existcustomer').checked = true;
        document.getElementById('mobile_number').setAttribute('readonly', true);
        document.getElementById('customer').setAttribute('readonly', true);

    }

    resetForm() {
        document.getElementById('reservationForm').reset();
        document.getElementById('existcustomer').checked = true;
        document.getElementById('mobile_number').removeAttribute('readonly');
        document.getElementById('customer').removeAttribute('readonly');

        const validator = {
            customer: {
                isInvalid: false,
                message: ""
            },
            date: {
                isInvalid: false,
                message: ""
            },
            isValid: true,
            mobile_number: {
                isInvalid: false,
                message: ""
            },
            noofperson: {
                isInvalid: false,
                message: ""
            },
            table: {
                isInvalid: false,
                message: ""
            },
            time: {
                isInvalid: false,
                message: ""
            }
        }

        this.setState({
            checkedvalue: 'existcustomer',
            mobile_number: '',
            noofperson: '',
            date: moment().format('L'),
            time: moment().format('LT'),
            validation: validator,
            getcustomerid: '',
            tableid: '',
            customerid: '',
        });
    }

    handleFormSubmit = (event) => {
        const btnclickname = event.target.name;
        const { customer, mobile_number, noofperson, time, date, table, tableid, customerid, getcustomerid } = this.state;
        const customerObj = {
            property: {
                fullname: customer,
                mobile_number: mobile_number
            }
        }

        let status
        if (btnclickname === "save") {
            status = ReservedTableApi.activestatus
        } else {
            status = ReservedTableApi.allocatedstatus
        }

        let reservationobj = {
            _id: getcustomerid,
            status: "active",
            property: {
                status: status,
                customer: customer,
                customerid: customerid,
                mobile_number: mobile_number,
                noofperson: noofperson,
                time: time,
                date: date,
                table: table,
                tableid: tableid,
            },
            formid: ReservedTableApi.tableformid
        }

        let allocatedobj = {
            _id: getcustomerid,
            formid: ReservedTableApi.tableformid,
            property: {
                status: status,
                customer: customer,
                customerid: customerid,
                mobile_number: mobile_number,
                noofperson: noofperson,
                date: date,
                table: table,
                tableid: tableid,
                time: time
            }
        }
        const validation = this.validator.validate(this.state);
        this.setState({ validation });
        if (validation.isValid) {
            this.setState({ submitted: true });
            if (btnclickname === "save") {
                if (getcustomerid === '') {
                    CustomerApi.addProspectsTableRecord(customerObj).then((response) => {
                        this.setState({ customerid: response.data._id })
                        if (response.data._id) {
                            console.log(response.data._id);
                            reservationobj.property.customerid = response.data._id
                            ReservedTableApi.addReservationTableRecord(reservationobj).then(() => {
                                this.getCustomerList();
                                this.getReservationTableList();
                                this.resetForm();
                                console.log('save');
                            })
                        }
                    })
                } else {
                    ReservedTableApi.updateReservationTableRecord(reservationobj).then(() => {
                        this.getReservationTableList();
                        this.resetForm();
                        console.log('update');
                    })
                }
            } else if (btnclickname === "allocate") {
                this.allocateTable(customerObj, allocatedobj);
            }
        }
    }

    allocateTable(customerObj, allocatedobj) {
        if (this.state.checkedvalue === 'existcustomer') {
            this.setState({ submitted: true });
            allocatedTableApi.updateAllocateTable(allocatedobj).then(() => {
                this.getReservationTableList();
                this.resetForm();
                console.log('update allocated', allocatedobj);
            })
        } else {
            CustomerApi.addProspectsTableRecord(customerObj).then((response) => {
                this.setState({ customerid: response.data._id })
                console.log('id', response.data._id);
                if (response.data._id) {
                    console.log(response.data._id);
                    allocatedobj.property.customerid = response.data._id
                    allocatedTableApi.allocateTable(allocatedobj).then(() => {
                        this.getCustomerList();
                        this.getReservationTableList();
                        this.resetForm();
                        console.log('allocatedobj', allocatedobj)
                        console.log('allocated');
                    })
                }
            }).catch(error => {
                console.error('There was an error!', error);
            });

        }
    }

    getCustomerList() {
        CustomerApi.getCustomerList().then((response) => {
            this.setState({ searchData: response.data })
        })
    }

    getAvailableTableList() {
        TableServicesApi.getTableList().then((response) => {
            this.setState({ tableAvailableList: response.data })
        })
    }

    componentDidMount() {
        this.getAvailableTableList()
        this.getCustomerList()
        this.getReservationTableList()
    }

    render() {
        const validation = this.submitted ? this.validator.validate(this.state) : this.state.validation
        const { error, tableAvailableList, searchData, checkedvalue, mobile_number, reservationTableList, noofperson } = this.state;
        const getReservationTableList = reservationTableList.filter((obj) => {
            if (this.state.search == null) { return (obj) }
            else if (obj.property.customer.toLowerCase().includes(this.state.search.toLowerCase()) ||
                obj.property.mobile_number.toLowerCase().includes(this.state.search.toLowerCase())
            ) { return (obj) }
        }).map(reservationlist =>
            <tr key={reservationlist._id} id={reservationlist._id} onDoubleClick={() => this.getCustomerDeatils(reservationlist._id)} style={{ cursor: 'pointer' }}>
                <td>{reservationlist.property.table}</td>
                <td >{reservationlist.property.customer}</td>
                <td>{reservationlist.property.noofperson}</td>
                <td >{reservationlist.property.mobile_number}</td>
                <td>{reservationlist.property.time}</td>
                <td><img src={deleteicon} alt="" style={{ cursor: 'pointer' }} onClick={() => this.deleteReservationTableRecord(reservationlist._id)} /></td>
            </tr>
        )

        const handleradioChange = event => {
            this.setState({
                checkedvalue: event.target.value
            });
        }

        return (
            <React.Fragment>
                <div className="tab-pane fade" id="pills-reserved-2" role="tabpanel" aria-labelledby="pills-reserved-2-tab">
                    <div className="person-table-p">
                        <div className="table-num-title"> Reserved List</div>
                    </div>
                    <div className="d-flex align-items-center customer-name-p">
                        <div className="flex-grow-1">
                            <form className="form-inline">
                                <input className="form-control" type="search" onChange={(e) => this.searchSpace(e)} placeholder="Search" aria-label="Search" />
                            </form>
                        </div>
                        <div className="table-num-title ml-3">
                            <a id="mymodel" data-toggle="modal" data-target="#ForReservationTable" data-keyboard="false" data-backdrop="static" href="/#"><img src={addicon} alt="" /></a>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Table</th>
                                    <th >Customer Name</th>
                                    <th>No of person</th>
                                    <th >Mobile</th>
                                    <th>Time</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {getReservationTableList.length === 0 ?
                                    <tr>
                                        <td colSpan="5" className="text-center text-nowrap">Empty</td>
                                    </tr>
                                    :
                                    getReservationTableList
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal fade" id="ForReservationTable" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Book Reserved  Order</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.resetForm()}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <input type="radio" id="existcustomer" name="customer" value="existcustomer" className="mr-1" defaultChecked onChange={handleradioChange} />
                                    <label htmlFor="existcustomer" className="mr-3">Exist Customer</label>
                                    <input type="radio" id="newcustomer" name="customer" value="newcustomer" className="mr-1" onClick={handleradioChange} />
                                    <label htmlFor="newcustomer" className="mr-3">New Customer</label>
                                </div>
                                <form className="container mt-3" method="post" id="reservationForm" name="reservationForm" onClick={this.handleFormSubmit}>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <div className="form-group row">
                                        <label htmlFor="customer" className="col-sm-4 col-form-label">Customer<span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            {checkedvalue === 'existcustomer'
                                                ?
                                                <select className="js-example-basic-single form-control" name='customer' id="customer" value={this.state.customerid}
                                                    onChange={this.handleInputChange} style={{ width: '100%' }}>
                                                    {searchData.map(client => (
                                                        <option key={client._id} value={client._id}>
                                                            {client.property.fullname}
                                                        </option>
                                                    ))}
                                                </select>
                                                :
                                                <input className="form-control" type="text" placeholder="Customer" name='customer' id="customer" onChange={this.handleInputChange}
                                                />
                                            }
                                            <span className="help-block">{validation.customer.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="noofperson" className="col-sm-4 col-form-label">No of Person <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="number" name='noofperson' placeholder="Enter No of Person" className="form-control" id="noofperson" value={noofperson} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.noofperson.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="mobilenumber" className="col-sm-4 col-form-label">Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text" name='mobile_number' placeholder="Enter Mobile Number" className="form-control" id="mobile_number" value={mobile_number} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.mobile_number.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="time" className="col-sm-4 col-form-label">Time <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" name='time' id="timeid" value={this.state.time} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.time.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="date" className="col-sm-4 col-form-label">Date <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" name='date' id="dateid" defaultValue={this.state.date} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.date.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="table" className="col-sm-4 col-form-label">Table
                                                    {checkedvalue === 'existcustomer' ? <span style={{ color: 'red' }}>*</span> : ''}
                                        </label>
                                        <div className="col-sm-8">
                                            <select className="js-example-basic-single form-control" name='table' id="tableid" value={this.state.tableid}
                                                onChange={this.handleInputChange} style={{ width: '100%' }}>
                                                {tableAvailableList.map(availableTable => (
                                                    <option key={availableTable._id} value={availableTable._id}>
                                                        {availableTable.property.tablename}
                                                    </option>
                                                ))} </select>
                                            <span className="help-block">{validation.table.message}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                {this.state.submitted === true ?
                                    <button type="button" className="btn btn-primary mr-auto" le='true' data-dismiss="modal" name="allocate" onClick={this.handleFormSubmit} >Allocate</button>
                                    :
                                    <button type="button" className="btn btn-primary mr-auto" name="allocate" onClick={this.handleFormSubmit} >Allocate</button>
                                }
                                {this.state.submitted === true ?
                                    <button type="button" className="btn btn-primary" le='true' data-dismiss="modal" name="save" onClick={this.handleFormSubmit} >Save</button>
                                    :
                                    <button type="button" className="btn btn-primary" name="save" onClick={this.handleFormSubmit} >Save</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
