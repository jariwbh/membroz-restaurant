import React, { Component } from 'react'
import * as Api from '../Api/TableServices'

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tables: [],
        }

    }

    componentDidMount = () => {
        Api.getBookingTableList().then((response) => {
            this.setState({ tables: response.data })
        })
    }

    render() {

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="white-box my-3">
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <ul className="nav nav-pills">
                                        {this.state.tables.map(table =>
                                            <li className="nav-item" key={table._id} id={table._id}>
                                                <a className="nav-link active" href="#">
                                                    <div className="pos-table-bar-cap">Table</div>
                                                    <div className="pos-table-bar-num">{table.tableid.property.tablename}</div>
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className="d-flex align-items-center mr-2">
                                    <button type="button" className="btn btn-primary btn-lg">New Order</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}
export default Table