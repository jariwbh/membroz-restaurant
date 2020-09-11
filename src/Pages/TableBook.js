import React from 'react'

export default function TableBook(props) {
    return (
        <div id="layoutSidenav_content">
            <div className="container-fluid">
                <div className="row table-item-gutters">
                    <div className="col-xl-8 col-lg-8 col-md-7">
                        <ul class="nav nav-pills mb-2 categories-pills" id="pills-tab" role="tablist">
                            <button class="btn btn-primary m-1" role="presentation">
                                {/* <a class="nav-link" id="pills-item-1-tab" data-toggle="pill" href="#pills-item-1" role="tab" aria-controls="pills-item-1" aria-selected="true">Soups</a> */}
                                Dinning
                            </button>
                            <button class="btn btn-primary  m-1" role="presentation">
                                {/* <a class="nav-link" id="pills-item-1-tab" data-toggle="pill" href="#pills-item-1" role="tab" aria-controls="pills-item-1" aria-selected="true">Soups</a> */}
                                Take Away
                            </button>
                            <button class="btn btn-primary  m-1" role="presentation">
                                {/* <a class="nav-link" id="pills-item-1-tab" data-toggle="pill" href="#pills-item-1" role="tab" aria-controls="pills-item-1" aria-selected="true">Soups</a> */}
                                Delivery
                            </button>
                        </ul>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-5">
                        <div className="white-box mb-3">
                            <div className="d-flex person-table-p">
                                <div className="flex-grow-1 person-title"> Person 4</div>
                                <div className="table-num-title"> Table 01</div>
                            </div>
                            <div className="d-flex customer-name-p">
                                <div className="flex-grow-1"> Kamlesh Patel</div>
                                <div className="table-num-title"> <a href="#"><img src="images/add-icon.svg" alt="" /> </a> </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Order</th>
                                            <th className="text-center">Qty</th>
                                            <th className="text-right">Price</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr><tr>
                                            <td>Paneer Tikka Masala</td>
                                            <td className="text-center">1</td>
                                            <td className="text-right">₹220</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
