import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import sendApiRequest from '../../util/apiRequest.js';
import _ from "lodash";

export const fetchIntakeDataFromApi = createAsyncThunk(
    'fetchIntakeDataFromApi', async () => {
        try {
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
            let responseData = await sendApiRequest(query);
            let items = responseData.data.boards[0].items_page.items;
            intakeData = _.concat(intakeData, items);
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
                let responseData = await sendApiRequest(query);
                items = responseData?.data?.next_items_page?.items;
                intakeData = _.concat(intakeData, items);
                cursor = responseData?.data?.next_items_page?.cursor;
            }
            return intakeData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    });

const countyCountsSlice = createSlice({
    name: 'countyCounts',
    initialState: {
        "countyCountsLoading": true,
        "countyCountsData": {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchIntakeDataFromApi.fulfilled, (state, action) => {
            const counties = _.map(action.payload, (item) => item?.column_values[0].text);
            return {"countyCountsLoading": false, "countyCountsData": _.countBy(counties)};
        });
    }
});

export default countyCountsSlice.reducer;