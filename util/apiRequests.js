export const sendMondayApiRequest =  async (query) => {
    const response = await fetch('./api/fetchMondayData', {
        method: 'POST',
        body: JSON.stringify({ "query": query }),
    });
    return await response.json();
}

export const sendGoogleSheetsApiRequest = async () => {
    const response = await fetch('./api/fetchGoogleSheetsData');
    return await response.json();
}