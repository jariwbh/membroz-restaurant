
function processResponse(obj, setName, promise) {
    return promise
        .then((response) => {
            obj.setState({ [setName]: response.data })
        });
}

export { processResponse }