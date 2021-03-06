import React from 'react'
import { ORDERTYPES } from '../Pages/OrderEnums'
import $ from 'jquery'
import 'malihu-custom-scrollbar-plugin'
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css'

function RunningTable(props) {
    const runningOrders = props.runningOrders.filter(x => x.postype === props.activeOrderType)
    const currentCart = props.currentCart

    $(window).on("load", function () {
        $('#scrollcontent').mCustomScrollbar({
            // theme: "dark",
            axis: 'x',
            advanced: { autoExpandHorizontalScroll: true }
        })
    });

    return (
        <React.Fragment>
            <div className="col-xl-8 col-lg-8 col-md-7">
                <div className="white-box my-10">
                    <div className="d-flex align-items-center min-height-63">
                        <div className="flex-grow-1 scrollcontent" id="scrollcontent">
                            <ul className="nav nav-pills">
                                {currentCart && runningOrders && runningOrders.length > 0 &&
                                    runningOrders.map(bill =>
                                        <li onClick={() => props.setCurrentCartHandler(bill)} className="nav-item" key={bill._id} id={bill._id}>
                                            <a className={`nav-link ${currentCart._id === bill._id ? "active" : ""}`} href="/#">
                                                {(props.activeOrderType === ORDERTYPES.DINEIN) ?
                                                    <>
                                                        <div className="pos-table-bar-cap">Table</div>
                                                        <div className="pos-table-bar-num">{bill.tableid.property.tablename}</div>
                                                    </>
                                                    :
                                                    <>
                                                        <div className="pos-table-bar-cap">Token</div>
                                                        <div className="pos-table-bar-num">{bill.property.token.prefix}{bill.property.token.tokennumber}</div>
                                                    </>
                                                }
                                            </a>
                                        </li>
                                    )}
                            </ul>
                        </div>
                        {props.activeOrderType === ORDERTYPES.DINEIN ?
                            <div className="d-flex align-items-center mr-2">
                                <button type="button" className="btn btn-primary btn-lg" onClick={() => props.newOrderHandler()}>New Order</button>
                            </div>
                            :
                            <div className="d-flex align-items-center mr-2">
                                <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#takeOrderpopup">New Order</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export default RunningTable