import axios from '../Helpers/axiosInst'

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

function getRunningTables() {
    const body = {
        "search": [
            { "searchfield": "branchid", "searchvalue": "5ece552879b40e583fa63925", "criteria": "eq", "datatype": "ObjectId" },
            { "searchfield": "tableid", "searchvalue": "true", "criteria": "exists", "datatype": "boolean" },
            { "searchfield": "property.posstatus", "searchvalue": "running", "criteria": "eq" }
        ],
        "select": [
            { "fieldname": "items.quantity", "value": 1 },
            { "fieldname": "amount", "value": 1 },
            { "fieldname": "totalamount", "value": 1 },
            { "fieldname": "property", "value": 1 },
        ]
    }

    return axios.post('billings/filter', body);
}

function getByID(id) {
    return axios.get('billings/' + id);
}

function save(body) {
    if (body._id) {
        return axios.put('billings/' + body._id, body);
    } else {
        return axios.post('billings', body);
    }
}

function getLocalBills() {
    const localBills = JSON.parse(localStorage.getItem('localunsavedbill'));
    return localBills;
}

function saveLocalBill(bill) {
    let localBills = this.getLocalBills();

    if (!localBills) {
        localBills = [];
    }

    localBills.push(bill);
    localStorage.setItem('localunsavedbill', JSON.stringify(localBills));
}

function removeLocalBill(currentCart) {
    if (currentCart && currentCart.unsavedid) {
        let localBills = this.getLocalBills();
        if (localBills) {
            const filteredBills = localBills.filter(bill => bill.unsavedid !== currentCart.unsavedid)
            localStorage.setItem('localunsavedbill', JSON.stringify(filteredBills));
        }
    }
}

export { getRunningTables, getByID, save, getLocalBills, saveLocalBill, removeLocalBill }