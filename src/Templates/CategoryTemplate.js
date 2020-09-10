import React from 'react'

function CategoryTemplate(props) {
    return (
        <React.Fragment>
            <li className="nav-item" role="presentation" onClick={props.clickHandler}>
                <a className={props.selected ? "nav-link active" : "nav-link"} id="pills-item-1-tab" data-toggle="pill" href="#pills-item-1" role="tab"
                    aria-controls="pills-item-1" aria-selected="true">{props.titile}</a>
            </li>
        </React.Fragment>

    )
}

export default CategoryTemplate