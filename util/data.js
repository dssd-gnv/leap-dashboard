import * as d3 from "d3";
import _ from "lodash";

const apiKey = import.meta.env.VITE_MONDAY_API_KEY;

const fetchGeoJsonDataLocally = async () => {
    return await d3.json('/data/va_county.geojson');
};

const sendFetchRequest = async (query) => {
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
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

const populateIntakeData = (intakeData, items) => {
    return _.concat(intakeData, items);
}

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
    const responseData = await sendFetchRequest(query);
    return responseData.data.boards[0].items_page.items;
}

const fetchIntakeDataFromApi = async () => {
    let intakeData = [];
    let query = "{\n" +
        "  boards(ids: [5893018197]) {\n" +
        "    items_page(limit: 500) {\n" +
        "      cursor\n" +
        "      items {\n" +
        "        column_values(ids: [\"city__county\"]) {\n" +
        "          text\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}";
    let responseData = await sendFetchRequest(query);
    let items = responseData.data.boards[0].items_page.items;
    intakeData = populateIntakeData(intakeData, items);
    let cursor = responseData.data.boards[0].items_page.cursor;
    while (cursor !== null) {
        let query = "{\n" +
            `  next_items_page(limit: 500, cursor: "${cursor}") {\n` +
            "      cursor\n" +
            "      items {\n" +
            "        column_values(ids: [\"city__county\"]) {\n" +
            "          text\n" +
            "        }\n" +
            "      }\n" +
            "  }\n" +
            "}";
        let responseData = await sendFetchRequest(query);
        items = responseData.data.next_items_page.items;
        intakeData = populateIntakeData(intakeData, items);
        cursor = responseData.data.next_items_page.cursor;
    }
    return intakeData;
}

export {
    fetchGeoJsonDataLocally,
    fetchProjectSavingsDataFromApi,
    fetchIntakeDataFromApi
};