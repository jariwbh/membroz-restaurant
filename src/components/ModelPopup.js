import React from 'react'

function ModelPopup(props) {
    return (
        <div className="modal fade" id="confirmationitems" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Check Order Details</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
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
                                    {props.currentKotToken.items.map(item =>
                                        <tr key={item.id}>
                                            <td>{item.itemname}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-right">₹{item.amount}</td>
                                            <td></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary mr-auto" le='true' data-dismiss="modal" onClick={props.sendKOTHandler} >Send KOT</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModelPopup
