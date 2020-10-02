import axios from '../Helpers/axiosInst'

async function getTableList() {
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

export { getTableList }
