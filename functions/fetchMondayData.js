export default async (req) => {
    const apiKey = process.env.MONDAY_API_KEY;
    const apiEndpoint = process.env.MONDAY_API_ENDPOINT;
    const query = await req.json();
    const response = await fetch(apiEndpoint, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${apiKey}`,
        },
        body: JSON.stringify(query)
    });
    const responseBody = await response.json();
    return new Response(JSON.stringify(responseBody));
}
