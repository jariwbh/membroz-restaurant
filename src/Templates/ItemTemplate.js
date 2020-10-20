import React from 'react'

function ItemTamplate(props) {
    return (

        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 d-flex" onClick={props.clickHandler}>
            <div className="card white-box mb-10 w-100">
                {props.item.tokenquantity > 0 &&
                    <div className="box-item-selected">{props.item.tokenquantity}</div>
                }
                <img className="card-img-top" alt={props.item.itemid.itemname} src={props.item.itemid.item_logo} />
                <div className="card-body p-2">
                    <div className="card-item-title mb-1">{props.item.itemid.itemname}</div>
                    <div className="card-item-price">₹{props.item.itemid.sale.rate}</div>
                </div>
            </div>
        </div>
    )
}

export default ItemTamplate