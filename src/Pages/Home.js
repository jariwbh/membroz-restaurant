import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as Api from '../Api/HomeServices'

import Table from '../components/Table'
import CategoryTemplate from '../Templates/CategoryTemplate'
import ItemTemplate from '../Templates/ItemTemplate'
import CartTemplate from '../Templates/CartTemplate'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCategories: [],
            items: [],
            tables: [],
            customers: [],
            orders:[],
            currentCartItems: [],
            currentOrder:{items:[]}
        }
        // itemname:"", quantity:5, rate:""
        this.getItems = this.getItems.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }

    getItems = (categoryid) => {
        Api.getItems(categoryid).then((response) => {
            this.setState({ items: response.data })
        })
    }

    addToCart = (item) => {
       //this.setState({currentOrder.cartItems: []})
       var currentOrder = {...this.state.currentOrder}
       currentOrder.items.push(item);
       this.setState({currentOrder})

       console.log('AddToCart', this.setState.currentOrder)
    }

    componentDidMount() {
        Api.getCategory().then((response) => {
            this.setState({ itemCategories: response.data })
        })

        this.getItems();
    }

    render() {
        const { itemCategories, items, currentOrder } = this.state

        return (
            <React.Fragment >
                <div id="layoutSidenav_content">
                {/* <main> */}
                    <div className="container-fluid">
                        <Table />
                        <div className="row table-item-gutters">
                            <CartTemplate currentOrder={currentOrder}/>
                            <div className="col-xl-8 col-lg-8 col-md-7">
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
                                            clickHandler={() => this.getItems(category._id)}
                                        />
                                    )}

                                </ul>

                                <div className="tab-content categories-tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-item-1" role="tabpanel" aria-labelledby="pills-item-1-tab">
                                        <div className="row card-item-gutters">

                                            {items.map(item =>
                                                <ItemTemplate key={item._id}
                                                    item={item}
                                                    // clickHandler={() => this.addToCart(item)}
                                                />
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* </main> */}
                </div>
            </React.Fragment>
        )
    }
}

export default Home
