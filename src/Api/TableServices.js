import axios from '../Helpers/axiosInst'

async function  getTableList() {
    const body = {
        "search": [{
            "searchfield": "formid",
            "searchvalue": "5f58b63799e17f30046a302d",
            "criteria": "eq",
            "datatype": "ObjectId"
        }]
    }

    return await axios.post('formdatas/filter', body);
}

function getRunningTables() {
    const body = {
        "search": [
            { "searchfield": "branchid", "searchvalue": "5ece552879b40e583fa63925", "criteria": "eq", "datatype": "ObjectId" },
            { "searchfield": "tableid", "searchvalue": "true", "criteria": "exists", "datatype": "boolean" },
            { "searchfield": "property.tablestatus", "searchvalue": "running", "criteria": "eq" }
        ],
        "select":[
            { "fieldname": "items.quantity", "value": 1 },
            { "fieldname": "amount", "value": 1 },
            { "fieldname": "totalamount", "value": 1 }
        ]
    }

    return axios.post('billings/filter', body);
}

export { getTableList, getRunningTables }