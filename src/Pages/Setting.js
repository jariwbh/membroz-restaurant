import React from 'react'

export default function Setting(props) {
    document.title = props.title
    window.scrollTo(0, 0);
    return (
        <React.Fragment>
            <div id="layoutSidenav_content">
                <div className="container-fluid">
                    <div className="row table-item-gutters">
                        <h1>Setting Page</h1>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
