import React from 'react'

function KOTView(props) {

    return (
        <React.Fragment>
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
                                            <span className="badge badge-pill badge-success token-status">Prepared</span>
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
        </React.Fragment>
    )
}

export default KOTView