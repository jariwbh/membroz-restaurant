import React from 'react'
import ConfirmItemsModalPopup from '../components/ConfirmItemsModalPopup'

function CartTemplate(props) {

    return (
        <div className="col-xl-4 col-lg-4 col-md-5">
            <div className="white-box mb-3">
                <div className="person-table-p">
                    <div className="person-table-p">
                        <div className="table-num-title d-flex justify-content-end">{props.currentCart.tableid.property.tablename}</div>
                    </div>
                </div>
                <div className="d-flex customer-name-p">
                    <div className="flex-grow-1">
                        <div>Kamlesh Patel</div>
                        <div>9825141942</div>
                    </div>
                    <div className="table-num-title"> <a href="#"><img src="images/add-icon.svg" alt="" /> </a> </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th className="text-center">Qty</th>
                                <th className="text-right">Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {props.currentCart.items.length > 0 &&
                                props.currentCart.items.map(item =>
                                    <tr key={item._id ? item._id : item.item}>
                                        <td>{item.itemname ? item.itemname : item.item.itemid.itemname}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-right">₹{item.totalcost}</td>
                                        <td></td>
                                    </tr>
                                )
                            }
                            {props.currentCart.items.length === 0 &&
                                <tr>
                                    <td colSpan="4" className="text-center text-nowrap">Empty Cart</td>
                                </tr>
                            }

                            {/* <tr className="pos-item-hover">
                                <td>Paneer Tikka Masala</td>
                                <td className="text-center text-nowrap">
                                    <img src="images/minus-icon.svg" alt="" className="mr-2" /> 1
                                                        <img className="ml-2" src="images/plus-icon.svg" alt="" />
                                </td>
                                <td className="text-right">₹220</td>
                                <td width="20"><img src="images/delete-icon.svg" alt="" /></td>
                            </tr> */}
                            <tr>
                                <td colSpan="4">&nbsp;</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold border-bottom">Total</td>
                                <td className="text-center font-weight-bold border-bottom">{getTotalQuantity(props)}</td>
                                <td className="text-right font-weight-bold border-bottom">₹{props.currentCart.totalamount}</td>
                                <td className="border-bottom"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="row customer-name-p">
                    <div className="col-6"><button type="button" className="btn btn-primary btn-lg btn-block" data-toggle="modal" data-target="#confirmitemsmodalpopup" data-keyboard="false" data-backdrop="static">Confirm</button>
                        <ConfirmItemsModalPopup token={props.currentCart.token} sendTokenHandler={props.sendTokenHandler()} />
                    </div>
                    <div className="col-6"><button type="button" className="btn btn-success btn-lg btn-block">Checkout</button>
                    </div>
                </div>
                {/* <KOTView tokenList={props.tokenList} />{} */}

                {(props.tokenList) && (props.tokenList.length > 0) &&
                    <div>
                        <div className="row token-status-p mt-3">
                            <div className="col-12 table-num-title">KOT View</div>
                        </div>

                        {
                            props.tokenList.map(token =>
                                <div className="kot-view-block" key={token._id}>
                                    <div className="d-flex">
                                        <div className="flex-grow-1 font-weight-bold">{token.prefix}{token.tokennumber}</div>
                                        <div>
                                            {(token.status === "waiting") &&
                                                <span className="badge badge-pill badge-warning token-status token-waiting">Waiting</span>
                                            }
                                            {(token.status === "inprogress") &&
                                                <span className="badge badge-pill badge-warning token-status token-inprogress">In Progress</span>
                                            }
                                            {(token.status === "prepared") &&
                                                <div>
                                                    <span onClick={() => props.changeTokenStatusHandler(token)} className="badge badge-pill badge-success token-status cursor-pointer">Prepared</span>
                                                </div>
                                            }
                                            {(token.status === "served") &&
                                                <span className="badge badge-pill badge-success token-status">Served</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table-token">
                                            <tbody>
                                                {
                                                    token.property.items.map(item =>
                                                        <tr key={item._id}>
                                                            <td>{item.itemname}</td>
                                                            <td className="text-right">{item.quantity}</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                }
            </div>
        </div>
    )
}

function getTotalQuantity(props) {
    let totalQuantity = 0
    if (props.currentCart.items.length > 0) {
        totalQuantity = props.currentCart.items.map(item => item.quantity).reduce((prev, next) => prev + next)
    }

    return totalQuantity
}

export default CartTemplate