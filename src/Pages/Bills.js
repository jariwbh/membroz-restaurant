import React, { Component } from 'react'
import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';
import { Inject, Sort, Page, Resize, Reorder } from '@syncfusion/ej2-react-grids';

import '../Bills.css'
import * as Api from '../Api/TableServices'

class Bills extends Component {
    constructor(props) {
        super(props);

        document.title = this.props.title
        window.scrollTo(0, 0);

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        Api.getRunningTables().then((response) => {
            this.setState({ data: response.data })
        })
    }

    render() {
        const { data } = this.state
        return (
            <React.Fragment>
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid">
                            <div className="row table-item-gutters">
                                <h1>Today's Bills</h1>
                                <GridComponent dataSource={data} gridLines="both" allowSorting={true} allowPaging={true} height={550} pageSettings={{ pageCount: 4, pageSizes: true }} allowResizing={true} allowReordering={true} >
                                    <ColumnsDirective>
                                        <ColumnDirective headerText="Bill No" field='_id' width='100' textAlign="Right" />
                                        <ColumnDirective headerText="Date" field='Date' width='100' />
                                        <ColumnDirective headerText="Customer Name" field='customerid.property.fullname' width='100' textAlign="Left" />
                                        <ColumnDirective headerText="Amount" field='Amount' width='100' format="C2" textAlign="Right" />
                                    </ColumnsDirective>
                                    <Inject services={[Sort, Page, Resize, Reorder]} />
                                </GridComponent>
                            </div>
                        </div>
                    </main>
                </div>
            </React.Fragment>
        );
    }
}

export default Bills