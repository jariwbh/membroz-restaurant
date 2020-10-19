import React, { Component } from 'react'
import FormValidator from '../components/FormValidator';
import SelectSearch from 'react-select-search';
import * as CustomerServices from '../Api/CustomerSevices';

import { CUSTOMERTYPES, ORDERTYPES } from '../Pages/OrderEnums'

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
            }
        ]);

        this.state = {
            customerList: [],
            activeOrderType: ORDERTYPES.TAKEAWAY,
            selectedCustomerTypeA: CUSTOMERTYPES.EXISTING,
            onModel: '',
            customerid: '',
            customername: '',
            mobile_number: '',
            address: '',
            deliveryboyid: undefined,
            deliveryboyname: undefined,
            validation: this.validator.valid()
        }

        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.currentCart) {
            this.setState({
                activeOrderType: props.activeOrderType,
                selectedCustomerTypeA: CUSTOMERTYPES.EXISTING,
                onModel: props.currentCart.onModel,
                customerid: props.currentCart.customerid._id,
                customername: props.currentCart.customerid.property.fullname,
                mobile_number: props.currentCart.customerid.property.mobile_number,
                address: props.currentCart.property.deliveryaddress,
                deliveryboyid: props.currentCart.property.deliveryboyid ? props.currentCart.property.deliveryboyid._id : undefined,
                deliveryboyname: props.currentCart.property.deliveryboyid ? props.currentCart.property.deliveryboyid.fullname : undefined
            });
        }
    }

    async getCustomerList() {
        CustomerServices.getCustomerList()
            .then((response) => {
                this.setState({ customerList: response.data })
            }, (error) => {
                console.log("error", error);
            });
    }

    async componentDidMount() {
        await this.getCustomerList();
    }

    onChangeValue = (event) => {
        //event.preventDefault();
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    onCustomerDropdownChange = value => {
        if (this.state.selectedCustomerTypeA === CUSTOMERTYPES.EXISTING) {
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

    onDeliveryBoyDropdownChange = value => {
        const foundDeliveryBoy = this.props.deliveryBoyList.find(x => x._id === value)
        if (this.state.activeOrderType === ORDERTYPES.DELIVERY) {
            this.setState({
                deliveryboyid: foundDeliveryBoy._id,
                deliveryboyname: foundDeliveryBoy.property.fullname
            });
        }
    }

    handleFormSubmit = async (event) => {
        let { selectedCustomerTypeA, onModel, customerid, customername, mobile_number, address, deliveryboyid, deliveryboyname } = this.state;

        const validation = this.validator.validate(this.state);
        if (!validation.isValid) {
            this.setState({ validation });
            return;
        }

        if (selectedCustomerTypeA === CUSTOMERTYPES.NEW) {

            const newCustomerObj = {
                property: {
                    fullname: customername,
                    mobile_number: mobile_number,
                    address: address
                }
            }

            const response = await CustomerServices.save(newCustomerObj)
            if (response.status === 200 && response.data._id) {
                this.setState({ customerid: response.data._id })
                customerid = response.data._id
                onModel = "Prospect"
                this.getCustomerList();
            } else {
                alert("Error to save Customer, Need to handle");
                return;
            }
        }

        const customer = {
            onModel: onModel,
            customerid: {
                _id: customerid,
                property: {
                    fullname: customername,
                    mobile_number: mobile_number,
                }
            }
        }

        let delivery = undefined
        if (this.state.activeOrderType === ORDERTYPES.DELIVERY) {
            delivery = {
                deliveryaddress: address,
                deliveryboyid: {
                    _id: deliveryboyid,
                    property: {
                        fullname: deliveryboyname
                    }
                }
            }
        }

        this.modelPopupClose();
        this.props.changeCustomerHandler(customer, delivery)
    }

    modelPopupClose() {
        var modelclose = document.getElementById("closemodel_changecustomer")
        modelclose.click();
    }

    onClose = async () => {
        await this.setState({
            selectedCustomerTypeA: CUSTOMERTYPES.EXISTING,
            onModel: '',
            customerid: '',
            customername: '',
            mobile_number: '',
            address: '',
            deliveryboyid: undefined,
            deliveryboyname: undefined,
            validation: this.validator.valid()
        })
    }

    render() {
        const validation = this.submitted ? this.validator.validate(this.state) : this.state.validation
        const { selectedCustomerTypeA, customerid, mobile_number, address, deliveryboyid, customerList } = this.state;

        const customerDropdown = customerList.map(customerObj => (
            {
                name: customerObj.property.fullname,
                value: customerObj._id
            }
        ))

        const deliveryBoyDropdown = this.props.deliveryBoyList.map(x => (
            {
                name: x.property.fullname,
                value: x._id
            }
        ))

        return (
            <React.Fragment>
                <div className="modal fade" id="changecustomerpopup" tabIndex="-1" role="dialog" aria-labelledby="takeOrderTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Customer</h5>
                                <button type="button" id="closemodel_changecustomer" className="close" data-dismiss="modal" aria-label="Close" onClick={this.onClose}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <label className="mr-3">
                                        <input
                                            type="radio"
                                            name="selectedCustomerTypeA"
                                            value={CUSTOMERTYPES.EXISTING}
                                            checked={selectedCustomerTypeA === CUSTOMERTYPES.EXISTING}
                                            onChange={this.onChangeValue}
                                            className="mr-1"
                                        />
                                    Exist Customer
                                </label>
                                    <label className="mr-3">
                                        <input
                                            type="radio"
                                            name="selectedCustomerTypeA"
                                            value={CUSTOMERTYPES.NEW}
                                            checked={selectedCustomerTypeA === CUSTOMERTYPES.NEW}
                                            onChange={this.onChangeValue}
                                            className="mr-1"
                                        />
                                    New Customer
                                </label>
                                </div>
                                <div className="container mt-3" >
                                    <div className="form-group row">
                                        <label htmlFor="customer" className="col-sm-4 col-form-label">Customer Name <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            {selectedCustomerTypeA === CUSTOMERTYPES.EXISTING
                                                ?
                                                <SelectSearch
                                                    options={customerDropdown}
                                                    name="customername"
                                                    value={customerid}
                                                    search
                                                    placeholder="Select Customer"
                                                    onChange={this.onCustomerDropdownChange} />
                                                :
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Enter Customer Name"
                                                    name='customername'
                                                    onChange={this.onChangeValue}
                                                />
                                            }
                                            <span className="help-block">{validation.customername.message}</span>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="mobilenumber" className="col-sm-4 col-form-label">Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                name='mobile_number'
                                                value={mobile_number}
                                                placeholder="Enter Mobile Number"
                                                className="form-control"
                                                onChange={this.onChangeValue}
                                            />
                                            <span className="help-block">{validation.mobile_number.message}</span>
                                        </div>
                                    </div>

                                    {this.state.activeOrderType === ORDERTYPES.DELIVERY ?
                                        <div className="form-group row">
                                            <label htmlFor="address" className="col-sm-4 col-form-label">Address <span style={{ color: 'red' }}>*</span></label>
                                            <div className="col-sm-8">
                                                <textarea
                                                    type="textarea"
                                                    name='address'
                                                    value={address}
                                                    placeholder="Enter Delivery Address"
                                                    className="form-control"
                                                    onChange={this.onChangeValue} />
                                                {/* <span className="help-block">{validation.address.message}</span> */}
                                            </div>
                                        </div>
                                        :
                                        <div></div>
                                    }

                                    {this.state.activeOrderType === ORDERTYPES.DELIVERY ?
                                        <div className="form-group row">
                                            <label htmlFor="deliveryboylbl" className="col-sm-4 col-form-label">Delivery Boy </label>
                                            <div className="col-sm-8">
                                                <SelectSearch
                                                    options={deliveryBoyDropdown}
                                                    name="deliveryboyname"
                                                    value={deliveryboyid}
                                                    search
                                                    placeholder="Select Delivery Boy"
                                                    onChange={this.onDeliveryBoyDropdownChange}
                                                />
                                            </div>
                                        </div>
                                        :
                                        <div></div>
                                    }
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" name="takeOrder" onClick={this.handleFormSubmit}>Change</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}