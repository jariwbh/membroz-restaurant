import axios from '../Helpers/axiosInst'

function getCategory() {
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

export { getCategory, getItems }