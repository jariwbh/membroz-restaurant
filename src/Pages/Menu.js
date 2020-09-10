import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as Api from '../Api/HomeServices'

import CategoryTemplate from '../Templates/CategoryTemplate'
import ItemTemplate from '../Templates/ItemTemplate'

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCategories: [],
            items: [],
            tables: [],
            customers: [],
            currentCartItems: [],
            cartItems: []
        }

        this.getItems = this.getItems.bind(this);
    }

    getItems = (categoryid) => {
        Api.getItems(categoryid).then((response) => {
            this.setState({ items: response.data })
        })
    }

    componentDidMount() {
        Api.getCategory().then((response) => {
            this.setState({ itemCategories: response.data })
        })

        this.getItems();
    }

    render() {
        const { itemCategories, items } = this.state

        return (
            <React.Fragment >
                <main>

                    <div className="container-fluid">
                        <div className="row table-item-gutters">
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <ul className="nav nav-pills mb-2 categories-pills" id="pills-tab" role="tablist">
                                    <CategoryTemplate
                                        key="A11"
                                        id="A11"
                                        titile="All"
                                        selected={true}
                                        handlerClick={() => this.getItems("A11")}
                                    />

                                    {itemCategories.map(category =>
                                        <CategoryTemplate
                                            key={category._id}
                                            id={category._id}
                                            titile={category.property.title}
                                            handlerClick={() => this.getItems(category._id)}
                                        />
                                    )}

                                    {/* <li className="nav-item" role="presentation">
                                        <a className="nav-link active" id="pills-item-1-tab" data-toggle="pill" href="#pills-item-1" role="tab"
                                            aria-controls="pills-item-1" aria-selected="true">Soups</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-item-2-tab" data-toggle="pill" href="#pills-item-2" role="tab"
                                            aria-controls="pills-item-2" aria-selected="false">Starters</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-item-3-tab" data-toggle="pill" href="#pills-item-3" role="tab"
                                            aria-controls="pills-item-3" aria-selected="false">Main Course</a>
                                    </li> */}
                                </ul>
                                <div className="tab-content categories-tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-item-1" role="tabpanel" aria-labelledby="pills-item-1-tab">
                                        <div className="row card-item-gutters">

                                            {items.map(item =>
                                                <ItemTemplate key={item._id}
                                                    imagesrc={item.itemid.item_logo}
                                                    titile={item.itemid.itemname}
                                                    price={item.itemid.sale.rate}
                                                />
                                            )}

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </main>
            </React.Fragment>
        )
    }
}

export default Menu
