import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { PAYMENTMETHODS } from '../Pages/OrderEnums'

class Payment extends Component {
    constructor(props) {
        super(props);
        // document.title = this.props.title
        // window.scrollTo(0, 0);

        this.state = {
            wallet: true,
            paymentMethod: PAYMENTMETHODS.CASH
        }

        this.doPayment = this.doPayment.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    doPayment = () => {
        const { wallet, paymentMethod } = this.state;
        this.props.doPayment(wallet, paymentMethod);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    render() {
        const { wallet, paymentMethod } = this.state;

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
                                    onChange={this.handleInputChange}
                                    className="custom-control-input"
                                    id="customCheck1"
                                />
                                <label className="custom-control-label" htmlFor="customCheck1">Wallet</label>
                            </div>
                        </div>
                        <div className="payment-box-body mb-4">Usable Wallet balance ₹160</div>
                        <div className="table-num-title mb-3">Payment Method</div>

                        <div className="payment-box mb-3" >
                            <div className="custom-control custom-radio">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={PAYMENTMETHODS.CASH}
                                    checked={paymentMethod === PAYMENTMETHODS.CASH}
                                    onChange={this.handleInputChange}
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
                                    onChange={this.handleInputChange}
                                    id="customRadio2"
                                    className="custom-control-input"
                                />
                                <label className="custom-control-label" htmlFor="customRadio2">Debit Card / Credit Card</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="offset-xl-9 col-xl-3 offset-lg-7 col-lg-5" >
                                <button type="button" className="btn btn-success btn-lg btn-block" onClick={() => this.doPayment()}>Pay Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}
export default Payment