import React, { Component } from 'react'
import * as TableServicesApi from '../Api/TableServices';
import * as CustomerApi from '../Api/CustomerSevices';
import * as ReservedTableApi from '../Api/ReservedTableServices';
import * as allocatedTableApi from '../Api/allocatedTableServices';
import FormValidator from '../components/FormValidator';
import { deleteicon, addicon } from '../components/Image';
import moment from 'moment'
import $ from 'jquery'
import SelectSearch from 'react-select-search';
import '../Assets/css/DropDownstyles.css'

export default class ReservedTable extends Component {
    constructor(props) {
        super(props);

        this.validator = new FormValidator([
            {
                field: 'customername',
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
                field: 'tablename',
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
            customername: '',
            mobile_number: '',
            noofperson: '',
            time: moment().format('LT'),
            date: moment().format('L'),
            tablename: '',
            validation: this.validator.valid(),
            tableAvailableList: [],
            searchData: [],
            checkedvalue: 'existcustomer',
            reservationTableList: [],
            search: null,
            tableid: '',
            customerid: '',
            getcustomerid: '',
            disableCustomer: false
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
        // console.log(event);
        if (this.state.checkedvalue === 'existcustomer') {
            if (event.target.name === 'tablename') {
                const tabledata = this.state.tableAvailableList.find(x => x._id === event.target.value)
                this.setState({
                    tableid: tabledata._id,
                    tablename: tabledata.property.tablename
                });
            } else {
                this.setState({
                    [event.target.name]: event.target.value
                });
            }
        }
        else {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    }

    handleChangeCustomerDropdown = event => {
        if (this.state.checkedvalue === 'existcustomer') {
            const customerFind = this.state.searchData.find(x => x._id === event)
            this.setState({
                mobile_number: customerFind.property.mobile_number,
                customername: customerFind.property.fullname,
                customerid: customerFind._id,
            });
        }
    }

    getCustomerDeatils = (id) => {
        $(function () {
            var ReservationTableModel = document.getElementById("ReservationTableModel")
            ReservationTableModel.click();
        });
        const customerobjById = this.state.reservationTableList.find(x => x._id === id)
        console.log(id);
        this.setState({
            getcustomerid: customerobjById._id,
            customerid: customerobjById.property.customerid,
            customername: customerobjById.property.customer,
            mobile_number: customerobjById.property.mobile_number,
            noofperson: customerobjById.property.noofperson,
            time: customerobjById.property.time,
            date: moment(customerobjById.property.date).format('L'),
            tablename: customerobjById.property.table,
            tableid: customerobjById.property.tableid,
            disableCustomer: true
        });
        document.getElementById('existcustomer').checked = true;
        document.getElementById('mobile_number').setAttribute('readonly', true);
        //document.getElementById('customer').setAttribute('readonly', true);
        //document.getElementById("customer").disabled = true;
        document.getElementById("existcustomer").setAttribute('disabled', true);
        document.getElementById("newcustomer").setAttribute('disabled', true);
    }

    resetForm() {
        document.getElementById('reservationForm').reset();
        document.getElementById('existcustomer').checked = true;
        document.getElementById('mobile_number').removeAttribute('readonly');
        //document.getElementById("customer").disabled = false;
        //document.getElementById('customer').removeAttribute('readonly');
        document.getElementById("existcustomer").removeAttribute('disabled');
        document.getElementById("newcustomer").removeAttribute('disabled');

        const validator = {
            customername: {
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
            tablename: {
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
            submitted: false,
            disableCustomer: false
        });
    }

    modelPopupClose() {
        var modelpopupClose = document.getElementById("modelpopupclose")
        modelpopupClose.click();
    }

    handleFormSubmit = (event) => {
        const btnclickname = event.target.name;
        const { customername, mobile_number, noofperson, time, date, tablename, tableid, customerid, getcustomerid } = this.state;
        const customerObj = {
            property: {
                fullname: customername,
                mobile_number: mobile_number
            }
        }

        let status
        if (btnclickname === "save") {
            status = ReservedTableApi.activestatus
        } else {
            status = ReservedTableApi.allocatedstatus
        }

        let reservationObj = {
            _id: getcustomerid,
            status: ReservedTableApi.activestatus,
            property: {
                status: status,
                customer: customername,
                customerid: customerid,
                mobile_number: mobile_number,
                noofperson: noofperson,
                time: time,
                date: date,
                table: tablename,
                tableid: tableid,
            },
            formid: ReservedTableApi.tableformid
        }

        let allocatedObj = {
            _id: getcustomerid,
            formid: ReservedTableApi.tableformid,
            property: {
                status: status,
                customer: customername,
                customerid: customerid,
                mobile_number: mobile_number,
                noofperson: noofperson,
                date: date,
                table: tablename,
                tableid: tableid,
                time: time
            }
        }

        const validation = this.validator.validate(this.state);
        this.setState({ validation });
        if (validation.isValid) {
            this.setState({ submitted: true });
            if (btnclickname === "save") {
                if (customerid === '') {
                    CustomerApi.addProspectsTableRecord(customerObj).then((response) => {
                        this.setState({ customerid: response.data._id })
                        if (response.data._id) {
                            console.log(response.data._id);
                            reservationObj.property.customerid = response.data._id
                            ReservedTableApi.addReservationTableRecord(reservationObj).then(() => {
                                this.getCustomerList();
                                this.getReservationTableList();
                                this.modelPopupClose();
                                console.log('save');
                            })
                        }
                    })
                } else if (getcustomerid === '') {
                    console.log('save exit records');
                    ReservedTableApi.addReservationTableRecord(reservationObj).then(() => {
                        this.getReservationTableList();
                        this.modelPopupClose();
                    })
                } else {
                    console.log('customerid', customerid);
                    console.log('update');
                    ReservedTableApi.updateReservationTableRecord(reservationObj).then(() => {
                        this.getReservationTableList();
                        this.modelPopupClose();
                    })
                }

            } else if (btnclickname === "allocate") {
                this.allocateTable(customerObj, allocatedObj, reservationObj);
            }
        }
    }

    allocateTable(customerObj, allocatedObj, reservationObj) {
        if (this.state.checkedvalue === 'existcustomer') {
            if (this.state.getcustomerid !== '') {
                console.log('update allocated', allocatedObj);
                this.setState({ submitted: true });
                allocatedTableApi.updateAllocateReservationTable(allocatedObj).then(() => {
                    this.getReservationTableList();
                    this.modelPopupClose();
                    console.log('update allocated', allocatedObj);
                })
            } else {
                console.log('save exit records');
                ReservedTableApi.addReservationTableRecord(reservationObj).then(() => {
                    this.getReservationTableList();
                    this.modelPopupClose();
                    console.log('update allocated', reservationObj);
                })
            }
        } else {
            CustomerApi.addProspectsTableRecord(customerObj).then((response) => {
                this.setState({ customerid: response.data._id })
                console.log('id', response.data._id);
                if (response.data._id) {
                    console.log(response.data._id);
                    allocatedObj.property.customerid = response.data._id
                    allocatedTableApi.allocateReservationTable(allocatedObj).then(() => {
                        this.getCustomerList();
                        this.getReservationTableList();
                        this.modelPopupClose();
                        console.log('allocatedobj', allocatedObj)
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
        const { error, tableAvailableList, searchData, checkedvalue, mobile_number, reservationTableList, noofperson, submitted } = this.state;
        const getReservationTableList = reservationTableList.filter((obj) => {
            if (this.state.search == null) { return (obj) }
            else if (obj.property.customer.toLowerCase().includes(this.state.search.toLowerCase()) ||
                obj.property.mobile_number.toLowerCase().includes(this.state.search.toLowerCase())
            ) { return (obj) }
        }).map(reservationtableobj =>
            <tr key={reservationtableobj._id} id={reservationtableobj._id} onDoubleClick={() => this.getCustomerDeatils(reservationtableobj._id)} style={{ cursor: 'pointer' }}>
                <td>{reservationtableobj.property.table}</td>
                <td >{reservationtableobj.property.customer}</td>
                <td>{reservationtableobj.property.noofperson}</td>
                <td >{reservationtableobj.property.mobile_number}</td>
                <td>{reservationtableobj.property.time}</td>
                <td><img src={deleteicon} alt="" style={{ cursor: 'pointer' }} onClick={() => this.deleteReservationTableRecord(reservationtableobj._id)} /></td>
            </tr>
        )

        const handleradioChange = event => {
            this.setState({
                checkedvalue: event.target.value
            });
        }

        const customerdropdown = searchData.map(clientObj => (
            {
                name: clientObj.property.fullname,
                value: clientObj._id
            }
        ))

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
                            <a id="ReservationTableModel" data-toggle="modal" data-target="#ForReservationTable" data-keyboard="false" data-backdrop="static" href="/#"><img src={addicon} alt="" /></a>
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
                                <button type="button" id="modelpopupclose" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.resetForm()}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <input type="radio" id="existcustomer" name="Reserved" value="existcustomer" className="mr-1" defaultChecked onChange={handleradioChange} />
                                    <label htmlFor="existcustomer" className="mr-3">Exist Customer</label>
                                    <input type="radio" id="newcustomer" name="Reserved" value="newcustomer" className="mr-1" onClick={handleradioChange} />
                                    <label htmlFor="newcustomer" className="mr-3">New Customer</label>
                                </div>
                                <form className="container mt-3" method="post" id="reservationForm" name="reservationForm" onClick={this.handleFormSubmit}>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <div className="form-group row">
                                        <label htmlFor="customer" className="col-sm-4 col-form-label">Customer<span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            {checkedvalue === 'existcustomer'
                                                ?
                                                <SelectSearch
                                                    options={customerdropdown}
                                                    value={this.state.customerid}
                                                    search
                                                    disabled={this.state.disableCustomer}
                                                    name="customer"
                                                    placeholder="Select Customer"
                                                    onChange={this.handleChangeCustomerDropdown} />
                                                :
                                                <input className="form-control" type="text" placeholder="Enter Customer Name" name='customername' id="customer" onChange={this.handleInputChange} />
                                            }
                                            <span className="help-block">{validation.customername.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="noofperson" className="col-sm-4 col-form-label">No of Person <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="number" name='noofperson' placeholder="Enter No of Person" min="1" className="form-control" id="noofperson" value={noofperson} onChange={this.handleInputChange} />
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
                                            <select className="js-example-basic-single form-control" name='tablename' id="tableid" value={this.state.tableid}
                                                onChange={this.handleInputChange} style={{ width: '100%' }}>
                                                {tableAvailableList.map(availableTable => (
                                                    <option key={availableTable._id} value={availableTable._id}>
                                                        {`${availableTable.property.tablename}` + ' ' + `(${availableTable.property.capacity})`}
                                                    </option>
                                                ))} </select>
                                            <span className="help-block">{validation.tablename.message}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                {submitted === true ?
                                    <button type="button" className="btn btn-primary mr-auto" le='true' data-dismiss="modal" name="allocate" onClick={this.handleFormSubmit} >Allocate</button>
                                    :
                                    <button type="button" className="btn btn-primary mr-auto" name="allocate" onClick={this.handleFormSubmit} >Allocate</button>
                                }
                                {submitted === true ?
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
