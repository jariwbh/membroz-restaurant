import React, { Component } from 'react'
import { addicon, deleteicon } from '../components/Image';
import * as WaitingTableApi from '../Api/WaitingTableServices';
import * as CustomerApi from '../Api/CustomerSevices';
import FormValidator from '../components/FormValidator';
import moment from 'moment'
import $ from 'jquery'
import SelectSearch from 'react-select-search';
import '../Assets/css/DropDownstyles.css'
import { CUSTOMERTYPES } from '../Pages/OrderEnums'

export default class WaitingTable extends Component {
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
                field: 'time',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter time.'
            },
        ]);

        this.state = {
            waitingTableList: [],
            customerList: [],
            selectedCustomerTypes: CUSTOMERTYPES.EXISTING,
            customerid: '',
            customername: '',
            noofperson: '',
            mobile_number: '',
            getcustomerid: '',
            disableCustomer: false,
            search: null,
            time: moment().format('LT'),
            date: moment().format('L'),
            validation: this.validator.valid(),
        }
        this.getWaitingTableList = this.getWaitingTableList.bind(this);
    }

    async getWaitingTableList() {
        WaitingTableApi.getWaitingTableList().then((response) => {
            this.setState({ waitingTableList: response.data })
        })
    }

    async getCustomerList() {
        CustomerApi.getCustomerList().then((response) => {
            this.setState({ customerList: response.data })
        })
    }

    async componentDidMount() {
        await this.getCustomerList();
        await this.getWaitingTableList()
    }

    onSearchCustomer = (event) => {
        let keyword = event.target.value;
        this.setState({ search: keyword })
    }

    modelPopupOpen() {
        var WaitingTableModel = document.getElementById("WaitingTableModel")
        WaitingTableModel.click();
    }

    modelPopupClose() {
        var modelclose = document.getElementById("modelclose")
        modelclose.click();
    }

    deleteWaitingTableById(id) {
        WaitingTableApi.deleteWaitingTableRecord(id).then(() => {
            this.getWaitingTableList()
        })
    }

    async onClose() {
        await this.setState({
            selectedCustomerTypes: CUSTOMERTYPES.EXISTING,
            customerid: '',
            customername: '',
            noofperson: '',
            mobile_number: '',
            getcustomerid: '',
            disableCustomer: false,
            date: moment().format('L'),
            time: moment().format('LT'),
            validation: this.validator.valid()
        });
    }

    getCustomerDetails = async (id) => {
        this.modelPopupOpen();
        const foundCustomer = this.state.waitingTableList.find(x => x._id === id)
        await this.setState({
            getcustomerid: foundCustomer._id,
            customerid: foundCustomer.property.customerid,
            customername: foundCustomer.property.customer,
            mobile_number: foundCustomer.property.mobile_number,
            noofperson: foundCustomer.property.noofperson,
            time: foundCustomer.property.time,
            date: moment(foundCustomer.property.date).format('L'),
            disableCustomer: true
        });
    }

    onChangeValue = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    onTableDropdownChange = event => {
        const target = event.target;
        const value = target.value;
        const tabledata = this.state.availabletableList.find(x => x._id === value)
        this.setState({
            tableid: tabledata._id,
            tablename: tabledata.property.tablename,
        });
    }

    onCustomerDropdownChange = value => {
        if (this.state.selectedCustomerTypes === CUSTOMERTYPES.EXISTING) {
            const foundCustomer = this.state.customerList.find(x => x._id === value)
            if (foundCustomer) {
                this.setState({
                    mobile_number: foundCustomer.property.mobile_number,
                    customername: foundCustomer.property.fullname,
                    customerid: foundCustomer._id,
                });
            }
        }
    }

    handleFormSubmit = () => {
        const { customername, mobile_number, noofperson, time, date, customerid, getcustomerid } = this.state;
        const validation = this.validator.validate(this.state);

        const customerObj = {
            property: {
                fullname: customername,
                mobile_number: mobile_number
            }
        }

        const waitingTableObj = {
            _id: getcustomerid,
            status: WaitingTableApi.activestatus,
            property: {
                status: WaitingTableApi.activestatus,
                customer: customername,
                customerid: customerid,
                mobile_number: mobile_number,
                noofperson: noofperson,
                time: time,
                date: date,
            },
            formid: WaitingTableApi.tableformid
        }

        this.setState({ validation });
        if (validation.isValid) {
            if (customerid === '') {
                CustomerApi.save(customerObj).then((response) => {
                    this.setState({ customerid: response.data._id })
                    if (response.data._id) {
                        waitingTableObj.property.customerid = response.data._id
                        WaitingTableApi.addWaitingTableRecord(waitingTableObj).then(() => {
                            this.getCustomerList();
                            this.getWaitingTableList();
                            this.modelPopupClose();
                            console.log('save');
                        })
                    }
                })
            } else if (getcustomerid === '') {
                WaitingTableApi.addWaitingTableRecord(waitingTableObj).then(() => {
                    this.getWaitingTableList();
                    this.modelPopupClose();
                    console.log('save exit records');
                })
            } else {
                WaitingTableApi.updateWaitingTableRecord(waitingTableObj).then(() => {
                    this.getWaitingTableList();
                    this.modelPopupClose();
                    console.log('update');
                })
            }
        }
    }

    render() {
        const validation = this.submitted ? this.validator.validate(this.state) : this.state.validation
        const { waitingTableList, customerList, selectedCustomerTypes, customerid, customername, noofperson, mobile_number, disableCustomer } = this.state;
        const getWaitingTableList = waitingTableList.filter((obj) => {
            if (this.state.search == null) { return (obj) }
            else if (obj.property.customer.toLowerCase().includes(this.state.search.toLowerCase()) ||
                obj.property.mobile_number.toLowerCase().includes(this.state.search.toLowerCase())
            ) { return (obj) }
        }).map(waitingtable =>
            <tr key={waitingtable._id} id={waitingtable._id} onDoubleClick={() => this.getCustomerDetails(waitingtable._id)} style={{ cursor: 'pointer' }}>
                <td >{waitingtable.property.customer}</td>
                <td>{waitingtable.property.noofperson}</td>
                <td >{waitingtable.property.mobile_number}</td>
                <td>{waitingtable.property.time}</td>
                <td><img src={deleteicon} alt="" style={{ cursor: 'pointer' }} onClick={() => this.deleteWaitingTableById(waitingtable._id)} /></td>
            </tr>
        )

        const customerDropdown1 = customerList.map(c => (
            {
                name: c.property.fullname,
                value: c._id
            }
        ))

        return (
            <React.Fragment>
                <div className="tab-pane fade" id="pills-waiting-1" role="tabpanel" aria-labelledby="pills-waiting-1-tab">
                    <div className="person-table-p">
                        <div className="table-num-title"> Waiting List</div>
                    </div>
                    <div className="d-flex align-items-center customer-name-p">
                        <div className="flex-grow-1">
                            <form className="form-inline">
                                <input className="form-control" type="search" onChange={(e) => this.onSearchCustomer(e)} placeholder="Search" aria-label="Search" />
                            </form>
                        </div>
                        <div className="table-num-title ml-3">
                            <a id="WaitingTableModel" data-toggle="modal" data-target="#ForWaitingTable" data-keyboard="false" data-backdrop="static" href="/#"><img src={addicon} alt="" /></a>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>No of person</th>
                                    <th>Mobile No</th>
                                    <th>Time</th>

                                </tr>
                            </thead>
                            <tbody>
                                {getWaitingTableList.length === 0 ?
                                    <tr>
                                        <td colSpan="5" className="text-center text-nowrap">Empty</td>
                                    </tr>
                                    :
                                    getWaitingTableList
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal fade" id="ForWaitingTable" tabIndex="-1" role="dialog" aria-labelledby="WaitingTableCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="WaitingTableLongTitle">Book Waiting Table</h5>
                                <button type="button" id="modelclose" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.onClose()}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <div className="container">
                                        <div className="container">
                                            <label className="mr-3">
                                                <input
                                                    type="radio"
                                                    id="existcustomer"
                                                    name="selectedCustomerTypes"
                                                    value={CUSTOMERTYPES.EXISTING}
                                                    checked={selectedCustomerTypes === CUSTOMERTYPES.EXISTING}
                                                    onChange={this.onChangeValue}
                                                    className="mr-1"
                                                    disabled={disableCustomer === true ? true : false}
                                                />
                                                    Exist Customer
                                            </label>
                                            <label className="mr-3">
                                                <input
                                                    type="radio"
                                                    id="newcustomer"
                                                    name="selectedCustomerTypes"
                                                    value={CUSTOMERTYPES.NEW}
                                                    checked={selectedCustomerTypes === CUSTOMERTYPES.NEW}
                                                    onChange={this.onChangeValue}
                                                    className="mr-1"
                                                    disabled={disableCustomer === true ? true : false}
                                                />
                                                    New Customer
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="container mt-3">
                                    <div className="form-group row">
                                        <label htmlFor="customer" className="col-sm-4 col-form-label">Customer<span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            {selectedCustomerTypes === CUSTOMERTYPES.EXISTING
                                                ?
                                                <SelectSearch
                                                    options={customerDropdown1}
                                                    value={customerid}
                                                    search
                                                    disabled={disableCustomer}
                                                    name="customername"
                                                    placeholder="Select Customer"
                                                    onChange={this.onCustomerDropdownChange} />
                                                :
                                                <input className="form-control"
                                                    type="text"
                                                    placeholder="Enter Customer"
                                                    name='customername'
                                                    id="customerid"
                                                    onChange={this.onChangeValue} />
                                            }
                                            <span className="help-block">{validation.customername.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="noofperson" className="col-sm-4 col-form-label">No of Person <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input
                                                type="number"
                                                name="noofperson"
                                                className="form-control"
                                                placeholder="Enter No of Person"
                                                min="1"
                                                value={noofperson}
                                                onChange={this.onChangeValue} />
                                            <span className="help-block">{validation.noofperson.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="mobilenumber" className="col-sm-4 col-form-label">Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                id="mobile_number"
                                                name="mobile_number"
                                                className="form-control"
                                                placeholder="Enter Mobile Number"
                                                value={mobile_number}
                                                onChange={this.onChangeValue}
                                                readOnly={disableCustomer === true ? true : false}
                                            />
                                            <span className="help-block">{validation.mobile_number.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="time" className="col-sm-4 col-form-label">Time <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text"
                                                className="form-control"
                                                name='time'
                                                id="time"
                                                value={this.state.time}
                                                onChange={this.onChangeValue} />
                                            <span className="help-block">{validation.time.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="date" className="col-sm-4 col-form-label">Date <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text"
                                                className="form-control"
                                                name='date' id="date"
                                                value={this.state.date}
                                                onChange={this.onChangeValue} />
                                            <span className="help-block">{validation.date.message}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" name="save" onClick={this.handleFormSubmit} >Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
