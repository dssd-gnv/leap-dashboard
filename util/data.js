import * as d3 from "d3";

const fetchDataLocally = async () => {
    const geoJsonData = await d3.json('/data/va_county.geojson');
    const intakeData = await d3.csv('/data/intake.csv');
    const projectSavingsData = await d3.csv('/data/project_savings.csv');
    return {
        "geoJsonData": geoJsonData,
        "intakeData": intakeData,
        "projectSavingsData": projectSavingsData
    };
};

const fetchProjectSavingsDataFromApi = async () => {
    let query = "{\n" +
        "  boards(ids: [6589717059]) {\n" +
        "    items_page(limit: 500) {\n" +
        "      items {\n" +
        "        column_values(\n" +
        "          ids: [\"numbers3__1\", \"numbers4__1\", \"numbers_2__1\", \"numbers_3__1\", \"numbers_4__1\", \"numbers_5__1\", \"numbers05__1\"]\n" +
        "        ) {\n" +
        "          column {\n" +
        "            title\n" +
        "          }\n" +
        "          text\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}";
    let apiKey = import.meta.env.VITE_MONDAY_API_KEY;
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${apiKey}`,
        },
        body: JSON.stringify({
            'query': query
        })
    });
    return response.json();
}

export {
    fetchDataLocally,
    fetchProjectSavingsDataFromApi
};