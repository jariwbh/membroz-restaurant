import axios from '../Helpers/axiosInst'

export const tableformid = "5f6085f699e17f0da81b0023"

export const RESERVEDTABLESTATUS = {
    ACTIVE: "active",
    ALLOCATED: "allocated"
}

function getList() {
    const body = {
        "search": [{
            "searchfield": "formid",
            "searchvalue": "5f6085f699e17f0da81b0023",
            "criteria": "eq",
            "datatype": "ObjectId"
        },
        { "searchfield": "status", "searchvalue": "active", "criteria": "eq" },
        { "searchfield": "property.status", "searchvalue": "active", "criteria": "eq" }
        ], "sort": { "createdAt": 1 }
    }
    return axios.post('formdatas/filter', body);
}

function deleteById(id) {
    return axios.delete('formdatas/' + id)
}

function save(body) {
    if (body._id === "") {
        return axios.post('formdatas/', body)
    } else {
        return axios.put('formdatas/' + body._id, body)
    }
}


export { getList, save, deleteById }