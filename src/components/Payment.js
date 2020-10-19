import React, { Component } from 'react'
import SelectSearch from 'react-select-search';

import { ORDERTYPES, PAGES, PAYMENTMETHODS } from '../Pages/OrderEnums'

class Payment extends Component {
    constructor(props) {
        super(props);
        // document.title = this.props.title
        // window.scrollTo(0, 0);

        this.state = {
            deliveryBoyList: this.props.deliveryBoyList,
            currentCart: this.props.currentCart,
            wallet: true,
            paymentMethod: PAYMENTMETHODS.CASH,
            deliveryaddress: "",
            deliveryboyid: "",
            deliveryboyname: "",
        }

        this.doPayment = this.doPayment.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.currentCart) {
            this.setState({
                currentCart: props.currentCart,
                deliveryaddress: props.currentCart.postype === ORDERTYPES.DELIVERY ? props.currentCart.property.deliveryaddress : "",
                deliveryboyid: props.currentCart.postype === ORDERTYPES.DELIVERY ? props.currentCart.property.deliveryboyid._id : "",
                deliveryboyname: props.currentCart.postype === ORDERTYPES.DELIVERY ? props.currentCart.property.deliveryboyid.property.fullname : "",
            });
        }
    }

    doPayment = () => {
        const { wallet, paymentMethod, deliveryaddress, deliveryboyid, deliveryboyname } = this.state;

        let currentCart = this.state.currentCart
        currentCart.paidamount = currentCart.totalamount
        currentCart.status = "Paid"
        currentCart.property.orderstatus = "checkedout"

        if (this.props.activeOrderType === ORDERTYPES.DELIVERY) {
            currentCart.property.deliveryaddress = deliveryaddress
            currentCart.property.deliveryboyid = {
                _id: deliveryboyid,
                property: {
                    fullname: deliveryboyname
                }
            }
        }

        this.props.doPayment(currentCart);
    }

    onChangeValue(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    onDeliveryBoyDropdownChange = value => {
        const foundDeliveryBoy = this.props.deliveryBoyList.find(x => x._id === value)
        if (this.props.activeOrderType === ORDERTYPES.DELIVERY) {
            this.setState({
                deliveryboyid: foundDeliveryBoy._id,
                deliveryboyname: foundDeliveryBoy.property.fullname
            });
        }
    }

    render() {
        const { wallet, paymentMethod, deliveryaddress, deliveryboyid, deliveryboyname, deliveryBoyList } = this.state;

        const deliveryBoyDropdown = deliveryBoyList.map(x => (
            {
                name: x.property.fullname,
                value: x._id
            }
        ))

        return (
            <React.Fragment>
                <div className="col-xl-8 col-lg-8 col-md-7">
                    <div className="white-box mb-3 payment-method-main white-box-full-order">
                        <div className="payment-box" >
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    name="wallet"
                                    checked={wallet}
                                    onChange={this.onChangeValue}
                                    className="custom-control-input"
                                    id="customCheck1"
                                />
                                <label className="custom-control-label" htmlFor="customCheck1">Wallet</label>
                            </div>
                        </div>
                        {/* <div className="payment-box-body mb-4">Usable Wallet balance ₹160</div> */}
                        <div className="table-num-title mb-3">Payment Method</div>

                        <div className="payment-box mb-3" >
                            <div className="custom-control custom-radio">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={PAYMENTMETHODS.CASH}
                                    checked={paymentMethod === PAYMENTMETHODS.CASH}
                                    onChange={this.onChangeValue}
                                    id="customRadio1"
                                    className="custom-control-input"
                                />
                                <label className="custom-control-label" htmlFor="customRadio1">Cash</label>
                            </div>
                        </div>
                        <div className="payment-box mb-3" >
                            <div className="custom-control custom-radio">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={PAYMENTMETHODS.CARD}
                                    checked={paymentMethod === PAYMENTMETHODS.CARD}
                                    onChange={this.onChangeValue}
                                    id="customRadio2"
                                    className="custom-control-input"
                                />
                                <label className="custom-control-label" htmlFor="customRadio2">Debit Card / Credit Card</label>
                            </div>
                        </div>
                        {this.props.activeOrderType === ORDERTYPES.DELIVERY &&
                            <div className="form-group row">
                                <label htmlFor="address" className="col-sm-4 col-form-label">Address <span style={{ color: 'red' }}>*</span></label>
                                <div className="col-sm-8">
                                    <textarea
                                        type="textarea"
                                        name='address'
                                        value={deliveryaddress}
                                        placeholder="Enter Delivery Address"
                                        className="form-control"
                                        onChange={this.onChangeValue}
                                    />
                                    {/* <span className="help-block">{validation.deliveryaddress.message}</span> */}
                                </div>
                            </div>
                        }
                        {this.props.activeOrderType === ORDERTYPES.DELIVERY &&
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
                        }

                        <div className="row">
                            <div className="offset-xl-9 col-xl-3 offset-lg-7 col-lg-5" >
                                <button type="button" className="btn btn-success btn-lg btn-block" onClick={() => this.doPayment()}>Pay Now</button>
                            </div>
                            <div className="offset-xl-9 col-xl-3 offset-lg-7 col-lg-5" >
                                <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={() => this.props.setActivePage(PAGES.ORDERS)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}
export default Payment