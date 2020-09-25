import axios from '../Helpers/axiosInst'

function allocateTable(body) {
    return (
        axios.post('formdatas/', body)
    )
}

function updateAllocateTable(body) {
    const id = body._id
    return (
        axios.put('formdatas/' + id, body)
    )
}

export { allocateTable, updateAllocateTable }