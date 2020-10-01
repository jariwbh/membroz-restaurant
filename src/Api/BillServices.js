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
        "select":[
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
    if (body._id){
        return axios.put('billings/' + body._id, body);
    }else{
        return axios.post('billings', body);
    }
}

export { getRunningTables, getByID, save}