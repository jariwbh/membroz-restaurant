import React, { Component } from 'react'
import '../Assets/css/Bills.css'
import * as Api from '../Api/TableServices'
import Pagination from "react-js-pagination";
import $ from 'jquery'

class Bills extends Component {
    constructor(props) {
        super(props);

        document.title = this.props.title
        window.scrollTo(0, 0);

        this.state = {
            data: data,
            Billdata: [],
            search: null,
            offset: 0,
            perPage: 10,
            activePage: 1,
            totalPages: 0,
        }
        // this.sortBy = this.sortBy.bind(this);
    }

    componentDidMount() {
        // Api.getRunningTables().then((response) => {
        //     this.setState({ data: response.data })
        // })
        this.receivedData();
    }

    receivedData() {
        this.setState({ totalPages: data.length });
        const slice = data.slice((this.state.activePage - 1) * this.state.perPage, this.state.activePage * this.state.perPage)
        this.setState({ loading: false, Billdata: slice });
    }

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber, offset: pageNumber });
        this.receivedData();
    }

    searchSpace = (event) => {
        let keyword = event.target.value;
        this.setState({ search: keyword })
    }

    // compareBy(key) {
    //     return function (a, b) {
    //         if (a[key] < b[key]) { return -1 }
    //         else if (a[key] > b[key]) { return 1 }
    //         return 0;
    //     };
    // }

    // sortBy(key) {
    //     let arrayCopy = [...this.state.Billdata];
    //     arrayCopy.sort(this.compareBy(key));
    //     this.setState({ Billdata: arrayCopy });
    // }

    // perPageInputChange = (event) => {
    //     console.log(event.target.value);
    //     const pagevalue = Number(event.target.value)
    //     this.setState({ perPage: pagevalue });
    //     this.receivedData();
    // }

    selectedTablerows(id) {
        console.log(id);
        //$(`#${id}`).toggleClass("highlight");
        $('tr').not(':first').click(function () {
            $(this).addClass("highlight"); //add class selected to current clicked row
            $(this).siblings().removeClass("highlight"); //remove class selected from rest of the rows

        });
    }

    modelpopuptablerowselect(id) {
        const billobj = this.state.Billdata.find(x => x.id === id)
        console.log('billobj', billobj);
    }

    render() {
        const { perPage, activePage, totalPages, Billdata } = this.state;
        const billList = this.state.Billdata.filter((obj) => {
            if (this.state.search == null) { return (obj) }
            else if (obj.customername.toLowerCase().includes(this.state.search.toLowerCase())
            ) { return (obj) }
        }).map(tableobj =>
            <tr key={tableobj.id} id={tableobj.id} onClick={() => this.selectedTablerows(tableobj.id)}
                className="" onDoubleClick={() => this.modelpopuptablerowselect(tableobj.id)}>
                <td>{tableobj.date}</td>
                <td>{tableobj.billno}</td>
                <td >{tableobj.table}</td>
                <td>{tableobj.customername}</td>
                <td>{tableobj.amount}</td>
            </tr>
        )

        // sortTitle() {
        //     let isAscending = true;
        //     const { Billdata } = this.state;
        //     if (isAscending) {
        //         Billdata.sort((a, b) => (a.title > b.title) ? 1 : -1);
        //     } else {
        //         this.state.Billdata.sort((a, b) => (a.title > b.title) ? -1 : 1);
        //     }
        // }

        return (
            <React.Fragment>
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid">
                            <form className="form-inline ">
                                <h1>Today's Bills</h1>
                                <input className="form-control" type="search" onChange={(e) => this.searchSpace(e)} style={{ marginLeft: '65%' }} placeholder="Search Bills" aria-label="Search" />
                            </form>
                            <div className="row table-item-gutters">
                                <table id="billtable" name="billtable" className="table" cellSpacing="1" hight="20%" style={{ cursor: 'pointer' }}>
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>date</th>
                                            <th>Bill No</th>
                                            <th>Table</th>
                                            <th>Customer Name</th>
                                            <th>amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billList.length === 0 ?
                                            <tr>
                                                <td colSpan="5" className="text-center text-nowrap">No records to display</td>
                                            </tr>
                                            :
                                            billList
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="form-inline">
                                <nav>
                                    <ul className="pagination justify-content-right">
                                        <Pagination
                                            prevPageText='Previous'
                                            nextPageText='Next'
                                            activePage={activePage}
                                            itemsCountPerPage={perPage}
                                            totalItemsCount={totalPages}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange.bind(this)}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                        />
                                    </ul>
                                </nav>
                                {/* <select className="form-control" name='perPage' id="perPage"
                                    onChange={this.perPageInputChange} className="ml-3">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </select> */}
                            </div>
                        </div>
                    </main>
                </div>
            </React.Fragment>
        );
    }
}

export default Bills

const data = [
    { id: '1', date: '20-10-2020', billno: '01', table: 'table 01', customername: 'harshad jariwala', amount: '200' },
    { id: '2', date: '20-10-2020', billno: '05', table: 'table 05', customername: 'vijay patel', amount: '100' },
    { id: '3', date: '20-10-2020', billno: '02', table: 'table 02', customername: 'sandip patel', amount: '300' },
    { id: '4', date: '20-10-2020', billno: '03', table: 'table 09', customername: 'harsh rana', amount: '500' },
    { id: '5', date: '20-10-2020', billno: '04', table: 'table 04', customername: 'karan panwala', amount: '800' },
    { id: '6', date: '20-10-2020', billno: '07', table: 'table 03', customername: 'komal chawala', amount: '600' },
    { id: '7', date: '20-10-2020', billno: '06', table: 'table 02', customername: 'mayur jethva', amount: '700' },
    { id: '8', date: '20-10-2020', billno: '09', table: 'table 07', customername: 'mayank dilwala', amount: '520' },
    { id: '9', date: '20-10-2020', billno: '08', table: 'table 06', customername: 'gorav patel', amount: '300' },
    { id: '10', date: '20-10-2020', billno: '10', table: 'table 05', customername: 'akharotwala', amount: '280' },
    { id: '11', date: '20-10-2020', billno: '07', table: 'table 03', customername: 'chawala', amount: '600' },
    { id: '12', date: '20-10-2020', billno: '06', table: 'table 02', customername: 'jethva', amount: '700' },
    { id: '13', date: '20-10-2020', billno: '09', table: 'table 07', customername: 'dilwala', amount: '520' },
    { id: '14', date: '20-10-2020', billno: '08', table: 'table 06', customername: 'patel', amount: '300' },
    { id: '15', date: '20-10-2020', billno: '10', table: 'table 05', customername: 'kamal', amount: '280' },
]