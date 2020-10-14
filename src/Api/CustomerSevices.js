import axios from '../Helpers/axiosInst'

function getCustomerList() {
    const body = {
        "search": [
            { "searchfield": "status", "searchvalue": "active", "criteria": "eq" }]
    }
    return axios.post('common/searchcontacts', body);
}


function save(body) {
    return (
        axios.post('prospects/', body)
    )
}

export { getCustomerList, save }

