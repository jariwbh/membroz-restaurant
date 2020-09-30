import React from 'react'

function KOTView(props) {

    return (
        <React.Fragment>
            {(props.tokenList) && (props.tokenList.length > 0) &&
                <div>
                    <div className="row token-status-p mt-3">
                        <div className="col-12 table-num-title">KOT View</div>
                    </div>
                    <div className="kot-view-block">
                        <div className="d-flex">
                            <div className="flex-grow-1 font-weight-bold">Token 10</div>
                            <div>
                                <span className="badge badge-pill badge-warning token-status token-inprogress">In Progress</span>
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
            }
        </React.Fragment>
    )
}

export default KOTView