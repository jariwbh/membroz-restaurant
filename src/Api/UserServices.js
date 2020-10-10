import axios from '../Helpers/axiosInst'

function getUserList() {
    const body = {
        "search": [{
            "searchfield": "status",
            "searchvalue": "active",
            "criteria": "eq",
            "datattype": "text"
        }]
    }
    return axios.post('users/filter', body);
}

export { getUserList }