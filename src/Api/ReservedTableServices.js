import axios from '../Helpers/axiosInst'

const tableformid = "5f6085f699e17f0da81b0023"
const allocatedstatus = "allocated"
const activestatus = "active"

function getReservationTableList() {
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

function deleteReservationTableRecord(id) {
    return (
        axios.delete('formdatas/' + id)
    )
}

function addReservationTableRecord(body) {
    return (
        axios.post('formdatas/', body)
    )
}

function updateReservationTableRecord(body) {
    const id = body._id
    return (
        axios.put('formdatas/' + id, body)
    )
}

export {
    getReservationTableList, deleteReservationTableRecord,
    addReservationTableRecord, updateReservationTableRecord,
    tableformid, allocatedstatus, activestatus
}