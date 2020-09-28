import React, { Component } from 'react'
import { addicon, deleteicon } from '../components/Image';
import * as WaitingTableApi from '../Api/WaitingTableServices';
import * as CustomerApi from '../Api/CustomerSevices';
import FormValidator from '../components/FormValidator';
import moment from 'moment'
import $ from 'jquery'

export default class WaitingTable extends Component {
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
            validation: this.validator.valid(),
            searchData: [],
            tablecheckedvalue: 'existcustomertable',
            waitingTableList: [],
            search: null,
            customerid: '',
            getcustomerid: '',
        }
        this.submitted = false;
        this.getWaitingTableList = this.getWaitingTableList.bind(this);
    }

    searchSpace = (event) => {
        let keyword = event.target.value;
        this.setState({ search: keyword })
    }

    deleteWaitingTableRecord(id) {
        WaitingTableApi.deleteWaitingTableRecord(id).then(() => {
            this.getWaitingTableList()
        })
    }

    resetForm() {
        document.getElementById('waitingForm').reset();
        document.getElementById('existcustomertable').checked = true;
        document.getElementById('mobile_numberid').removeAttribute('readonly');
        //document.getElementById('customerid').removeAttribute('readonly');
        document.getElementById("customerid").disabled = false;
        document.getElementById("existcustomertable").removeAttribute('disabled');
        document.getElementById("newcustomertable").removeAttribute('disabled');
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
            time: {
                isInvalid: false,
                message: ""
            }
        }

        this.setState({
            tablecheckedvalue: 'existcustomertable',
            mobile_number: '',
            noofperson: '',
            date: moment().format('L'),
            time: moment().format('LT'),
            validation: validator,
            getcustomerid: '',
            customerid: '',
        });
    }

    getCustomerDeatils = (id) => {
        $(function () {
            var WaitingTableModel = document.getElementById("WaitingTableModel")
            WaitingTableModel.click();
        });
        const customerdata = this.state.waitingTableList.find(x => x._id === id)
        this.setState({
            getcustomerid: customerdata._id,
            customerid: customerdata.property.customerid,
            customer: customerdata.property.customer,
            mobile_number: customerdata.property.mobile_number,
            noofperson: customerdata.property.noofperson,
            time: customerdata.property.time,
            date: moment(customerdata.property.date).format('L'),
        });
        document.getElementById('existcustomertable').checked = true;
        document.getElementById('mobile_numberid').setAttribute('readonly', true);
        document.getElementById("customerid").disabled = true;
        // document.getElementById('customerid').setAttribute('readonly', true);
        document.getElementById("existcustomertable").setAttribute('disabled', true);
        document.getElementById("newcustomertable").setAttribute('disabled', true);
    }

    handleInputChange = event => {
        //console.log(event);
        console.log(event.target.name);
        console.log(event.target.value);
        if (this.state.tablecheckedvalue === 'existcustomertable') {
            if (event.target.name === 'customer') {
                const customer = this.state.searchData.find(x => x._id === event.target.value)
                this.setState({
                    mobile_number: customer.property.mobile_number,
                    customer: customer.property.fullname,
                    customerid: customer._id,
                });
            } else {
                this.setState({
                    [event.target.name]: event.target.value
                });
            }
        } else {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    }

    handleFormSubmit = (event) => {
        const btnclickname = event.target.name;
        const { customer, mobile_number, noofperson, time, date, customerid, getcustomerid } = this.state;
        const customerObj = {
            property: {
                fullname: customer,
                mobile_number: mobile_number
            }
        }

        let waitingTableObj = {
            _id: getcustomerid,
            status: WaitingTableApi.activestatus,
            property: {
                status: WaitingTableApi.activestatus,
                customer: customer,
                customerid: customerid,
                mobile_number: mobile_number,
                noofperson: noofperson,
                time: time,
                date: date,
            },
            formid: WaitingTableApi.tableformid
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
                            waitingTableObj.property.customerid = response.data._id
                            WaitingTableApi.addWaitingTableRecord(waitingTableObj).then(() => {
                                this.getCustomerList();
                                this.getWaitingTableList();
                                this.resetForm();
                                console.log('save');
                            })
                        }
                    })
                } else if (getcustomerid === '') {
                    WaitingTableApi.addWaitingTableRecord(waitingTableObj).then(() => {
                        this.getWaitingTableList();
                        this.resetForm();
                        console.log('save exit records');
                    })
                } else {
                    WaitingTableApi.updateWaitingTableRecord(waitingTableObj).then(() => {
                        this.getWaitingTableList();
                        this.resetForm();
                        console.log('update');
                    })
                }
            }
        }
    }

    async componentDidMount() {
        await this.getCustomerList();
        await this.getWaitingTableList()
    }

    async getCustomerList() {
        return CustomerApi.getCustomerList()
            .then((response) => {
                this.setState({ searchData: response.data })
                return;
            }, (error) => {
                console.log("error", error);
            });
    }

    async getWaitingTableList() {
        return WaitingTableApi.getWaitingTableList()
            .then((response) => {
                this.setState({ waitingTableList: response.data })
                return;
            }, (error) => {
                console.log("error", error);
            })
    }

    render() {
        const validation = this.submitted ? this.validator.validate(this.state) : this.state.validation
        const { searchData, tablecheckedvalue, mobile_number, waitingTableList, noofperson } = this.state;
        const getWaitingTableList = waitingTableList.filter((obj) => {
            if (this.state.search == null) { return (obj) }
            else if (obj.property.customer.toLowerCase().includes(this.state.search.toLowerCase()) ||
                obj.property.mobile_number.toLowerCase().includes(this.state.search.toLowerCase())
            ) { return (obj) }
        }).map(waitingtableobj =>
            <tr key={waitingtableobj._id} id={waitingtableobj._id} onDoubleClick={() => this.getCustomerDeatils(waitingtableobj._id)} style={{ cursor: 'pointer' }}>
                <td >{waitingtableobj.property.customer}</td>
                <td>{waitingtableobj.property.noofperson}</td>
                <td >{waitingtableobj.property.mobile_number}</td>
                <td>{waitingtableobj.property.time}</td>
                <td><img src={deleteicon} alt="" style={{ cursor: 'pointer' }} onClick={() => this.deleteWaitingTableRecord(waitingtableobj._id)} /></td>
            </tr>
        )

        const handleradioOnChange = event => {
            this.setState({
                tablecheckedvalue: event.target.value
            });
        }

        return (
            <React.Fragment>
                <div className="tab-pane fade show active" id="pills-waiting-1" role="tabpanel" aria-labelledby="pills-waiting-1-tab">
                    <div className="person-table-p">
                        <div className="table-num-title"> Waiting List</div>
                    </div>
                    <div className="d-flex align-items-center customer-name-p">
                        <div className="flex-grow-1">
                            <form className="form-inline">
                                <input className="form-control" type="search" onChange={(e) => this.searchSpace(e)} placeholder="Search" aria-label="Search" />
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
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.resetForm()}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <input type="radio" id="existcustomertable" name="waiting" value="existcustomertable" className="mr-1" defaultChecked onChange={handleradioOnChange} />
                                    <label htmlFor="existcustomertable" className="mr-3">Exist Customer</label>
                                    <input type="radio" id="newcustomertable" name="waiting" value="newcustomertable" className="mr-1" onClick={handleradioOnChange} />
                                    <label htmlFor="newcustomertable" className="mr-3">New Customer</label>
                                </div>
                                <form className="container mt-3" method="post" id="waitingForm" name="waitingForm" >
                                    <div className="form-group row">
                                        <label htmlFor="customer" className="col-sm-4 col-form-label">Customer<span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            {tablecheckedvalue === 'existcustomertable'
                                                ?
                                                <select className="js-example-basic-single form-control" data-live-search="true" name='customer' id="customerid" value={this.state.customerid} data-live-search="true"
                                                    onChange={this.handleInputChange} style={{ width: '100%' }}>
                                                    {searchData.map(clientObj => (
                                                        <option key={clientObj._id} value={clientObj._id}>
                                                            {clientObj.property.fullname}
                                                        </option>
                                                    ))}
                                                </select>
                                                :
                                                <input className="form-control" type="text" placeholder="Customer" name='customer' id="customerid" onChange={this.handleInputChange} />
                                            }
                                            <span className="help-block">{validation.customer.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="noofperson" className="col-sm-4 col-form-label">No of Person <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="number" name='noofperson' placeholder="Enter No of Person" className="form-control" id="noofpersonid" value={noofperson} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.noofperson.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="mobilenumber" className="col-sm-4 col-form-label">Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text" name='mobile_number' placeholder="Enter Mobile Number" className="form-control" id="mobile_numberid" value={mobile_number} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.mobile_number.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="time" className="col-sm-4 col-form-label">Time <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" name='time' id="time" value={this.state.time} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.time.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="date" className="col-sm-4 col-form-label">Date <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" name='date' id="date" defaultValue={this.state.date} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.date.message}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
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
