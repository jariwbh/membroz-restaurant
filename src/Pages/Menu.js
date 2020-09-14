import React, { Component } from 'react'
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
        console.log(itemCategories);
        return (
            <React.Fragment >
                <main id="layoutSidenav_content" >
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
                                </ul>
                                <div className="tab-content categories-tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-item-1" role="tabpanel" aria-labelledby="pills-item-1-tab">
                                        <div className="row card-item-gutters">
                                            {items.map(item =>
                                                <ItemTemplate key={item._id}
                                                    item={item}
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
