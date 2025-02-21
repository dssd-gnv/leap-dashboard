const sendApiRequest = async (query) => {
    const response = await fetch('./api/fetchData', {
        method: 'POST',
        body: JSON.stringify({ "query": query }),
    });
    return await response.json();
}



export default sendApiRequest;