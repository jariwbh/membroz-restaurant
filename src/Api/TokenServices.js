import axios from '../Helpers/axiosInst'

function getList() {
    const body = { 
        "search": [
            { "searchfield": "branchid", "searchvalue": "5ece552879b40e583fa63925", "criteria": "eq", "datatype": "ObjectId" },
            { "searchfield": "property.table", "searchvalue": "true", "criteria": "exists", "datatype": "boolean"}
        ]
    }

    return axios.get('tokens', body);
}

function save(body) {
    if (body._id){
        return axios.put('tokens/' + body._id, body);
    }else{
        return axios.post('tokens', body);
    }
}

export { getList, save }