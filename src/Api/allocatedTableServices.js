import axios from '../Helpers/axiosInst'

function allocateReservationTable(body) {
    return (
        axios.post('formdatas/', body)
    )
}

function updateAllocateReservationTable(body) {
    const id = body._id
    return (
        axios.put('formdatas/' + id, body)
    )
}

export { allocateReservationTable, updateAllocateReservationTable }