export default async (req) => {
    const apiEndpoint = process.env.GOOGLE_SHEETS_API_ENDPOINT;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const headers = new Headers({
        'X-goog-api-key': process.env.GOOGLE_SHEETS_API_KEY,
        'Content-Type': 'application/json; charset=utf-8',
    });
    const params = new URLSearchParams();
    params.append('includeGridData', "True");
    params.append('ranges', "A:H");
    const url = `${apiEndpoint}/${spreadsheetId}?${params}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });
    const responseBody = await response.json();
    return new Response(JSON.stringify(responseBody));
}