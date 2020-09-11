import axios from '../Helpers/axiosInst'

function getTableList() {
    const body = {
        "search": [{
            "searchfield": "formid",
            "searchvalue": "5f58b63799e17f30046a302d",
            "criteria": "eq",
            "datatype": "ObjectId"
        }]
    }

    return axios.post('formdatas/filter', body);
}

export { getTableList }