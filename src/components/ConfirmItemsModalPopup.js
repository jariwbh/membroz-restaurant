import React from 'react'
import * as images from './Image'

function ConfirmItemsModalPopup(props) {
    let token = props.token;

    return (
        <div className="modal fade" id="confirmitemsmodalpopup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="ConfirmModalLabel">Order Confirm</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {(token && token.property.items) && (token.property.items.length > 0) &&
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
                                        {token.property.items.map(item =>
                                            item._id === props.selectedCartConfirmItemId ?
                                                <tr key={item._id} className="pos-item-hover">
                                                    <td>{item.itemname}</td>
                                                    <td className="text-center text-nowrap">
                                                        <img className="mr-2" src={images.minusicon} alt="" onClick={() => props.addToCartHandler(item, -1)} />
                                                        <span className="text-center">{item.quantity}</span>
                                                        <img className="ml-2" src={images.plusicon} alt="" onClick={() => props.addToCartHandler(item, 1)} /></td>
                                                    <td className="text-right">₹{item.totalcost}</td>
                                                    <td width="20"><img src={images.deleteWhiteIcon} alt="" onClick={() => props.addToCartHandler(item, -Number(item.quantity), true)} /></td>
                                                </tr>
                                                :
                                                <tr key={item._id} onClick={() => props.selectCartConfirmItemHandler(item._id)}>
                                                    <td>{item.itemname}</td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-right">₹{item.totalcost}</td>
                                                    <td></td>
                                                </tr>
                                        )}

                                        <tr>
                                            <td colSpan="4">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold border-bottom">Total</td>
                                            <td className="text-center font-weight-bold border-bottom">{token.totalquantity}</td>
                                            <td className="text-right font-weight-bold border-bottom">₹{token.totalamount}</td>
                                            <td className="border-bottom"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        }
                        {(!token || !token.property.items || token.property.items.length === 0) &&
                            <div>Empty Current KOT</div>
                        }
                    </div>
                    <div className="modal-footer">
                        {(!token || !token.property.items || token.property.items.length === 0) &&
                            <button type="button" className="btn btn-primary" le='true' data-dismiss="modal">OK</button>
                        }
                        {(token && token.property.items && token.property.items.length > 0) &&
                            <>
                                <button type="button" className="btn btn-secondary" le='true' data-dismiss="modal" onClick={props.clearItemsHandler}>Clear</button>
                                <button type="button" className="btn btn-primary" le='true' data-dismiss="modal" onClick={props.sendTokenHandler}>Send KOT</button>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmItemsModalPopup
