import axios from '../Helpers/axiosInst'

const branchid = "5ece552879b40e583fa63925"
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
            { "searchfield": "branchid", "searchvalue": "5ece552879b40e583fa63925", "criteria": "eq", "datatype": "ObjectId" },
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

function getByID(id) {
    return axios.get('billings/' + id);
}

function save(currentCart) {
    const body = { ...currentCart, customerid: currentCart.customerid._id }

    if (body._id.startsWith('unsaved_')) {
        delete body._id
    }

    if (body._id) {
        return axios.put('billings/' + body._id, body);
    } else {
        return axios.post('billings', body);
    }
}

function getLocalOrders() {
    const localOrders = JSON.parse(localStorage.getItem('localorders'));
    return localOrders
    // const currentCart = JSON.parse(localStorage.getItem('token_' + currentCartId));
    // return currentCart;
}

function getLocalOrderByID(currentCartId) {
    let localOrders = this.getLocalOrders();
    let foundOrder

    if (localOrders) {
        foundOrder = localOrders.find(x => x._id === currentCartId)
    }

    return foundOrder
    // const currentCart = JSON.parse(localStorage.getItem('order_' + currentCartId));
    // return currentCart;
}

function saveLocalOrder(currentCart) {
    let localOrders = this.getLocalOrders();
    let filteredOrders = []
    if (localOrders) {
        filteredOrders = localOrders.filter(x => x._id !== currentCart._id)
    }

    if (!filteredOrders) {
        filteredOrders = [];
    }

    filteredOrders.push(currentCart);
    localStorage.setItem('localorders', JSON.stringify(filteredOrders));
}

function removeLocalOrder(currentCartID) {
    let localOrders = this.getLocalOrders();
    let filteredOrders = []

    if (localOrders) {
        filteredOrders = localOrders.filter(x => x._id !== currentCartID)
        localStorage.setItem('localorders', JSON.stringify(filteredOrders));
    }
}

function getBillFormate() {
    const body = {
        "search": [{
            "searchfield": "status",
            "searchvalue": "active",
            "criteria": "eq",
            "datattype": "text"
        }]
    }
    return axios.get('branches/' + branchid);
}

export { getRunningOrders, getByID, save, getLocalOrders, getLocalOrderByID, saveLocalOrder, removeLocalOrder, getBillFormate }