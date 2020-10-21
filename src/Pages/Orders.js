import React, { Component } from 'react'
import uuid from 'react-uuid'

import SignalRService from '../Helpers/signalRService';
import * as Sounds from '../components/Sounds'

import * as ItemServices from '../Api/ItemServices'
import * as BillServices from '../Api/BillServices'
import * as TableServices from '../Api/TableServices'
import * as TokenServices from '../Api/TokenServices'
import * as UserServices from '../Api/UserServices'

import OrderTypeSelectionUI from '../Templates/OrderTypeSelectionUI'
import RunningOrders from '../components/RunningOrders'
import CategoryTemplate from '../Templates/CategoryTemplate'
import ItemTemplate from '../Templates/ItemTemplate'
import CartTemplate from '../Templates/CartTemplate'

import TableBook from '../Pages/TableBook'
import Payment from '../components/Payment';

import TakeOrderPopup from '../components/TakeOrderPopup'
import ChangeCustomerPopup from '../components/ChangeCustomerPopup'

import { PAGES, ORDERTYPES, TOKENSTATUS } from './OrderEnums'

class Orders extends Component {
    constructor(props) {
        super(props);
        document.title = this.props.title
        window.scrollTo(0, 0);

        this.senderID = uuid();

        this.state = {
            activePage: PAGES.ORDERS,
            activeOrderType: ORDERTYPES.DINEIN,
            itemCategories: [],
            items: [],
            tables: [],
            customers: [],
            deliveryBoyList: [],
            runningOrders: [],
            currentCart: undefined,
            tokenList: []
        }

        this.getItems = this.getItems.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.newOrderHandler = this.newOrderHandler.bind(this);
        this.setCurrentCartHandler = this.setCurrentCartHandler.bind(this);
        this.sendToken = this.sendToken.bind(this);
        this.changeTokenStatusHandler = this.changeTokenStatusHandler.bind(this);

        this.doPayment = this.doPayment.bind(this);

        this.setActivePage = this.setActivePage.bind(this);
        this.changeOrderType = this.changeOrderType.bind(this);
    }


    receiveMessage = async (msg) => {
        const token = JSON.parse(msg)

        if (token.senderID && token.senderID !== this.senderID) {

            let currentCart = this.state.currentCart;
            if (currentCart && currentCart._id) {
                let tokenList = await this.getTokenList(currentCart._id)
                this.setState({ tokenList: tokenList })

                if (token.status === 'prepared') {
                    this.playAudio();
                }
            }
        }
    }

    changeTokenStatusHandler = async (token) => {
        let tokenList = this.state.tokenList
        let foundToken = tokenList.find(x => x._id === token._id)
        if (foundToken) {
            switch (token.status) {
                case TOKENSTATUS.WAITING:
                    foundToken.status = TOKENSTATUS.INPROGRESS;
                    break;
                case TOKENSTATUS.INPROGRESS:
                    foundToken.status = TOKENSTATUS.PREPARED;
                    break;
                case TOKENSTATUS.PREPARED:
                    foundToken.status = TOKENSTATUS.SERVED;
                    break;
                case TOKENSTATUS.SERVED:
                    foundToken.status = TOKENSTATUS.PREPARED;
                    break;
                default:
            }

            const responseToken = await TokenServices.save(foundToken)
            foundToken = responseToken.data;
            foundToken.senderID = this.senderID;

            this.setState({ tokenList: tokenList })
        }
    }

    setActivePage = (activePageName) => {
        this.setState({ activePage: activePageName });
    }

    changeOrderType = (orderTypeName) => {
        if (this.state.activeOrderType !== orderTypeName) {
            this.state.activeOrderType = orderTypeName
            this.setState({ activeOrderType: orderTypeName });
            this.setCurrentCartHandler()
        }
    }

    playAudio = () => {
        var audio = new Audio(Sounds.notification); audio.play(); audio.loop = false;
    }

    getTables = async () => {
        const response = await TableServices.getTableList()
        return response.data
    }

    getCategories = async () => {
        const response = await ItemServices.getCategory()
        return response.data
    }

    getItems = async (categoryid, needSetState = false) => {
        const response = await ItemServices.getItems(categoryid)
        if (needSetState) {
            this.setState({ items: response.data })
        }
        return response.data
    }

    getDeliveryBoyList = async () => {
        const response = await UserServices.getUserList()
        return response.data
    }


    getRunningOrders = async () => {
        const response = await BillServices.getRunningOrders();
        let runningOrders = response.data;
        const localRunningOrder = BillServices.getLocalOrders();

        let runningTableMerged = localRunningOrder
        if (localRunningOrder) {

            runningOrders.forEach(element => {
                let order = localRunningOrder.find(x => x._id === element._id)
                if (!order) {
                    runningTableMerged.push(element)
                }
            });

        } else {
            runningTableMerged = runningOrders
        }

        return runningTableMerged;

        // this.setState({ runningOrders: runningTableMerged });
        // this.setCurrentCartHandler();
    }

    getTokenList = async (contextid) => {
        if (contextid.startsWith('unsaved_')) {
            return []
        }

        let response = await TokenServices.getListByContextId(contextid)
        //this.setState({ tokenList: response.data })
        return response.data;
    }

    getTokenModel = (currentCart) => {
        let table = undefined

        if (this.state.activeOrderType === ORDERTYPES.DINEIN) {
            table = { _id: currentCart.tableid._id, tablename: currentCart.tableid.property.tablename }
        }

        let token = {
            status: "waiting",
            contextid: "",
            onModel: "Billing",
            property: {
                type: currentCart.postype,
                table: table,
                items: []
            }
        }

        return token
    }

    newOrderHandler = () => {
        this.setState({ activePage: PAGES.TABLEBOOK });
    }

    changeCustomerHandler = (customer, delivery) => {
        let currentCart = this.state.currentCart
        if (customer) {
            currentCart.onModel = customer.onModel
            currentCart.customerid._id = customer.customerid._id
            currentCart.customerid.property.fullname = customer.customerid.property.fullname
            currentCart.customerid.property.mobile_number = customer.customerid.property.mobile_number
        }

        if (delivery) {
            currentCart.property.deliveryaddress = delivery.deliveryaddress
            currentCart.property.deliveryboyid = delivery.deliveryboyid
        }

        this.setState({ currentCart: currentCart });
        BillServices.saveLocalOrder(currentCart);
    }

    setCurrentCartHandler = async (order) => {
        let orderType = this.state.activeOrderType

        let runningOrders = []
        let currentCart = undefined
        let tokenList = []
        let items = this.state.items
        let refreshedItems = items

        if (order) {
            currentCart = this.state.runningOrders.find(x => x._id === order._id)
            if (currentCart) {
                if (!currentCart._id.startsWith('unsaved_')) {
                    let response = await BillServices.getByID(currentCart._id)
                    currentCart = response.data
                    tokenList = await this.getTokenList(currentCart._id)
                }
            }

            if (!currentCart) {
                runningOrders = this.state.runningOrders;
                currentCart = order;
                runningOrders.unshift(currentCart);
                BillServices.saveLocalOrder(currentCart);
            }

        } else {
            const filterRunningOrders = this.state.runningOrders.filter(x => x.postype === orderType)
            if (filterRunningOrders && filterRunningOrders.length > 0) {
                currentCart = filterRunningOrders[0] //filterRunningOrders.length - 1
                tokenList = await this.getTokenList(currentCart._id)
            }
        }

        if (currentCart) {
            let currentCartTemp = BillServices.getLocalOrderByID(currentCart._id)
            if (currentCartTemp) {
                currentCart = currentCartTemp
            }

            if (!currentCart.token) {
                currentCart.token = this.getTokenModel(currentCart)
            }

            refreshedItems = this.getRefreshedItems(items, currentCart)
        }

        if (runningOrders.length > 0) {
            this.setState({
                items: refreshedItems,
                runningOrders: runningOrders,
                currentCart: currentCart,
                tokenList: tokenList,
                activePage: PAGES.ORDERS
            });
        } else {
            this.setState({
                items: refreshedItems,
                currentCart: currentCart,
                tokenList: tokenList,
                activePage: PAGES.ORDERS
            });
        }
    }

    getRefreshedItems = (itemList, currentCart) => {
        let refreshedItemList = itemList.map(x1 => {
            let item = currentCart.token.property.items.find(x2 => x2._id === x1._id)
            if (item) {
                return { ...x1, tokenquantity: item.quantity };
            } else {
                return { ...x1, tokenquantity: 0 };
            }
        });

        return refreshedItemList
    }

    validateMe = (currentCart, currentToken) => {
        if (!currentCart) {
            alert("ERROR! Current Cart is undefined, Note this error with steps")
            return false;
        }
        if (!currentCart.customerid) {
            alert("ERROR! Current Cart is undefined, Note this error with steps")
            return false;
        }

        if (currentCart.onModel === '') {
            alert("ERROR! Current Cart onModel is Empty, Note this error with steps")
            return false;
        }

        if (!currentCart.property) {
            alert("ERROR! currentCart.property is undefined, Note this error with steps")
            return false;
        }
        if (!currentToken) {
            alert("ERROR! Current Token is NULL, Note this error with steps")
            return false;
        }
        if (!currentToken.property.items) {
            alert("WARNING! Current Token Items is NULL, Note this error with steps")
            return false;
        }
        if (currentToken.property.items.length === 0) {
            alert("WARNING!  Current Token Items is Empty, Note this error with steps")
            return false;
        }

        return true;
    }

    sendToken = async () => {
        let currentCart = this.state.currentCart
        let currentToken = this.state.currentCart.token
        const beforeSaveID = currentCart._id

        if (!this.validateMe(currentCart, currentToken)) {
            return;
        }

        const response = await BillServices.save(currentCart)
        if (response.status === 200 && !response.data.errors) {

            currentCart = response.data
            currentToken.contextid = currentCart._id
            const responseToken = await TokenServices.save(currentToken)
            if (responseToken.status === 200 && !responseToken.data.errors) {
                currentToken = responseToken.data;
                currentToken.senderID = this.senderID;

                SignalRService.sendMessage(JSON.stringify(currentToken));

                if (this.state.activeOrderType === ORDERTYPES.TAKEAWAY || this.state.activeOrderType === ORDERTYPES.DELIVERY) {
                    if (beforeSaveID.startsWith('unsaved_')) {
                        currentCart.property.token = currentToken
                        const response = await BillServices.save(currentCart)
                        currentCart = response.data
                    }
                }
            } else {
                console.log('sendToken Save Token ERROR', responseToken.data.errors)
                alert("sendToken Save Token ERROR : " + responseToken.data.errors.toString())
            }

            BillServices.removeLocalOrder(beforeSaveID);

            const responseGetByID = await BillServices.getByID(currentCart._id)
            currentCart = responseGetByID.data
            currentCart.token = this.getTokenModel(currentCart)
            let updatedRunningOrders = this.state.runningOrders.map(x => x._id === beforeSaveID ? currentCart : x);

            let tokenList = await this.getTokenList(currentCart._id)
            let refreshedItems = this.getRefreshedItems(this.state.items, currentCart)

            this.setState({ items: refreshedItems, runningOrders: updatedRunningOrders, currentCart: currentCart, tokenList: tokenList })
        } else {
            console.log('sendToken Save Bill ERROR', response.data.errors)
            alert("sendToken Save Bill ERROR : " + response.data.errors.toString())
        }
    }

    doPayment = async (currentCart) => {
        this.state.currentCart = currentCart

        const beforeSaveID = currentCart._id

        const response = await BillServices.save(currentCart)
        if (response.status === 200) {
            BillServices.removeLocalOrder(beforeSaveID);

            const runningOrders = await this.getRunningOrders();

            this.setState({ runningOrders: runningOrders, activePage: PAGES.ORDERS })

            this.setCurrentCartHandler();
        }
    }

    addToCart = (item) => {
        let currentCart = this.addItemToCart(item._id, 1);
        let token = this.addItemToToken(item._id, 1);

        currentCart.token = token;
        BillServices.saveLocalOrder(currentCart);
        this.setState({ currentCart: currentCart });
    }

    addItemToCart = (itemid, quantity) => {
        let currentCart = this.state.currentCart
        const item = this.state.items.find(x => x._id === itemid);

        let cartItem = currentCart.items.find(x => ((x.item._id) && (x.item._id === itemid)) || ((x.item) && (x.item === itemid)));
        if (cartItem) {
            cartItem.quantity = Number(cartItem.quantity) + Number(quantity);
            cartItem.totalcost = Number(cartItem.cost) * Number(cartItem.quantity);
        } else {
            let cartItem = {
                _id: itemid,
                item: itemid,
                quantity: Number(quantity),
                cost: item.itemid.sale.rate,
                totalcost: item.itemid.sale.rate,
                discount: 0,
                itemname: item.itemid.itemname,
                tax: []
            }
            currentCart.items.push(cartItem);
        }

        currentCart.totalquantity = currentCart.items.map(item => item.quantity).reduce((prev, next) => prev + next);
        currentCart.amount = currentCart.items.map(item => item.amount).reduce((prev, next) => prev + next);
        currentCart.totalamount = currentCart.items.map(item => item.totalcost).reduce((prev, next) => prev + next);

        return currentCart;
    }

    addItemToToken = (itemid, quantity) => {
        let currentCart = this.state.currentCart
        let token = currentCart.token;

        if (!token) {
            token = this.getTokenModel(currentCart)
        }

        let item = this.state.items.find(x => x._id === itemid);
        let tokenItem = token.property.items.find(x => x._id === itemid);
        if (tokenItem) {
            tokenItem.quantity = Number(tokenItem.quantity) + Number(quantity);
            tokenItem.totalcost = Number(tokenItem.cost) * Number(tokenItem.quantity);
        } else {
            tokenItem = {
                _id: itemid,
                quantity: Number(quantity),
                itemname: item.itemid.itemname,
                cost: item.itemid.sale.rate,
                totalcost: item.itemid.sale.rate
            }
            token.property.items.push(tokenItem);
        }

        item.tokenquantity = tokenItem.quantity

        token.totalquantity = token.property.items.map(item => item.quantity).reduce((prev, next) => prev + next);
        token.totalamount = token.property.items.map(item => item.totalcost).reduce((prev, next) => prev + next);

        currentCart.token = token;
        return token;
    }

    async componentDidMount() {
        const tables = await this.getTables();
        const itemCategories = await this.getCategories();
        const items = await this.getItems();
        const runningOrders = await this.getRunningOrders();
        const deliveryBoyList = await this.getDeliveryBoyList();

        this.setState({ tables: tables, itemCategories: itemCategories, items: items, runningOrders: runningOrders, deliveryBoyList: deliveryBoyList })

        this.setCurrentCartHandler();

        SignalRService.registerReceiveEvent((msg) => {
            this.receiveMessage(msg);
        });
    }


    render() {
        const { activePage, activeOrderType, tables, itemCategories, items, currentCart, runningOrders, tokenList, deliveryBoyList } = this.state

        if (activePage === PAGES.TABLEBOOK) {
            return <TableBook tableList={tables} runningOrders={runningOrders} setCurrentCartHandler={this.setCurrentCartHandler} />
        }

        return (
            <React.Fragment >
                <div id="layoutSidenav_content">
                    {/* <main> */}
                    <TakeOrderPopup activeOrderType={activeOrderType} deliveryBoyList={deliveryBoyList} setCurrentCartHandler={this.setCurrentCartHandler} />
                    <ChangeCustomerPopup currentCart={currentCart} activeOrderType={activeOrderType} deliveryBoyList={deliveryBoyList} changeCustomerHandler={this.changeCustomerHandler} />
                    <div className="container-fluid">
                        <div className="row table-item-gutters">
                            <OrderTypeSelectionUI activeOrderType={activeOrderType} changeOrderType={this.changeOrderType}></OrderTypeSelectionUI>
                            <RunningOrders activeOrderType={activeOrderType} currentCart={currentCart} runningOrders={runningOrders} setCurrentCartHandler={this.setCurrentCartHandler} newOrderHandler={this.newOrderHandler} />
                        </div>
                        {(currentCart) &&
                            <div className="row table-item-gutters">
                                <CartTemplate activePage={activePage} currentCart={currentCart} tokenList={tokenList} sendTokenHandler={this.sendToken} changeTokenStatusHandler={this.changeTokenStatusHandler} setActivePage={this.setActivePage} />

                                {(activePage === PAGES.PAYMENT) &&
                                    <Payment currentCart={currentCart} deliveryBoyList={deliveryBoyList} activeOrderType={activeOrderType} doPayment={this.doPayment} setActivePage={this.setActivePage}></Payment>
                                }
                                {(activePage === PAGES.ORDERS) &&
                                    <div className="col-xl-8 col-lg-8 col-md-7">
                                        <ul className="nav nav-pills mb-2 categories-pills" id="pills-tab" role="tablist">
                                            <CategoryTemplate
                                                key="A11"
                                                id="A11"
                                                titile="All"
                                                selected={true}
                                                clickHandler={() => this.getItems(undefined, true)}
                                            />

                                            {itemCategories.map(category =>
                                                <CategoryTemplate
                                                    key={category._id}
                                                    id={category._id}
                                                    titile={category.property.title}
                                                    clickHandler={() => this.getItems(category._id, true)}
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
                                }
                            </div>
                        }
                    </div>
                    {/* </main> */}
                </div>
            </React.Fragment>
        )
    }
}

export default Orders
