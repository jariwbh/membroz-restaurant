import React, { Component } from 'react'
import FormValidator from '../components/FormValidator';
import SelectSearch from 'react-select-search';
import * as CustomerApi from '../Api/CustomerSevices';
import * as UserApi from '../Api/UserServices'

export default class TakeOrderPopup extends Component {
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
                field: 'address',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter Address.'
            },
            {
                field: 'deliveryboyname',
                method: 'isEmpty',
                validWhen: false,
                message: 'Select Delivery Boy.'
            },
            {
                field: 'noofperson',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter no of person.'
            },
        ]);

        this.state = {
            customerid: '',
            customername: '',
            mobile_number: '',
            address: '',
            deliveryboyid: '',
            deliveryboyname: '',
            validation: this.validator.valid(),
            checkedvalue: 'existcustomer',
            deliveryboyList: [],
            customerList: [],
            tableobj: [],
            customerobj: [],
            getcustomerid: '',
            noonoofperson: ''
        }

    }

    handleInputChange = event => {
        if (this.state.checkedvalue === 'existcustomer') {
            if (event.target.name === 'deliveryboyname') {
                const deliveryboynameobj = this.state.deliveryboyList.find(x => x._id === event.target.value)
                this.setState({
                    deliveryboyid: deliveryboynameobj._id,
                    deliveryboyname: deliveryboynameobj.property.fullname
                });
            } else {
                this.setState({
                    [event.target.name]: event.target.value
                });
            }
        } else {
            if (event.target.name === 'deliveryboyname') {
                const deliveryboynameobj = this.state.deliveryboyList.find(x => x._id === event.target.value)
                this.setState({
                    deliveryboyid: deliveryboynameobj._id,
                    deliveryboyname: deliveryboynameobj.property.fullname
                });
            } else {
                this.setState({
                    [event.target.name]: event.target.value
                });
            }
        }
    }

    modelPopupClose() {
        var modelclose = document.getElementById("fortakeOrder")
        modelclose.click();
    }

    resetForm() {
        document.getElementById('takeOrderForm').reset();
        document.getElementById('existcustomer').checked = true;

        const validator = {
            customername: {
                isInvalid: false,
                message: ""
            },
            isValid: true,
            mobile_number: {
                isInvalid: false,
                message: ""
            },
            address: {
                isInvalid: false,
                message: ""
            },
            deliveryboyname: {
                isInvalid: false,
                message: ""
            }
        }

        this.setState({
            customerid: '',
            customername: '',
            mobile_number: '',
            address: '',
            deliveryboyid: '',
            deliveryboyname: '',
            validation: validator,
            checkedvalue: 'existcustomer',
            deliveryboyList: [],
            customerList: [],
            tableobj: [],
            customerobj: []
        });
    }

    handleFormSubmit = (event) => {
        const btnclickname = event.target.name;
        const { customername, mobile_number, customerid, address, customerobj, getcustomerid } = this.state;
        const newCustomerObj = {
            property: {
                fullname: customername,
                mobile_number: mobile_number
            }
        }

        let takeOrderObj = {
            _id: 'unsaved_' + 'uuid',
            tableid: '',
            postype: 'this.state.activeOrderType',
            property: { orderstatus: "running" },
            customerid: customerobj,
            onModel: "Member",
            amount: 0,
            totalamount: 0,
            discount: 0,
            taxamount: 0,
            totalquantity: 0,
            items: [],
            deliveryaddress: address,
            token: 'this.getTokenModel(table)'
        }

        const validation = this.validator.validate(this.state);
        this.setState({ validation });
        if (validation.isValid) {
            if (btnclickname === "takeOrder") {
                if (customerid === '') {
                    CustomerApi.addProspectsTableRecord(newCustomerObj).then((response) => {
                        this.setState({ customerid: response.data._id })
                        if (response.data._id) {
                            console.log(response.data._id);
                            takeOrderObj.property.customerid = response.data._id
                            //WaitingTableApi.addWaitingTableRecord(waitingTableObj).then(() => {
                            this.getCustomerList();
                            this.modelPopupClose();
                            console.log('save');
                            //})
                        }
                    })
                } else if (getcustomerid === '') {
                    //WaitingTableApi.addWaitingTableRecord(waitingTableObj).then(() => {
                    this.modelPopupClose();
                    console.log('save exit records');
                    //})
                }
            }
        }
    }

    async componentDidMount() {
        await this.getCustomerList();
        await this.getdeliveryboyList()
    }

    async getCustomerList() {
        return CustomerApi.getCustomerList()
            .then((response) => {
                this.setState({ customerList: response.data })
                return;
            }, (error) => {
                console.log("error", error);
            });
    }

    async getdeliveryboyList() {
        return UserApi.getUserList()
            .then((response) => {
                this.setState({ deliveryboyList: response.data })
                return;
            }, (error) => {
                console.log("error", error);
            })
    }

    CustomerDropdownHandleChange = event => {
        if (this.state.checkedvalue === 'existcustomer') {
            const customerFind = this.state.customerList.find(x => x._id === event)
            this.setState({
                mobile_number: customerFind.property.mobile_number,
                customername: customerFind.property.fullname,
                customerid: customerFind._id,
                customerobj: customerFind,
                getcustomerid: customerFind._id,
            });
        }
    }

    render() {
        const validation = this.submitted ? this.validator.validate(this.state) : this.state.validation
        const { customerid, deliveryboyid, checkedvalue, mobile_number, deliveryboy, deliveryboyList, address, customerList } = this.state;

        const handleradioOnChange = event => {
            this.setState({
                checkedvalue: event.target.value
            });
        }

        const customerDropdown = customerList.map(clientObj => (
            {
                name: clientObj.property.fullname,
                value: clientObj._id
            }
        ))

        return (
            <React.Fragment>
                <div className="modal fade" id="fortakeOrder" tabIndex="-1" role="dialog" aria-labelledby="takeOrderTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="taketakeOrderTitleOrder">Take Order</h5>
                                <button type="button" id="modelclose" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.resetForm()} >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <input type="radio" id="existcustomer" name="takeorder" value="existcustomer" className="mr-1" defaultChecked onChange={handleradioOnChange} />
                                    <label htmlFor="existcustomer" className="mr-3">Exist Customer</label>
                                    <input type="radio" id="newcustomer" name="takeorder" value="newcustomer" className="mr-1" onChange={handleradioOnChange} />
                                    <label htmlFor="newcustomer" className="mr-3">New Customer</label>
                                </div>
                                <form className="container mt-3" method="post" id="takeOrderForm" name="takeOrderForm" >
                                    <div className="form-group row">
                                        <label htmlFor="customer" className="col-sm-4 col-form-label">Customer Name <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            {checkedvalue === 'existcustomer'
                                                ?
                                                <SelectSearch
                                                    options={customerDropdown}
                                                    value={customerid}
                                                    search
                                                    name="customername"
                                                    placeholder="Select Customer"
                                                    onChange={this.CustomerDropdownHandleChange} />
                                                :
                                                <input className="form-control" type="text" placeholder="Enter Customer Name" name='customername' id="customerid" onChange={this.handleInputChange} />
                                            }
                                            <span className="help-block">{validation.customername.message}</span>
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
                                        <label htmlFor="address" className="col-sm-4 col-form-label">Address <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <textarea type="textarea" className="form-control" name='address' id="address" placeholder="Enter Delivery Address" value={address} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.address.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="deliveryboylbl" className="col-sm-4 col-form-label">Delivery Boy <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <select className="form-control" name='deliveryboyname' id="deliveryboyid" value={deliveryboyid}
                                                onChange={this.handleInputChange} style={{ width: '100%' }}>
                                                {deliveryboyList.map(deliveryboy => (
                                                    <option key={deliveryboy._id} value={deliveryboy._id}>
                                                        {deliveryboy.property.fullname}
                                                    </option>
                                                ))} </select>
                                            <span className="help-block">{validation.deliveryboyname.message}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" name="takeOrder" onClick={this.handleFormSubmit}>Take Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

