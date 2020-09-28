import axios from '../Helpers/axiosInst'

const tableformid = "5f6c8bce99e17f1b9c62a1e5"
const allocatedstatus = "allocated"
const activestatus = "active"

function getWaitingTableList() {
    const body = {
        "search": [{
            "searchfield": "formid",
            "searchvalue": tableformid,
            "criteria": "eq",
            "datatype": "ObjectId"
        }, { "searchfield": "status", "searchvalue": "active", "criteria": "eq" },
        { "searchfield": "property.status", "searchvalue": "active", "criteria": "eq" }
        ], "sort": { "createdAt": 1 }
    }
    return axios.post('formdatas/filter', body);
}

function deleteWaitingTableRecord(id) {
    return (
        axios.delete('formdatas/' + id)
    )
}

function addWaitingTableRecord(body) {
    return (
        axios.post('formdatas/', body)
    )
}

function updateWaitingTableRecord(body) {
    const id = body._id
    return (
        axios.put('formdatas/' + id, body)
    )
}

export {
    getWaitingTableList, deleteWaitingTableRecord, addWaitingTableRecord,
    updateWaitingTableRecord, tableformid, allocatedstatus, activestatus
}