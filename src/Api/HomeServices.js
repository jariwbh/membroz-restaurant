import axios from '../Helpers/axiosInst'

function getCategory(id) {
    const body = {
        "search": [
            {
            "searchfield": "formid",
            "searchvalue": "5e058897b0c5fb2b6c15cc69",
            "criteria": "eq",
            "datatype": "ObjectId"
        },
        { "searchfield": "status", "searchvalue": "active", "criteria": "eq" }
    ]
    }

    return axios.post('formdatas/filter', body);
}

function getItems(id) {
    let body

    if (id != null) {
        body = {
            "searchref": [
                { "searchfield": "itemid.offertype", "searchvalue": { id }, "criteria": "eq", "datatype": "objectid" }
            ]
        }
    } else {
        body = {
            "search": [
                { "searchfield": "status", "searchvalue": "active", "criteria": "eq" }
            ]
        }

    }
   
    return axios.post('membershipoffers/filter', body) 
}

function getTables(body) {
    return 1;//axios.post('membershipoffers/filter', body);
}

function getCustomers(body) {
    return 1;//axios.post('membershipoffers/filter', body);
}

function getBillByRunningTableID(tableid) {
    // const body = { 
    //     "search": [
    //         { "searchfield": "branchid", "searchvalue": "5ece552879b40e583fa63925", "criteria": "eq", "datatype": "ObjectId" },
    //         { "searchfield": "tableid", "searchvalue": { tableid }, "criteria": "eq", "datatype": "ObjectId" },
    //         { "searchfield": "property.tablestatus", "searchvalue": "checkout", "criteria": "ne" }
    //     ]
    // }

    const body = { 
        "search": [
            { "searchfield": "branchid", "searchvalue": "5ece552879b40e583fa63925", "criteria": "eq", "datatype": "ObjectId" },
            { "searchfield": "tableid", "searchvalue": "true", "criteria": "exists", "datatype": "boolean" },
            { "searchfield": "tableid", "searchvalue":  tableid , "criteria": "eq", "datatype": "ObjectId" },
            { "searchfield": "property.tablestatus", "searchvalue": "Checkout", "criteria": "ne" }
        ],
        "select":[
            { "fieldname": "items.quantity", "value": 1 },
            { "fieldname": "amount", "value": 1 },
            { "fieldname": "totalamount", "value": 1 }
        ]
    }


    console.log('getBillByRunningTableID tableid:', tableid)
    console.log('getBillByRunningTableID Body:', body)
    return axios.post('billings/filter', body);
}

function saveCart(body) {
    if (body.id){
        return axios.put('billings/' + body._id, body);
    }else{
        return axios.post('billings', body);
    }
}



export { getCategory, getItems, getTables, getCustomers, getBillByRunningTableID, saveCart}