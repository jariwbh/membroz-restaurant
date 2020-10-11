import axios from '../Helpers/axiosInst'

function getList() {
    const body = {
        "search": [
            { "searchfield": "branchid", "searchvalue": "5ece552879b40e583fa63925", "criteria": "eq", "datatype": "ObjectId" },
            { "searchfield": "property.table", "searchvalue": "true", "criteria": "exists", "datatype": "boolean" }
        ]
    }

    return axios.get('tokens', body);
}


function getListByContextId(contextId) {
    const body = {
        "search": [
            { "searchfield": "branchid", "searchvalue": "5ece552879b40e583fa63925", "criteria": "eq", "datatype": "ObjectId" },
            { "searchfield": "contextid", "searchvalue": contextId, "criteria": "eq", "datatype": "ObjectId" },
            { "searchfield": "property.table", "searchvalue": "true", "criteria": "exists", "datatype": "boolean" }
        ]
    }

    return axios.post('tokens/filter', body);
}

function save(body) {
    if (body._id) {
        return axios.put('tokens/' + body._id, body);
    } else {
        return axios.post('tokens', body);
    }
}

function getLocalToken(currentCart) {
    const token = JSON.parse(localStorage.getItem('token_' + currentCart._id));
    return token;
}

function saveLocalToken(currentCart, token) {
    localStorage.setItem('token_' + currentCart._id, JSON.stringify(token));
}

function removeLocalToken(currentCartID) {
    localStorage.removeItem('token_' + currentCartID)
}

export { getList, getListByContextId, save, getLocalToken, saveLocalToken, removeLocalToken }