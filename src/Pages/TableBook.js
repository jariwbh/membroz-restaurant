import React, { Component } from 'react'
import * as ReservedTableApi from '../Api/ReservedTableServices';
import { deleteicon, addicon, tableicon } from '../components/Image';
import { personicon } from '../components/Image';
import WaitingTable from '../components/WaitingTable'
import * as TableServicesApi from '../Api/TableServices';
import * as CustomerApi from '../Api/CustomerSevices';
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
            customerList: [],
            tableList: props.tableList,
            searchText: null,
            selectedTableStatus: TABLESTATUS.ALL,
            runningOrders: props.runningOrders,
            selectedCustomerType: CUSTOMERTYPES.EXISTING,
            selectedReservedTableid: "",
            onModel: "",
            customerid: "",
            customername: "",
            mobile_number: "",
            noofperson: 1,
            tableid: "",
            tablename: "",
            time: moment().format('LT'),
            date: moment().format('L'),
            selectedTable: null,
            validation: this.validator.valid()
        }
        this.showPopupModel = this.showPopupModel.bind(this);
    }

    getReservedTableList() {
        ReservedTableApi.getList().then((response) => {
            this.setState({ reservedTableList: response.data })
        })
    }

    getCustomerList() {
        CustomerApi.getCustomerList().then((response) => {
            this.setState({ customerList: response.data })
        })
    }

    componentDidMount() {
        this.getReservedTableList()
        this.getCustomerList()
    }

    onSearchCustomer = (event) => {
        let keyword = event.target.value;
        this.setState({ searchText: keyword })
    }

    modelPopupClose() {
        var modelpopupClose = document.getElementById("modelpopupclose");
        modelpopupClose.click();
    }

    deleteReservedTableById(id) {
        ReservedTableApi.deleteById(id).then(() => {
            this.getReservedTableList()
        })
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
                    address: (foundCustomer.property.address ? foundCustomer.property.address : "")
                });
            }
        }
    }

    onTableDropdownChange = event => {
        const target = event.target;
        const value = target.value;
        const tabledata = this.state.tableList.find(x => x._id === value)
        this.setState({
            tableid: tabledata._id,
            tablename: tabledata.property.tablename,
        });
    }

    showPopupModel = async (table, reservedTable) => {
        console.log('reservedTable', reservedTable);
        console.log('table', table);

        if (table) {
            const checkedRunningTable = this.state.runningOrders.filter(x => x.postype === ORDERTYPES.DINEIN).find(x => x.tableid._id === table._id)
            if (checkedRunningTable) {
                this.props.setCurrentCartHandler(checkedRunningTable)
                return;
            } else {
                await this.setState({
                    selectedCustomerType: CUSTOMERTYPES.EXISTING,
                    selectedReservedTableid: "",
                    onModel: "",
                    customerid: "",
                    customername: "",
                    mobile_number: "",
                    noofperson: 1,
                    tableid: table._id,
                    tablename: table.property.tablename,
                    time: this.state.time,
                    date: this.state.date,
                    selectedTable: table,
                    validation: this.validator.valid()
                });
            }
        }

        if (reservedTable) {
            await this.setState({
                selectedCustomerType: CUSTOMERTYPES.EXISTING,
                selectedReservedTableid: reservedTable._id,
                onModel: reservedTable.property.onModel,
                customerid: reservedTable.property.customerid,
                customername: reservedTable.property.customer,
                mobile_number: reservedTable.property.mobile_number,
                noofperson: reservedTable.property.noofperson,
                tableid: reservedTable.property.tableid,
                tablename: reservedTable.property.table,
                time: reservedTable.property.time,
                date: moment(reservedTable.property.date).format('L'),
                selectedTable: null,
                validation: this.validator.valid()
            });
        }

        if (!table && !reservedTable) {
            this.setState({
                selectedCustomerType: CUSTOMERTYPES.EXISTING,
                selectedReservedTableid: "",
                onModel: "",
                customerid: "",
                customername: "",
                mobile_number: "",
                noofperson: 1,
                tableid: "",
                tablename: "",
                time: moment().format('LT'),
                date: moment().format('L'),
                selectedTable: null,
                validation: this.validator.valid()
            });
        }
        var modelPopup = document.getElementById("tableBookPopupHandler")
        modelPopup.click();
    }

    handleFormSubmit = async (event) => {
        const validation = this.validator.validate(this.state);
        this.setState({ validation });
        if (!validation.isValid) {
            return;
        }

        let { selectedReservedTableid, selectedCustomerType, onModel, customerid, customername, mobile_number, noofperson, tableid, tablename, time, date } = this.state;
        const btnclickname = event.target.name;
        let status


        if (btnclickname === "save") {
            status = ReservedTableApi.RESERVEDTABLESTATUS.ACTIVE
        } else {
            status = ReservedTableApi.RESERVEDTABLESTATUS.ALLOCATED
        }
        if (selectedCustomerType === CUSTOMERTYPES.NEW) {
            const newCustomerObj = {
                property: {
                    fullname: customername,
                    mobile_number: mobile_number
                }
            }

            const response = await CustomerApi.save(newCustomerObj)
            if (response.status === 200 && !response.data.errors) {
                customerid = response.data._id;
                onModel = "Prospect";
                await this.setState({ customerid: customerid, onModel: onModel })
                this.getCustomerList();
            } else {
                console.log('Save Customer ERROR', response.data.errors)
                alert("Save Customer ERROR : " + response.data.errors.toString())
                return;
            }
        }

        const reservedTable = {
            _id: selectedReservedTableid,
            formid: ReservedTableApi.tableformid,
            status: ReservedTableApi.RESERVEDTABLESTATUS.ACTIVE,
            property: {
                onModel: onModel,
                status: status,
                customer: customername,
                customerid: customerid,
                mobile_number: mobile_number,
                noofperson: noofperson,
                time: time,
                date: date,
                table: tablename,
                tableid: tableid,
            }
        }

        const response = await ReservedTableApi.save(reservedTable)
        console.log("reservedTable save", reservedTable);
        if (response.status === 200 && !response.data.errors) {
            this.getReservedTableList();
        } else {
            console.log('Save Reserved Table ERROR', response.data.errors)
            alert("Save Reserved Table  ERROR : " + response.data.errors.toString())
            return;
        }

        this.modelPopupClose();

        if (btnclickname === "allocate") {
            this.allocateTable();
        }
    }

    allocateTable() {
        const { onModel, noofperson, customerid, mobile_number, customername, tableid, tablename } = this.state;
        const order = {
            _id: "unsaved_" + uuid(),
            tableid: {
                _id: tableid, property: { tablename: tablename }
            },
            postype: ORDERTYPES.DINEIN,
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
            deliveryaddress: ""
        }
        console.log('allocated order', order);
        this.props.setCurrentCartHandler(order)
    }

    setSelectedTableType = (tableStatus) => {
        this.setState({ selectedTableStatus: tableStatus });
    }

    renderTable = (props) => {
        const table = props.table;
        const { selectedTableStatus } = this.state;

        if (selectedTableStatus !== TABLESTATUS.ALL) {
            if (table.tableStatus === TABLESTATUS.OCCUPIED && selectedTableStatus !== TABLESTATUS.OCCUPIED) {
                return null
            }
            if (table.tableStatus === TABLESTATUS.BLANK && selectedTableStatus !== TABLESTATUS.BLANK) {
                return null
            }
            if (table.tableStatus === TABLESTATUS.NOSERVICE && selectedTableStatus !== TABLESTATUS.NOSERVICE) {
                return null
            }
        }

        let tableStatusClass = "occupied-bg"
        switch (table.tableStatus) {
            case TABLESTATUS.OCCUPIED:
                tableStatusClass = "occupied-bg";
                break;
            case TABLESTATUS.BLANK:
                tableStatusClass = "blank-bg";
                break;
            case TABLESTATUS.NOSERVICE:
                tableStatusClass = "no-service-bg";
                break;
        }

        return (<div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6" key={table._id} id={table._id} onClick={table.tableStatus === TABLESTATUS.NOSERVICE ? null : () => this.showPopupModel(table, undefined)} style={{ cursor: 'pointer' }}>
            <div className={`card white-box mb-10 border-0 table-box-height ${tableStatusClass}`}>
                <div className="card-body p-2 ">
                    <div className="d-flex justify-content-end"><img src={personicon} alt="" /> <span className="table-person-title ml-2">{table.property.capacity}</span> </div>
                    <div className="d-flex justify-content-center align-items-center flex-column">
                        <div className="table-number">{table.property.tablename}</div>
                        <div ><img src={tableicon} alt="" className="img-fluid" /> </div>
                    </div>
                </div>
            </div>
        </div>)
    }

    render() {
        const validation = this.submitted ? this.validator.validate(this.state) : this.state.validation
        const { reservedTableList, customerList, tableList, runningOrders, selectedCustomerType, selectedReservedTableid, mobile_number, noofperson, tableid, selectedTable } = this.state;

        const renderReservedTableList = reservedTableList.filter((obj) => {
            if (this.state.searchText == null) { return (obj) }
            else if (obj.property.customer.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                obj.property.mobile_number.toLowerCase().includes(this.state.searchText.toLowerCase())
            ) { return (obj) }
        }).map(reservedTable =>
            <tr key={reservedTable._id} id={reservedTable._id} onDoubleClick={() => this.showPopupModel(undefined, reservedTable)} style={{ cursor: 'pointer' }}>
                <td>{reservedTable.property.table}</td>
                <td >{reservedTable.property.customer}</td>
                <td>{reservedTable.property.noofperson}</td>
                <td >{reservedTable.property.mobile_number}</td>
                <td>{reservedTable.property.time}</td>
                <td><img src={deleteicon} alt="" style={{ cursor: 'pointer' }} onClick={() => this.deleteReservedTableById(reservedTable._id)} /></td>
            </tr>
        )

        const customerdropdown = customerList.map(x => (
            {
                name: x.property.fullname,
                value: x._id
            }
        ))

        let tableListWithStatus = []
        tableList.forEach(table => {
            let runningOrder = runningOrders.find(x => x.tableid && x.tableid._id === table._id)
            let tableStatus = TABLESTATUS.BLANK
            if (runningOrder) {
                tableStatus = TABLESTATUS.OCCUPIED
            } else {
                if (table.status === TABLESTATUS.NOSERVICE) {
                    tableStatus = TABLESTATUS.NOSERVICE
                } else {
                    tableStatus = TABLESTATUS.BLANK
                }
            }

            tableListWithStatus.push({ ...table, tableStatus: tableStatus })
        });

        const renderTableList = tableListWithStatus.map((table) =>
            <this.renderTable key={table._id} table={table}></this.renderTable>
        );

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
                                                        <a href="/#"><img src={addicon} alt="" onClick={() => this.showPopupModel()} /></a>
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
                                                            {renderReservedTableList.length === 0 ?
                                                                <tr>
                                                                    <td colSpan="5" className="text-center text-nowrap">Empty</td>
                                                                </tr>
                                                                :
                                                                renderReservedTableList
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
                                            <a className="nav-link active" id="pills-table-1-tab" data-toggle="pill" href="#pills-table-1" role="tab" aria-controls="pills-table-1" aria-selected="true" onClick={() => this.setSelectedTableType(TABLESTATUS.ALL)}>All</a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link" id="pills-table-2-tab" data-toggle="pill" href="#pills-table-2" role="tab" aria-controls="pills-table-2" aria-selected="true" onClick={() => this.setSelectedTableType(TABLESTATUS.OCCUPIED)}>Occupied <span className="table-status-tab occupied-bg"></span> </a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link " id="pills-table-3-tab" data-toggle="pill" href="#pills-table-3" role="tab" aria-controls="pills-table-3" aria-selected="true" onClick={() => this.setSelectedTableType(TABLESTATUS.BLANK)}>Blank <span className="table-status-tab blank-bg"></span></a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link " id="pills-table-4-tab" data-toggle="pill" href="#pills-table-4" role="tab" aria-controls="pills-table-4" aria-selected="true" onClick={() => this.setSelectedTableType(TABLESTATUS.NOSERVICE)}>No Service <span className="table-status-tab no-service-bg"></span></a>
                                        </li>
                                    </ul>

                                    <div className="tab-content categories-tab-content" id="pills-tabContent">
                                        <div className="tab-pane fade show active" id="pills-table-1" role="tabpanel" aria-labelledby="pills-table-1-tab">
                                            <div className="row card-item-gutters">
                                                {renderTableList}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <span id="tableBookPopupHandler" data-toggle="modal" data-target="#tableBookPopup" data-keyboard="false" data-backdrop="static" />
                <div className="modal fade" id="tableBookPopup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Book Reserved  Order</h5>
                                <button type="button" id="modelpopupclose" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
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
                                            disabled={selectedReservedTableid !== "" ? true : false}
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
                                            disabled={selectedReservedTableid !== "" ? true : false}
                                        />
                                    New Customer
                                </label>
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
                                                    name="customer"
                                                    placeholder="Select Customer"
                                                    onChange={this.onCustomerDropdownChange}
                                                    disabled={selectedReservedTableid !== "" ? true : false}
                                                />
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
                                                onChange={this.onChangeValue}
                                                readOnly={selectedReservedTableid !== "" ? true : false}
                                            />
                                            <span className="help-block">{validation.mobile_number.message}</span>
                                        </div>
                                    </div>
                                    {selectedTable === null &&
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
                                    }
                                    {selectedTable === null &&
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
                                    }
                                    <div className="form-group row">
                                        <label htmlFor="table" className="col-sm-4 col-form-label">Table{selectedCustomerType === CUSTOMERTYPES.EXISTING && <span style={{ color: 'red' }}>*</span>}</label>
                                        <div className="col-sm-8">
                                            <select className="form-control" name="tablename" id="tableid" value={tableid || ''}
                                                onChange={this.onTableDropdownChange} style={{ width: "100%" }}>
                                                {tableList.map(table => (
                                                    <option key={table._id} value={table._id}>
                                                        {`${table.property.tablename}` + ' ' + `(${table.property.capacity})`}
                                                    </option>
                                                ))} </select>
                                            <span className="help-block">{validation.tablename.message}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className={selectedTable === null ? "btn btn-primary mr-auto" : "btn btn-primary"} name="allocate" onClick={this.handleFormSubmit} >Allocate</button>
                                {selectedTable === null &&
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
