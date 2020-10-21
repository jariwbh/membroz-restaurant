import React, { Component } from 'react'
//import ReactHtmlParser from 'react-html-parser';
import Pagination from "react-js-pagination";
import moment from 'moment'
import $ from 'jquery'
import '../Assets/css/Bills.css'
import * as Api from '../Api/BillServices'
import * as Image from '../components/Image'

class Bills extends Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        this.state = {
            billListObj: [],
            getBilList: [],
            offset: 0,
            perPage: 10,
            activePage: 1,
            totalPages: 0,
            sortType: "asc",
            sortColumn: '',
            search: null,
            billheader: null,
            billnumber: '',
            cartitem: null,
            totaldiscount: 0,
            totalamount: null,
            address: '',
            deliveryaddress: '',
            deliveryboy: '',
            tablename: '',
            billDate: '',
            restaurantname: '',
            city: ''
        }
        this.printInvoiceReceipt = this.printInvoiceReceipt.bind(this);
    }

    componentDidMount() {
        this.receivedData();
    }

    receivedData() {
        Api.getBillList().then((response) => {
            this.setState({ totalPages: response.data.length, getBilList: response.data });
            const slice = response.data.slice((this.state.activePage - 1) * this.state.perPage, this.state.activePage * this.state.perPage)
            const billList = slice.map(bill => ({
                _id: bill._id,
                billnumber: bill.billnumber,
                tablename: bill.tableid ? bill.tableid.property.tablename : "",
                customername: bill.customerid.property.fullname,
                totalamount: bill.totalamount,
                date: bill.createdAt,
                deliveryaddress: bill.property.deliveryaddress ? bill.property.deliveryaddress : "",
                deliveryboy: bill.property.deliveryboyid ? bill.property.deliveryboyid.property.fullname : ""
            }));
            this.setState({ billListObj: billList });
        })
    }

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber, offset: pageNumber });
        this.receivedData();
    }

    searchSpace = (event) => {
        let keyword = event.target.value;
        this.setState({ search: keyword })
    }

    sortByhandle(key) {
        const { sortType } = this.state;
        const billList = this.state.billListObj;
        if (sortType === "asc") {
            this.setState({
                billListObj: billList.sort(function (a, b) {
                    if (a[key] < b[key]) { return -1 }
                    return 0;
                }), sortType: "desc", sortColumn: key
            });
        } else if (sortType === "desc") {
            this.setState({
                billListObj: billList.sort(function (a, b) {
                    if (a[key] > b[key]) { return -1 }
                    return 0;
                }), sortType: "asc", sortColumn: key
            });
        }
    }

    selectedTablerows(id) {
        $('tr').not(':first').click(function () {
            $(this).addClass("highlight");
            $(this).siblings().removeClass("highlight");
        });
    }

    // regexrep(str, obj, history) {
    //     var shortcode_regex = /\[{(\w+)+\.?(\w+)\.?(\w+)\}]/mg;
    //     var th = this;

    //     str.replace(shortcode_regex, function (match, code) {
    //         var replace_str = match.replace('[{', '');
    //         replace_str = replace_str.replace('}]', '');

    //         var db_fieldValue;
    //         var fieldnameSplit = replace_str.split('.');

    //         if (fieldnameSplit[1] == undefined || fieldnameSplit[1] == null) {
    //             var fieldname1 = fieldnameSplit[0];
    //             if (obj && obj[fieldname1]) {
    //                 if (Object.prototype.toString.call(obj[fieldname1]) == '[object Array]') {
    //                     if (obj[fieldname1][0] != undefined && obj[fieldname1][0].attachment != undefined)
    //                         db_fieldValue = obj[fieldname1][0].attachment;
    //                 } else if (fieldname1 == 'membershipstart' || fieldname1 == 'membershipend' || fieldname1 == 'createdAt' || fieldname1 == 'paymentdate' || fieldname1 == 'billingdate') {
    //                     db_fieldValue = th.datePipe.transform(obj[fieldname1], th.gDateFormat);
    //                 } else if (fieldname1 == 'paidamount') {
    //                     db_fieldValue = th.numberToWordsPipe.transform(obj[fieldname1]);
    //                     db_fieldValue = th.titleCasePipe.transform(db_fieldValue);
    //                 } else {
    //                     db_fieldValue = obj[fieldname1];
    //                 }
    //             }
    //             else db_fieldValue = '';

    //         } else if (fieldnameSplit[2] == undefined || fieldnameSplit[2] == null) {

    //             var fieldname1 = fieldnameSplit[0];
    //             var fieldname2 = fieldnameSplit[1];

    //             if (obj && obj[fieldname1] && obj[fieldname1][fieldname2]) {
    //                 if (Object.prototype.toString.call(obj[fieldname1][fieldname2]) == '[object Array]') {
    //                     if (obj[fieldname1][fieldname2][0] != undefined && obj[fieldname1][fieldname2][0].attachment != undefined)
    //                         db_fieldValue = obj[fieldname1][fieldname2][0].attachment;
    //                 } else if (fieldname2 == 'membershipstart' || fieldname2 == 'membershipend' || fieldname2 == 'createdAt' || fieldname2 == 'paymentdate' || fieldname2 == 'billingdate') {
    //                     db_fieldValue = th.datePipe.transform(obj[fieldname1][fieldname2], th.gDateFormat);
    //                 } else if (fieldname2 == 'paidamount') {
    //                     db_fieldValue = th.numberToWordsPipe.transform(obj[fieldname1][fieldname2]);
    //                     db_fieldValue = th.titleCasePipe.transform(db_fieldValue);
    //                 } else {
    //                     db_fieldValue = obj[fieldname1][fieldname2];
    //                 }

    //             }
    //             else if (history && history[fieldname1] && history[fieldname1][fieldname2]) {
    //                 db_fieldValue = history[fieldname1][fieldname2];
    //             }
    //             for (var key in history) {
    //                 var subfield = key.substr(4);
    //                 var obj1 = history[key];
    //                 if (fieldname1 == subfield && obj1[fieldname2]) {
    //                     db_fieldValue = obj1[fieldname2];
    //                 }
    //             }
    //         } else {
    //             var fieldname1 = fieldnameSplit[0];
    //             var fieldname2 = fieldnameSplit[1];
    //             var fieldname3 = fieldnameSplit[2];
    //             if (obj && obj[fieldname1] && obj[fieldname1][fieldname2] && obj[fieldname1][fieldname2][fieldname3]) {
    //                 db_fieldValue = obj[fieldname1][fieldname2][fieldname3];
    //             } else {
    //                 db_fieldValue = '';
    //             }
    //         }

    //         if (db_fieldValue) {
    //             str = str.replace("$[{" + replace_str + "}]", db_fieldValue);
    //         }
    //         else {
    //             str = str.replace("$[{" + replace_str + "}]", "");
    //         }
    //     });

    //     return str;
    // }

    getBill(id) {
        const billobj = this.state.getBilList.find(x => x._id === id)

        Api.getBillFormate().then((response) => {
            // console.log(response.data);
            this.setState({
                address: response.data.address,
                restaurantname: response.data.branchname, city: (response.data.city + '-' + response.data.postcode)
            })
        })

        const billcartitemlist = billobj.items.map(cartitem =>
            <tr key={cartitem._id} id={cartitem._id}>
                <td>{cartitem.item.itemid.itemname}</td>
                <td>{cartitem.quantity}</td>
                <td>{`$ ${cartitem.cost}`}</td>
                <td>{`$ ${cartitem.totalcost}`}</td>
            </tr>
        )

        this.setState({
            cartitem: billcartitemlist,
            totalamount: billobj.totalamount,
            billheader: billobj.customerid.membernumbername,
            billnumber: billobj.billnumber,
            tablename: (billobj.tableid ? billobj.tableid.property.tablename : ''),
            billDate: moment(billobj.date).format('DD-MM-YYYY')
        });
    }

    printInvoiceReceipt() {
        let printContents, popupWin;
        printContents = document.getElementById('prdiv').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
          <head>
            <title></title>
     <style type="text/css">
        @page {
            size: auto; 
            margin: 3mm 3mm 3mm;
        }
          
        @media print {
          body {
               margin: 0;color: #000;
              background-color: #fff;
          }
        #invoiceprint .p-pdb-20, #receiptprint .p-pdb-20 {
           padding-bottom: 20px !important;				
        }
  
        .p-col-md-4 {
           width: 33.33333333% !important;
           float: left !important;	
        }
  
          #invoiceprint .p-mrb-50, #receiptprint .p-mrb-50 {
              padding-bottom: 50px;		
        }
          #invoiceprint, #receiptprint {
              font-family: Arial, Gotham, Helvetica Neue, Helvetica, "sans-serif" !important;
              color: #000000 !important;
          }
  
          #invoiceprint .col-md-5, #receiptprint .col-md-5 {
              width: 50% !important;
              float: left !important;			
  
          }
          #invoiceprint .col-md-10, #receiptprint .col-md-10 {
              width: 100% !important;
              float: left !important;			
  
          }
  
          #invoiceprint .col-sm-offset-9, #receiptprint .col-sm-offset-9 {
              margin-left: 75% !important; 
          }
          #invoiceprint .col-sm-3, #receiptprint .col-sm-3 {
              width: 25% !important;
              float: left !important;	
          }
   
          #invoiceprint .text-right, #receiptprint .text-right {
           text-align:right;
          }
  
          .table-invoice thead th, .table-receipt thead th {
              font-family: Arial, Gotham, Helvetica Neue, Helvetica, "sans-serif";
              font-size: 14px !important;
              font-weight: bold!important;
              color: #000000 !important;
          }		
          .table-invoice tbody td, .table-receipt tbody td {
              font-family: Arial, Gotham, Helvetica Neue, Helvetica, "sans-serif";
              font-size: 14px !important;
              font-weight: normal!important;
              color: #000000 !important;
          }
          
          }
    </style>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
        </html>`
        );
        popupWin.document.close();
    }

    render() {
        const { perPage, activePage, totalPages, billListObj } = this.state;
        const billList = billListObj.filter((obj) => {
            if (this.state.search == null) { return (obj) }
            else if (obj.customername.toLowerCase().includes(this.state.search.toLowerCase())
            ) { return (obj) }
        }).map(tableobj =>
            <tr key={tableobj._id} id={tableobj._id} onClick={() => this.selectedTablerows(tableobj._id)} className="" >
                <td>{moment(tableobj.date).format('DD-MM-YYYY')}</td>
                <td className="text-right">{tableobj.billnumber}</td>
                <td className="text-right">{tableobj.tablename}</td>
                <td>{tableobj.customername}</td>
                <td>{tableobj.deliveryaddress}</td>
                <td>{tableobj.deliveryboy}</td>
                <td className="text-right">{`$ ${tableobj.totalamount}`}</td>
                <td className="text-right"><span><img src={Image.billicon} data-toggle="modal" data-target="#billmodelpopup" onClick={() => this.getBill(tableobj._id)} /></span></td>
            </tr>
        )

        return (
            <React.Fragment>
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-xl-10 offset-xl-1">
                                    <div className="white-box p-3 mt-5">
                                        <form className="row">
                                            <div className="col-md-9">
                                                <h3>Today's Bills</h3>
                                            </div>
                                            <div className="col-md-3">
                                                <input className="form-control mb-2" type="search" onChange={(e) => this.searchSpace(e)} placeholder="Search Bills" aria-label="Search" />
                                            </div>
                                        </form>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="table-responsive mb-3">
                                                    <table id="billtable" name="billtable" className="table" cellSpacing="1" style={{ cursor: 'pointer' }}>
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th width="13%" className={this.state.sortColumn === 'date' ? this.state.sortType === 'asc' ? "headerSortUp" : "headerSortDown" : ''} onClick={() => this.sortByhandle('date')}>Date</th>
                                                                <th width="15%" className={this.state.sortColumn === 'billnumber' ? this.state.sortType === 'asc' ? "headerSortUp text-right" : "headerSortDown text-right" : 'text-right'} onClick={() => this.sortByhandle('billnumber')}>Bill No</th>
                                                                <th width="17%" className={this.state.sortColumn === 'tablename' ? this.state.sortType === 'asc' ? "headerSortUp text-right" : "headerSortDown text-right" : 'text-right'} onClick={() => this.sortByhandle('tablename')}>Table</th>
                                                                <th width="27%" className={this.state.sortColumn === 'customername' ? this.state.sortType === 'asc' ? "headerSortUp" : "headerSortDown" : ''} onClick={() => this.sortByhandle('customername')}>Customer Name</th>
                                                                <th width="15%" >Address</th>
                                                                <th width="15%">Delivery Boy</th>
                                                                <th width="15%" className={this.state.sortColumn === 'totalamount' ? this.state.sortType === 'asc' ? "headerSortUp text-right" : "headerSortDown text-right" : 'text-right'} onClick={() => this.sortByhandle('totalamount')}>Amount</th>
                                                                <th width="13%"></th>
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
                                            </div>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <div className="modal fade" id="billmodelpopup" tabIndex="-1" role="dialog" aria-labelledby="billmodelpopup" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="billmodelpopup">View Bill</h5>
                                <button type="button" id="modelclose" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" id="prdiv">
                                {this.state.cartitem &&
                                    <>
                                        <div className="d-flex justify-content-center" style={{ fontWeight: "bold" }}>{this.state.restaurantname}</div>
                                        <div className="d-flex justify-content-center" style={{ fontWeight: "bold" }}>{this.state.billheader}</div>
                                        <div className="d-flex justify-content-center" style={{ fontWeight: "bold" }}>{this.state.address}</div>
                                        <div className="d-flex justify-content-center" style={{ fontWeight: "bold" }}>{this.state.city}</div>
                                        <div className="d-flex justify-content-center" style={{ fontWeight: "bold" }}>CASH/BILL</div>
                                        <table id="billtableheader" name="billtableheader" className="table mt-2" cellSpacing="1">
                                            <thead>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold' }}>Bill No</th>
                                                    <th style={{ fontWeight: 'bold' }}>TNo</th>
                                                    <th style={{ fontWeight: 'bold' }}>Date</th>
                                                    <th style={{ fontWeight: 'bold' }}>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{this.state.billnumber}</td>
                                                    <td>{this.state.tablename}</td>
                                                    <td >{this.state.billDate}</td>
                                                    <td >{moment().format('LT')}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table id="billtable" name="billtable" className="table" cellSpacing="1">
                                            <thead>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold' }}>Item</th>
                                                    <th style={{ fontWeight: 'bold' }}>Qty</th>
                                                    <th style={{ fontWeight: 'bold' }}>Price</th>
                                                    <th style={{ fontWeight: 'bold' }}>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.cartitem}
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td style={{ fontWeight: 'bold' }}>SubTotal</td>
                                                    <td style={{ fontWeight: 'bold' }}>$ {this.state.totalamount}</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td style={{ fontWeight: 'bold' }}>Tax</td>
                                                    <td style={{ fontWeight: 'bold' }}>$ 0.00</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td style={{ fontWeight: 'bold' }}>Discount</td>
                                                    <td style={{ fontWeight: 'bold' }}>$ {this.state.totaldiscount}</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td style={{ fontWeight: 'bold' }}>Net Amount</td>
                                                    <td style={{ fontWeight: 'bold' }}>$ {this.state.totalamount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div style={{ marginBottom: '20px' }} className="d-flex justify-content-center"> Thank You 😃</div>
                                    </>
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" name="print" onClick={this.printInvoiceReceipt} >Print</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Bills
