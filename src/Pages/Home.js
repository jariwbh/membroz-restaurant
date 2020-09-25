import React, { Component } from 'react'
import * as Api from '../Api/HomeServices'
import * as ApiTable from '../Api/TableServices'
import RunningTable from '../components/RunningTable'
import CategoryTemplate from '../Templates/CategoryTemplate'
import ItemTemplate from '../Templates/ItemTemplate'
import CartTemplate from '../Templates/CartTemplate'

class Home extends Component {
    constructor(props) {
        super(props);
        document.title = this.props.title
        window.scrollTo(0, 0);

        this.state = {
            itemCategories: [],
            items: [],
            tables: [],
            customers: [],
            runningTables: [],
            currentCart: this.getCurrentCartModel(),
            currentKotToken: { items: [] }
        }

        this.getItems = this.getItems.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.sendKOT = this.sendKOT.bind(this);
    }

    getCategories = () => {
        Api.getCategory().then((response) => {
            this.setState({ itemCategories: response.data })
        })
    }

    getItems = (categoryid) => {
        Api.getItems(categoryid)
            .then((response) => {
                this.setState({ items: response.data })
            })
    }

    getTables = async () => {
        // ApiTable.getTableList().then((response) => {
        //    // console.log('Tables:', response.data)
        //     this.setState({ tables: response.data })
        // })
        console.log('Get Tables Start:')
        let response = await  ApiTable.getTableList()
        this.setState({ tables: response.data })
        console.log('Get Tables:', this.state.tables)
    }

    getRunningTables = () => {
        ApiTable.getRunningTables().then((response) => {
            //console.log('getRunningTables runningTables:',response.data)
            this.setState({ runningTables: response.data })
            this.setCurrentCart();
        })
    }

    getCurrentCartModel = (tableid, customerid) => {
        let tablename = ""
        if (tableid){
            const table = this.state.tables.find(x => x._id === tableid)
            console.log('getCurrentCartModeltable:', this.state.tables)
            console.log('getCurrentCartModeltableID:', tableid)
            console.log('getCurrentCartModeltable:', table)
            if (table) {
                tablename = table.property.tablename
            }
        }
        
        let currentCart = {
            tableid: { _id: tableid, property: { tablename: tablename } },
            customerid: customerid,
            onModel: "Promotion",
            amount: 0,
            totalamount: 0,
            discount: 0,
            taxamount: 0,
            totalquantity: 0,
            items: [],
            kottokens: []
        }

        return currentCart;
    }


    setCurrentCart = () => {
        const urlTableid = this.props.computedMatch.params.tableid
        if ((urlTableid) && (urlTableid.startsWith("tableid="))) {
            const tableid = urlTableid.replace("tableid=", "");
            // console.log('setcurrentCart tableid:', tableid)
            // console.log('setcurrentCart runningTables:', this.state.runningTables)
            let currentCart = this.state.runningTables.find(x => x.tableid._id === tableid)
            if (currentCart) {
                Api.getBillByRunningTableID(tableid).then((response) => {
                    //console.log('getRunningTables runningTables:',response.data)
                    this.setState({ currentCart: response.data })
                })

            } else {
                let runningTables = this.state.runningTables;
                let currentCart = this.getCurrentCartModel(tableid);
                runningTables.push(currentCart);

                this.setState({
                    currentCart: currentCart,
                    runningTables: runningTables
                });
            }
            //Get Running Tables for this table and set select it
            //If not any running table, add it and set selected
        }
        // const currentTable = {tableid:tableid, tablename:""}
        // this.setState({ currentTable: currentTable });
    }

    setCurrentKotToken = () => {
        const currentKotToken = {
            token: "waiting_for_token_number",
            status: "waiting",
            tablenumber: "",
            items: []
        }
        this.setState({ currentKotToken: currentKotToken });
    }

    sendKOT = () => {
        Api.saveCart(this.state.currentCart)
            .then((response) => {
                // console.log('Send KOT Cart :', this.state.currentCart)
                // console.log('Send KOT Response:', response)
                //this.setState({ items: response.data })
            })
    }

    saveCart = () => {
        Api.saveCart(this.state.currentCart)
            .then((response) => {
                //this.setState({ items: response.data })
            })
    }

    addToCart = (item) => {
        let currentCart = this.state.currentCart;
        let itemid = item.itemid._id;
        let cartItem = currentCart.items.find(x => x.id === itemid);

        if (cartItem) {
            cartItem.quantity = Number(cartItem.quantity) + Number(1);
            cartItem.totalcost = Number(cartItem.rate) * Number(cartItem.quantity);
        } else {
            let cartItem = {
                id: item.itemid._id,
                itemname: item.itemid.itemname,
                rate: item.itemid.sale.rate,
                quantity: Number(1),
                cost: item.itemid.sale.rate,
                totalcost: item.itemid.sale.rate,
                discount: 0
            }
            currentCart.items.push(cartItem);
        }

        currentCart.totalquantity = currentCart.items.map(item => item.quantity).reduce((prev, next) => prev + next);
        currentCart.amount = currentCart.items.map(item => item.amount).reduce((prev, next) => prev + next);
        currentCart.totalamount = currentCart.items.map(item => item.totalcost).reduce((prev, next) => prev + next);

        let currentKotToken = this.state.currentKotToken;
        let kotItem = currentKotToken.items.find(x => x.id === itemid);
        if (kotItem) {
            kotItem.quantity = Number(kotItem.quantity) + Number(1);
            kotItem.amount = Number(kotItem.rate) * Number(kotItem.quantity);
        } else {
            let kotItem = {
                id: item.itemid._id,
                itemname: item.itemid.itemname,
                rate: item.itemid.sale.rate,
                quantity: Number(1),
                amount: item.itemid.sale.rate
            }
            currentKotToken.items.push(kotItem);
        }

        this.setState({
            currentKotToken: currentKotToken,
            currentCart: currentCart
        });
    }

    componentDidMount() {
       this.getTables();
        this.getCategories();
        this.getItems();
        this.getRunningTables();
    }

    render() {
        const { itemCategories, items, currentCart, currentKotToken, runningTables } = this.state
        return (
            <React.Fragment >
                <div id="layoutSidenav_content">
                    {/* <main> */}
                    <div className="container-fluid">
                        <RunningTable runningTables={runningTables} />
                        <div className="row table-item-gutters">
                            <CartTemplate currentCart={currentCart} currentKotToken={currentKotToken} sendKOTHandler={() => this.sendKOT} />
                            <div className="col-xl-8 col-lg-8 col-md-7">
                                <ul className="nav nav-pills mb-2 categories-pills" id="pills-tab" role="tablist">
                                    <CategoryTemplate
                                        key="A11"
                                        id="A11"
                                        titile="All"
                                        selected={true}
                                        clickHandler={() => this.getItems()}
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
                                                    clickHandler={() => this.addToCart(item)}
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
