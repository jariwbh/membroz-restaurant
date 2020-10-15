import React, { Component } from 'react'
import * as ReservedTableApi from '../Api/ReservedTableServices';
import { deleteicon, addicon, tableicon } from '../components/Image';
import { personicon } from '../components/Image';
import WaitingTable from '../components/WaitingTable'
import * as TableServicesApi from '../Api/TableServices';
import * as CustomerApi from '../Api/CustomerSevices';
import * as allocatedTableApi from '../Api/allocatedTableServices';
import FormValidator from '../components/FormValidator';
import moment from 'moment'
import SelectSearch from 'react-select-search';
import '../Assets/css/DropDownstyles.css'
import '../Assets/css/ErrorMessage.css'
import uuid from 'react-uuid'
import { CUSTOMERTYPES, ORDERTYPES, TABLESTATUS } from '../Pages/OrderEnums'

export default class TableBook extends Component {
    constructor(props) {
        super(props);
        console.log('props.tableList', props.tableList);
        console.log('props.runningOrders', props.runningOrders);
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
            reservedTableList: [],
            availabletableList: [],
            customerList: [],
            tableList: props.tableList,
            runningOrders: props.runningOrders,
            selectedCustomerType: CUSTOMERTYPES.EXISTING,
            onModel: '',
            customerid: '',
            customername: '',
            mobile_number: '',
            noofperson: '',
            tableid: '',
            tablename: '',
            getcustomerid: '',
            disableCustomer: false,
            search: null,
            checkedtableValue: null,
            tableType: "All",
            time: moment().format('LT'),
            date: moment().format('L'),
            validation: this.validator.valid(),
        }
    }

    getReservedTableList() {
        ReservedTableApi.getReservationTableList().then((response) => {
            this.setState({ reservedTableList: response.data })
        })
    }

    getCustomerList() {
        CustomerApi.getCustomerList().then((response) => {
            this.setState({ customerList: response.data })
        })
    }

    getAvailableTableList() {
        TableServicesApi.getTableList().then((response) => {
            this.setState({ availabletableList: response.data })
        })
    }

    componentDidMount() {
        this.getReservedTableList()
        this.getAvailableTableList()
        this.getCustomerList()
    }

    onSearchCustomer = (event) => {
        let keyword = event.target.value;
        this.setState({ search: keyword })
    }

    modelPopupOpen() {
        var ReservationTableModel = document.getElementById("ReservationTableModel")
        ReservationTableModel.click();
    }

    modelPopupClose() {
        var modelpopupClose1 = document.getElementById("modelpopupclose");
        modelpopupClose1.click();
    }

    deleteReservedTableById(id) {
        ReservedTableApi.deleteReservationTableRecord(id).then(() => {
            this.getReservedTableList()
        })
    }

    setTableType = (tableType) => {
        this.setState({ tableType: tableType });
    }


    onChangeValue = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    onCustomerDropdownChange = value => {
        if (this.state.selectedCustomerType === CUSTOMERTYPES.EXISTING) {
            const foundCustomer = this.state.customerList.find(x => x._id === value)
            if (foundCustomer) {
                this.setState({
                    onModel: foundCustomer.property.onModel,
                    customerid: foundCustomer._id,
                    customername: foundCustomer.property.fullname,
                    mobile_number: foundCustomer.property.mobile_number,
                    address: (foundCustomer.property.address === null ? '' : foundCustomer.property.address)
                });
            }
        }
    }

    onTableDropdownChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const tabledata = this.state.availabletableList.find(x => x._id === value)
        this.setState({
            tableid: tabledata._id,
            tablename: tabledata.property.tablename,
        });
    }

    async getCustomerDeatils(obj) {
        this.modelPopupOpen();
        const customerById = obj

        await this.setState({
            getcustomerid: customerById._id,
            customerid: customerById.property.customerid,
            customername: customerById.property.customer,
            mobile_number: customerById.property.mobile_number,
            noofperson: customerById.property.noofperson,
            time: customerById.property.time,
            date: moment(customerById.property.date).format('L'),
            tablename: customerById.property.table,
            tableid: customerById.property.tableid,
            disableCustomer: true
        });
        document.getElementById('existcustomer').checked = true;
        document.getElementById('mobile_number').setAttribute('readonly', true);
        document.getElementById("existcustomer").setAttribute('disabled', true);
        document.getElementById("newcustomer").setAttribute('disabled', true);
    }

    onClose = async () => {
        document.getElementById('mobile_number').removeAttribute('readonly');
        document.getElementById("existcustomer").removeAttribute('disabled');
        document.getElementById("newcustomer").removeAttribute('disabled');

        await this.setState({
            selectedCustomerType: CUSTOMERTYPES.EXISTING,
            onModel: '',
            customerid: '',
            customername: '',
            mobile_number: '',
            noofperson: '',
            tableid: '',
            tablename: '',
            getcustomerid: '',
            disableCustomer: false,
            checkedtableValue: null,
            time: moment().format('LT'),
            date: moment().format('L'),
            validation: this.validator.valid(),
        });
    }

    async clicktoSelectTableOpenModel(currentTableobj) {
        const checkedRunningTable = this.state.runningOrders.filter(x => x.postype === ORDERTYPES.DINEIN).find(x => x.tableid._id === currentTableobj._id)
        if (checkedRunningTable) {
            this.props.setCurrentCartHandler(checkedRunningTable)
        } else {
            this.modelPopupOpen();
            await this.setState({
                selectedCustomerType: CUSTOMERTYPES.EXISTING,
                customerid: '',
                customername: '',
                mobile_number: '',
                tableid: currentTableobj._id,
                tablename: currentTableobj.property.tablename,
                getcustomerid: '',
                time: this.state.time,
                date: this.state.date,
                checkedtableValue: currentTableobj
            });
            document.getElementById('existcustomer').checked = true;
        }
    }

    handleFormSubmit = (event) => {
        const { customername, mobile_number, noofperson, time, date, tablename, tableid, customerid, getcustomerid } = this.state;
        const btnclickname = event.target.name;
        let status

        if (btnclickname === "save") {
            status = ReservedTableApi.activestatus
        } else {
            status = ReservedTableApi.allocatedstatus
        }

        const newCustomerObj = {
            property: {
                fullname: customername,
                mobile_number: mobile_number
            }
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
            if (btnclickname === "save") {
                if (customerid === '') {
                    CustomerApi.save(newCustomerObj).then((response) => {
                        this.setState({ customerid: response.data._id })
                        if (response.data._id) {
                            reservationObj.property.customerid = response.data._id
                            ReservedTableApi.addReservationTableRecord(reservationObj).then(() => {
                                this.getCustomerList();
                                this.getReservedTableList();
                                this.modelPopupClose();
                                console.log('save');
                            })
                        }
                    })
                } else if (getcustomerid === '') {
                    console.log('save exit records');
                    ReservedTableApi.addReservationTableRecord(reservationObj).then(() => {
                        this.getReservedTableList();
                        this.modelPopupClose();
                    })
                } else {
                    console.log('update');
                    ReservedTableApi.updateReservationTableRecord(reservationObj).then(() => {
                        this.getReservedTableList();
                        this.modelPopupClose();
                    })
                }

            } else if (btnclickname === "allocate") {
                this.allocateTable(newCustomerObj, allocatedObj, reservationObj);
            }
        }
    }

    allocateTable(newCustomerObj, allocatedObj, reservationObj) {
        const { selectedCustomerType, onModel, noofperson, customerid, mobile_number, customername, tableid, tablename } = this.state;

        let orderObj = {
            _id: 'unsaved_' + uuid(),
            tableid: {
                _id: tableid, property: { tablename: tablename }
            },
            postype: 'dinein',
            property: { orderstatus: "running", noofperson: noofperson },
            customerid: {
                _id: customerid,
                property: {
                    fullname: customername,
                    mobile_number: mobile_number
                }
            },
            onModel: onModel,
            amount: 0,
            totalamount: 0,
            discount: 0,
            taxamount: 0,
            totalquantity: 0,
            items: [],
            deliveryaddress: ''
        }

        if (selectedCustomerType === CUSTOMERTYPES.EXISTING) {
            if (this.state.getcustomerid !== '') {
                this.setState({ submitted: true });
                allocatedTableApi.updateAllocateReservationTable(allocatedObj).then(() => {
                    this.modelPopupClose();
                    this.getReservedTableList();
                    this.props.setCurrentCartHandler(orderObj)
                    console.log('update allocated', allocatedObj);
                })
            } else {
                ReservedTableApi.addReservationTableRecord(reservationObj).then(() => {
                    this.modelPopupClose();
                    this.getReservedTableList();
                    this.props.setCurrentCartHandler(orderObj)
                    console.log('save exit records', reservationObj);
                })
            }
        } else {
            CustomerApi.save(newCustomerObj).then((response) => {
                this.setState({ customerid: response.data._id })
                if (response.data._id) {
                    allocatedObj.property.customerid = response.data._id
                    allocatedTableApi.allocateReservationTable(allocatedObj).then(() => {
                        this.modelPopupClose();
                        this.getCustomerList();
                        this.props.setCurrentCartHandler(orderObj)
                        this.getReservedTableList();
                        console.log('allocatedobj', allocatedObj)
                    })
                }
            })
        }
    }

    render() {
        const validation = this.submitted ? this.validator.validate(this.state) : this.state.validation
        const { selectedCustomerType, reservedTableList, availabletableList, customerList, mobile_number, noofperson, checkedtableValue } = this.state;
        const getReservedTableList = reservedTableList.filter((obj) => {
            if (this.state.search == null) { return (obj) }
            else if (obj.property.customer.toLowerCase().includes(this.state.search.toLowerCase()) ||
                obj.property.mobile_number.toLowerCase().includes(this.state.search.toLowerCase())
            ) { return (obj) }
        }).map(reservationtableobj =>
            <tr key={reservationtableobj._id} id={reservationtableobj._id} onDoubleClick={() => this.getCustomerDeatils(reservationtableobj)} style={{ cursor: 'pointer' }}>
                <td>{reservationtableobj.property.table}</td>
                <td >{reservationtableobj.property.customer}</td>
                <td>{reservationtableobj.property.noofperson}</td>
                <td >{reservationtableobj.property.mobile_number}</td>
                <td>{reservationtableobj.property.time}</td>
                <td><img src={deleteicon} alt="" style={{ cursor: 'pointer' }} onClick={() => this.deleteReservedTableById(reservationtableobj._id)} /></td>
            </tr>
        )

        const customerdropdown = customerList.map(x => (
            {
                name: x.property.fullname,
                value: x._id
            }
        ))

        return (
            <React.Fragment>
                <div id="layoutSidenav_content" >
                    <main>
                        <div className="container-fluid">
                            <div className="row table-item-gutters my-10">
                                <div className="col-xl-4 col-lg-4 col-md-5" >
                                    <div className="white-box mb-10 white-box-full" >
                                        <ul className="nav nav-pills categories-pills person-table-p d-flex justify-content-around" id="pills-tab-list" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link active" id="pills-reserved-2-tab" data-toggle="pill" href="#pills-reserved-2" role="tab" aria-controls="pills-reserved-2" aria-selected="false">Reserved List</a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link" id="pills-waiting-1-tab" data-toggle="pill" href="#pills-waiting-1" role="tab" aria-controls="pills-waiting-1" aria-selected="true">Waiting List</a>
                                            </li>
                                        </ul>
                                        <div className="tab-content categories-tab-content" id="pills-tabContent-list">
                                            <WaitingTable />
                                            <div className="tab-pane fade show active" id="pills-reserved-2" role="tabpanel" aria-labelledby="pills-reserved-2-tab">
                                                <div className="person-table-p">
                                                    <div className="table-num-title"> Reserved List</div>
                                                </div>
                                                <div className="d-flex align-items-center customer-name-p">
                                                    <div className="flex-grow-1">
                                                        <form className="form-inline">
                                                            <input className="form-control" type="search" onChange={(e) => this.onSearchCustomer(e)} placeholder="Search" aria-label="Search" />
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
                                                            {getReservedTableList.length === 0 ?
                                                                <tr>
                                                                    <td colSpan="5" className="text-center text-nowrap">Empty</td>
                                                                </tr>
                                                                :
                                                                getReservedTableList
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-8 col-md-7">
                                    <ul className="nav nav-pills mb-2 categories-pills table-no-pills" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link active" id="pills-table-1-tab" data-toggle="pill" href="#pills-table-1" role="tab" aria-controls="pills-table-1" aria-selected="true" onClick={() => this.setTableType("All")}>All</a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link" id="pills-table-2-tab" data-toggle="pill" href="#pills-table-2" role="tab" aria-controls="pills-table-2" aria-selected="true" onClick={() => this.setTableType(TABLESTATUS.OCCUPIED)}>Occupied <span className="table-status-tab occupied-bg"></span> </a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link " id="pills-table-3-tab" data-toggle="pill" href="#pills-table-3" role="tab" aria-controls="pills-table-3" aria-selected="true" onClick={() => this.setTableType(TABLESTATUS.BLANK)}>Blank <span className="table-status-tab blank-bg"></span></a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link " id="pills-table-4-tab" data-toggle="pill" href="#pills-table-4" role="tab" aria-controls="pills-table-4" aria-selected="true" onClick={() => this.setTableType(TABLESTATUS.NOSERVICE)}>No Service <span className="table-status-tab no-service-bg"></span></a>
                                        </li>
                                    </ul>

                                    <div className="tab-content categories-tab-content" id="pills-tabContent">
                                        <div className="tab-pane fade show active" id="pills-table-1" role="tabpanel" aria-labelledby="pills-table-1-tab">
                                            <div className="row card-item-gutters">
                                                {this.state.tableList.map(tableobj =>
                                                    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6" key={tableobj._id} id={tableobj._id} onClick={() => this.clicktoSelectTableOpenModel(tableobj)} style={{ cursor: 'pointer' }}>
                                                        <div className="card white-box mb-10 border-0 table-box-height occupied-bg"  >
                                                            <div className="card-body p-2 ">
                                                                <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">{tableobj.property.capacity}</span> </div>
                                                                <div className="d-flex justify-content-center align-items-center flex-column">
                                                                    <div className="table-number">{tableobj.property.tablename}</div>
                                                                    <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height blank-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height no-service-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height blank-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height no-service-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="pills-table-2" role="tabpanel" aria-labelledby="pills-table-2-tab">
                                            <div className="row card-item-gutters">
                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height occupied-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height occupied-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="pills-table-3" role="tabpanel" aria-labelledby="pills-table-3-tab">
                                            <div className="row card-item-gutters">
                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height blank-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height blank-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="pills-table-4" role="tabpanel" aria-labelledby="pills-table-4-tab">
                                            <div className="row card-item-gutters">
                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height no-service-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6">
                                                    <div className="card white-box mb-10 border-0 table-box-height no-service-bg"  >
                                                        <div className="card-body p-2 ">
                                                            <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">4</span> </div>
                                                            <div className="d-flex justify-content-center align-items-center flex-column">
                                                                <div className="table-number">01</div>
                                                                <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <div className="modal fade" id="ForReservationTable" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Book Reserved  Order</h5>
                                <button type="button" id="modelpopupclose" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.onClose()}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <div className="container">
                                        <label className="mr-3">
                                            <input
                                                type="radio"
                                                id="existcustomer"
                                                name="selectedCustomerType"
                                                value={CUSTOMERTYPES.EXISTING}
                                                checked={selectedCustomerType === CUSTOMERTYPES.EXISTING}
                                                onChange={this.onChangeValue}
                                                className="mr-1"
                                            />
                                    Exist Customer
                                </label>
                                        <label className="mr-3">
                                            <input
                                                type="radio"
                                                id="newcustomer"
                                                name="selectedCustomerType"
                                                value={CUSTOMERTYPES.NEW}
                                                checked={selectedCustomerType === CUSTOMERTYPES.NEW}
                                                onChange={this.onChangeValue}
                                                className="mr-1"
                                            />
                                    New Customer
                                </label>
                                    </div>
                                </div>
                                <div className="container mt-3">
                                    <div className="form-group row">
                                        <label htmlFor="customer" className="col-sm-4 col-form-label">Customer<span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            {selectedCustomerType === CUSTOMERTYPES.EXISTING
                                                ?
                                                <SelectSearch
                                                    options={customerdropdown}
                                                    value={this.state.customerid}
                                                    search
                                                    disabled={this.state.disableCustomer}
                                                    name="customer"
                                                    placeholder="Select Customer"
                                                    onChange={this.onCustomerDropdownChange} />
                                                :
                                                <input
                                                    type="text"
                                                    name="customername"
                                                    className="form-control"
                                                    placeholder="Enter Customer Name"
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
                                                onChange={this.onChangeValue} />
                                            <span className="help-block">{validation.mobile_number.message}</span>
                                        </div>
                                    </div>
                                    {checkedtableValue === null ?
                                        <div className="form-group row">
                                            <label htmlFor="time" className="col-sm-4 col-form-label">Time <span style={{ color: 'red' }}>*</span></label>
                                            <div className="col-sm-8">
                                                <input
                                                    type="text"
                                                    name="time"
                                                    className="form-control"
                                                    placeholder="Enter Time"
                                                    value={this.state.time}
                                                    onChange={this.onChangeValue} />
                                                <span className="help-block">{validation.time.message}</span>
                                            </div>
                                        </div>
                                        : ''}
                                    {checkedtableValue === null ?
                                        <div className="form-group row">
                                            <label htmlFor="date" className="col-sm-4 col-form-label">Date <span style={{ color: 'red' }}>*</span></label>
                                            <div className="col-sm-8">
                                                <input
                                                    type="text"
                                                    name="date"
                                                    className="form-control"
                                                    placeholder="Enter Date"
                                                    value={this.state.date}
                                                    onChange={this.onChangeValue} />
                                                <span className="help-block">{validation.date.message}</span>
                                            </div>
                                        </div>
                                        : ''}
                                    <div className="form-group row">
                                        <label htmlFor="table" className="col-sm-4 col-form-label">Table{selectedCustomerType === CUSTOMERTYPES.EXISTING ? <span style={{ color: 'red' }}>*</span> : ''}</label>
                                        <div className="col-sm-8">
                                            <select className="form-control" name="tablename" id="tableid" value={this.state.tableid}
                                                onChange={this.onTableDropdownChange} style={{ width: "100%" }}>
                                                {availabletableList.map(availableTable => (
                                                    <option key={availableTable._id} value={availableTable._id}>
                                                        {`${availableTable.property.tablename}` + ' ' + `(${availableTable.property.capacity})`}
                                                    </option>
                                                ))} </select>
                                            <span className="help-block">{validation.tablename.message}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className={checkedtableValue === null ? "btn btn-primary mr-auto" : "btn btn-primary"} name="allocate" onClick={this.handleFormSubmit} >Allocate</button>
                                {checkedtableValue === null ? <button type="button" className="btn btn-primary" name="save" onClick={this.handleFormSubmit} >Save</button> : ''}
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
