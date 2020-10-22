import React, { Component } from 'react'
import moment from 'moment'
import '../Assets/css/Bills.css'
import * as Api from '../Api/BillServices'
import * as Image from '../components/Image'
import { ColumnDirective, ColumnsDirective, GridComponent, CommandColumn } from '@syncfusion/ej2-react-grids';
import { Inject, Sort, Page, Resize, Reorder } from '@syncfusion/ej2-react-grids';

class Bills extends Component {
    constructor(props) {
        super(props);

        this.state = {
            billList: [],
            getBilPrintList: [],
            billheader: null,
            billnumber: '',
            cartitem: null,
            totaldiscount: 0,
            totalamount: null,
            restaurantAddress: '',
            deliveryaddress: '',
            deliveryboy: '',
            tablename: '',
            billDate: '',
            restaurantname: '',
            city: '',
            orderType: '',
            paymentStatus: ''
        }
        this.customAttributes = { class: 'customcss' }
        this.viewBill = this.viewBill.bind(this);
        this.template = this.gridTemplate.bind(this);
        this.printInvoiceReceipt = this.printInvoiceReceipt.bind(this);
    }

    gridTemplate(e) {
        return (
            <span><img src={Image.billicon} onClick={() => this.viewBill(e)} style={{ cursor: 'pointer' }} /></span>
        );
    }

    billList() {
        Api.getBillList().then((response) => {
            this.setState({ getBilPrintList: response.data });
            const billList = response.data.map(bill => ({
                _id: bill._id,
                billnumber: bill.billnumber,
                tablename: bill.tableid ? bill.tableid.property.tablename : "",
                customername: bill.customerid ? bill.customerid.property.fullname : "",
                totalamount: bill.totalamount,
                date: moment(bill.billingdate).format('DD/MM/YYYY'),
                deliveryaddress: bill.property.deliveryaddress ? bill.property.deliveryaddress : "",
                deliveryboy: bill.property.deliveryboyid ? bill.property.deliveryboyid.property.fullname : "",
                orderType: (bill.postype === "delivery" && "Delivery") || (bill.postype === "dinein" && "Dinein") || (bill.postype === "takeaway" && "Take Away"),
                paymentStatus: bill.property.orderstatus === "checkedout" ? "Paid" : "Unpaid"

            }));
            this.setState({ billList: billList });
        })
    }

    componentDidMount() {
        this.billList();
    }

    viewBill(e) {
        const bill = this.state.getBilPrintList.find(x => x._id === e._id)
        Api.getBillFormate().then((response) => {
            this.setState({
                restaurantAddress: response.data.address,
                restaurantname: response.data.branchname, city: (response.data.city + '-' + response.data.postcode)
            })
        })

        const billcartitemlist = bill.items.map(cartitem =>
            <tr key={cartitem._id} id={cartitem._id}>
                <td>{cartitem.item.itemid.itemname}</td>
                <td>{cartitem.quantity}</td>
                <td>{`$ ${cartitem.cost}`}</td>
                <td>{`$ ${cartitem.totalcost}`}</td>
            </tr>
        )

        this.setState({
            cartitem: billcartitemlist,
            totalamount: bill.totalamount,
            billheader: bill.customerid.membernumbername,
            billnumber: bill.billnumber,
            tablename: (bill.tableid ? bill.tableid.property.tablename : ''),
            billDate: moment(bill.billingdate).format('DD/MM/YYYY')
        });

        const btn = document.getElementById("viewbillhandler")
        btn.click();
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
        const { billList } = this.state;
        return (
            <React.Fragment>
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid">
                            <div className="white-box p-3">
                                <form className="row">
                                    <div className="col-md-9">
                                        <h3>Today's Bills</h3>
                                    </div>
                                </form>
                            </div>
                            <span id="viewbillhandler" data-toggle="modal" data-target="#viebillpopup"></span>
                            <GridComponent dataSource={billList} allowSorting={true} allowPaging={true} pageSettings={{ pageCount: 4, pageSizes: true }} allowResizing={true} allowReordering={true}>
                                <ColumnsDirective>
                                    <ColumnDirective headerText="Type" field='orderType' width='100' customAttributes={this.customAttributes} />
                                    <ColumnDirective headerText="Date" field='date' format='dd/MM/yyyy' type='datatime' width='100' customAttributes={this.customAttributes} />
                                    <ColumnDirective headerText="Bill No" field='billnumber' width='100' customAttributes={this.customAttributes} />
                                    <ColumnDirective headerText="Table" field='tablename' width='80' customAttributes={this.customAttributes} />
                                    <ColumnDirective headerText="Customer Name" field='customername' customAttributes={this.customAttributes} />
                                    <ColumnDirective headerText="Address" field='deliveryaddress' width='300' customAttributes={this.customAttributes} />
                                    <ColumnDirective headerText="Delivery Boy" field='deliveryboy' width='120' customAttributes={this.customAttributes} />
                                    <ColumnDirective headerText="Status" field='paymentStatus' width='90' customAttributes={this.customAttributes} />
                                    <ColumnDirective headerText="Amount" field='totalamount' width='100' format="C2" textAlign="Right" customAttributes={this.customAttributes} />
                                    <ColumnDirective headerText='' width='60' template={this.template} customAttributes={this.customAttributes}></ColumnDirective>
                                </ColumnsDirective>
                                <Inject services={[Sort, Page, Resize, Reorder, CommandColumn]} />
                            </GridComponent>
                        </div>
                    </main>
                </div>
                <div className="modal fade" id="viebillpopup" tabIndex="-1" role="dialog" aria-labelledby="viebillpopup" aria-hidden="true">
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
                                        <div className="d-flex justify-content-center" style={{ fontWeight: "bold" }}>{this.state.restaurantAddress}</div>
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
