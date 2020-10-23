import axios from '../Helpers/axiosInst'

function getList() {
    const body = {
        "search": [
            { "searchfield": "property.table", "searchvalue": "true", "criteria": "exists", "datatype": "boolean" }
        ]
    }

    return axios.get('tokens', body);
}


function getListByContextId(contextId) {
    const body = {
        "search": [
            { "searchfield": "contextid", "searchvalue": contextId, "criteria": "eq", "datatype": "ObjectId" }
        ]
    }

    return axios.post('tokens/filter', body);
}

function save(token) {
    if (token._id) {
        return axios.put('tokens/' + token._id, token);
    } else {
        delete token.prefix
        delete token.tokennumber
        return axios.post('tokens', token);
    }
}

export { getList, getListByContextId, save }