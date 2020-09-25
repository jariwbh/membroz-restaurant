import React from 'react'

function ConfirmItemsModalPopup(props) {
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
                        {(props.token.property.items) && (props.token.property.items.length > 0) &&
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
                                        {props.token.property.items.map(item =>
                                            <tr key={item._id}>
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
                                            <td className="text-center font-weight-bold border-bottom">4</td>
                                            <td className="text-right font-weight-bold border-bottom">₹880</td>
                                            <td className="border-bottom"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        }
                        {(!props.token.property.items) || (props.token.property.items.length === 0) &&
                            <div>Empty Current KOT</div>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" le='true' data-dismiss="modal" onClick={props.sendTokenHandler}>Send KOT</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmItemsModalPopup
