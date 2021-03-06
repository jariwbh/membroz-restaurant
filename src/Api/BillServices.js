import axios from '../Helpers/axiosInst'
import moment from 'moment'
import { SECRET_KEY_UNSAVED_LOCAL_ORDERS, getBranchId } from '../Helpers/Auth'

// function getBillByRunningTableID(tableid) {

//     const body = { 
//         "search": [
//             { "searchfield": "branchid", "searchvalue": "5ece552879b40e583fa63925", "criteria": "eq", "datatype": "ObjectId" },
//             { "searchfield": "tableid", "searchvalue": "true", "criteria": "exists", "datatype": "boolean" },
//             { "searchfield": "tableid", "searchvalue":  tableid , "criteria": "eq", "datatype": "ObjectId" },
//             { "searchfield": "property.tablestatus", "searchvalue": "Checkout", "criteria": "ne" }
//         ],
//         "select":[
//             { "fieldname": "items.quantity", "value": 1 },
//             { "fieldname": "amount", "value": 1 },
//             { "fieldname": "totalamount", "value": 1 }
//         ]
//     }

//     return axios.post('billings/filter', body);
// }

function getRunningOrders() {
    const body = {
        "search": [
            { "searchfield": "postype", "searchvalue": ["dinein", "takeaway", "delivery"], "criteria": "in" },
            { "searchfield": "property.orderstatus", "searchvalue": "running", "criteria": "eq" }
        ],
        "select": [
            { "fieldname": "items.quantity", "value": 1 },
            { "fieldname": "amount", "value": 1 },
            { "fieldname": "totalamount", "value": 1 },
            { "fieldname": "property", "value": 1 },
            { "fieldname": "billprefix", "value": 1 },
            { "fieldname": "billnumber", "value": 1 },
            { "fieldname": "postype", "value": 1 }
        ]
    }

    return axios.post('billings/filter', body);
}

function getBillList() {
    const body = {
        "search": [
            { "searchfield": "postype", "searchvalue": ["dinein", "takeaway", "delivery"], "criteria": "in" }
        ],
        "select": [
            { "fieldname": "items.quantity", "value": 1 },
            { "fieldname": "amount", "value": 1 },
            { "fieldname": "totalamount", "value": 1 },
            { "fieldname": "property", "value": 1 },
            { "fieldname": "billprefix", "value": 1 },
            { "fieldname": "billnumber", "value": 1 },
            { "fieldname": "billingdate", "value": 1 },
            { "fieldname": "postype", "value": 1 }
        ]
    }

    return axios.post('billings/filter', body);
}

function getByID(id) {
    return axios.get('billings/' + id);
}

function save(currentCart) {
    let customerid = currentCart.customerid
    if (currentCart.customerid._id) {
        customerid = currentCart.customerid._id
    }

    let body = { ...currentCart, customerid: customerid }

    if (body._id.startsWith('unsaved_')) {
        body.billingdate = moment();
        delete body._id
    }

    if (body._id) {
        return axios.put('billings/' + body._id, body);
    } else {
        return axios.post('billings', body);
    }
}

function paymentSave(currentCart) {
    let customerid = currentCart.customerid
    if (currentCart.customerid._id) {
        customerid = currentCart.customerid._id
    }
    const billingDetail = {
        billid: [currentCart._id],
        billingdate: currentCart.billingdate,
        customerid: customerid,
        onModel: currentCart.onModel,
        paidamount: currentCart.paidamount,
        rounding: 0,
        discount: 0,
        walletamount: 0,
        wallettype: "",
        mode: currentCart.paymentMethod,
        cardnumber: "",
        status: "Paid"
    }
    return axios.post('billingdetails', billingDetail);
}

function getLocalOrders() {
    const localOrders = JSON.parse(localStorage.getItem(SECRET_KEY_UNSAVED_LOCAL_ORDERS));
    return localOrders
    // const currentCart = JSON.parse(localStorage.getItem('token_' + currentCartId));
    // return currentCart;
}

function getLocalOrderByID(currentCartId) {
    let localOrders = getLocalOrders();
    let foundOrder

    if (localOrders) {
        foundOrder = localOrders.find(x => x._id === currentCartId)
    }

    return foundOrder
    // const currentCart = JSON.parse(localStorage.getItem('order_' + currentCartId));
    // return currentCart;
}

function saveLocalOrder(currentCart) {
    let localOrders = getLocalOrders();
    let filteredOrders = []
    if (localOrders) {
        filteredOrders = localOrders.filter(x => x._id !== currentCart._id)
    }

    if (!filteredOrders) {
        filteredOrders = [];
    }

    filteredOrders.push(currentCart);
    localStorage.setItem(SECRET_KEY_UNSAVED_LOCAL_ORDERS, JSON.stringify(filteredOrders));
}

function removeLocalOrder(currentCartID) {
    let localOrders = getLocalOrders();
    let filteredOrders = []

    if (localOrders) {
        filteredOrders = localOrders.filter(x => x._id !== currentCartID)
        localStorage.setItem(SECRET_KEY_UNSAVED_LOCAL_ORDERS, JSON.stringify(filteredOrders));
    }
}

function getBillFormat() {
    // const body = {
    //     "search": [{
    //         "searchfield": "status",
    //         "searchvalue": "active",
    //         "criteria": "eq",
    //         "datattype": "text"
    //     }]
    // }

    return axios.get('branches/' + getBranchId());
}

export { getRunningOrders, getBillList, getByID, save, paymentSave, getLocalOrders, getLocalOrderByID, saveLocalOrder, removeLocalOrder, getBillFormat }