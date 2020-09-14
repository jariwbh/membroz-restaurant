import React from 'react'
import ModelPopup from '../components/ModelPopup'

function CartTemplate(props) {
    return (
        <div className="col-xl-4 col-lg-4 col-md-5">
            <div className="white-box mb-3">
                <div className="d-flex person-table-p">
                    <div className="flex-grow-1 person-title"> Person 4</div>
                    <div className="table-num-title"> Table 01</div>
                </div>
                <div className="d-flex customer-name-p">
                    <div className="flex-grow-1"> Kamlesh Patel</div>
                    <div className="table-num-title"> <a href="#"><img src="images/add-icon.svg" alt="" /> </a> </div>
                </div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th className="text-center">Qty</th>
                                <th className="text-right">Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.currentOrder.items.map(item =>
                                <tr>
                                    <td>{props.item.itemid.itemname}</td>
                                    <td className="text-center">{1}</td>
                                    <td className="text-right">₹{props.item.itemid.rate}</td>
                                    <td></td>
                                </tr>
                            )}

                            <tr>
                                <td>Paneer Tikka Masala</td>
                                <td className="text-center">1</td>
                                <td className="text-right">₹220</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Paneer Tikka Masala</td>
                                <td className="text-center">1</td>
                                <td className="text-right">₹220</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Paneer Tikka Masala</td>
                                <td className="text-center">1</td>
                                <td className="text-right">₹220</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Paneer Tikka Masala</td>
                                <td className="text-center">1</td>
                                <td className="text-right">₹220</td>
                                <td></td>
                            </tr>
                            <tr className="pos-item-hover">
                                <td>Paneer Tikka Masala</td>
                                <td className="text-center text-nowrap">
                                    <img src="images/minus-icon.svg" alt="" className="mr-2" /> 1
                                                        <img className="ml-2" src="images/plus-icon.svg" alt="" />
                                </td>
                                <td className="text-right">₹220</td>
                                <td width="20"><img src="images/delete-icon.svg" alt="" /></td>
                            </tr>
                            <tr>
                                <td colSpan="4">&nbsp;</td>
                            </tr>
                            <tr>
                                <td className="font-weight-bold border-bottom">Total</td>
                                <td className="text-center font-weight-bold border-bottom">4</td>
                                <td className="text-right font-weight-bold border-bottom">₹880</td>
                                <td className="border-bottom"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="row customer-name-p">
                    <div className="col-6"><button type="button" className="btn btn-primary btn-lg btn-block" data-toggle="modal" data-target="#exampleModalCenter" data-keyboard="false" data-backdrop="static">Confirm</button>
                    </div>
                    <div className="col-6"><button type="button" className="btn btn-success btn-lg btn-block">Checkout</button>
                        <ModelPopup />
                    </div>
                </div>
                <div className="row token-status-p mt-3">
                    <div className="col-12 table-num-title">KOT View</div>
                </div>
                <div className="kot-view-block">
                    <div className="d-flex">
                        <div className="flex-grow-1 font-weight-bold">Token 10</div>
                        <div> <span className="badge badge-pill badge-warning token-status token-inprogress">In Progress</span>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table-token">
                            <tbody>
                                <tr>
                                    <td>Paneer Tikka Masala</td>
                                    <td className="text-right">1</td>
                                </tr>
                                <tr>
                                    <td>Roti</td>
                                    <td className="text-right">40</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="kot-view-block">
                    <div className="d-flex">
                        <div className="flex-grow-1 font-weight-bold">Token 4</div>
                        <div> <span className="badge badge-pill badge-success token-status">Completed</span></div>
                    </div>
                    <div className="table-responsive">
                        <table className="table-token">
                            <tbody>
                                <tr>
                                    <td>Paneer Butter Masala</td>
                                    <td className="text-right">1</td>
                                </tr>
                                <tr>
                                    <td>Roti</td>
                                    <td className="text-right">40</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartTemplate