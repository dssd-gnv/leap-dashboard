import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { sendMondayApiRequest } from '../../util/apiRequests.js';
import _ from "lodash";

export const fetchProjectSavingsDataFromApi = createAsyncThunk(
    'fetchProjectSavingsDataFromApi', async () => {
        try {
            let query = "{\n" +
                "  boards(ids: [6589717059]) {\n" +
                "    items_page(limit: 500) {\n" +
                "      items {\n" +
                "        column_values(\n" +
                "          ids: [\"numbers3__1\", \"numbers4__1\", \"numbers_2__1\", \"numbers_3__1\", \"numbers_4__1\", \"numbers_5__1\"]\n" +
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
            const responseData = await sendMondayApiRequest(query);
            return responseData?.data?.boards[0].items_page?.items;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    });

const dashboardStatsSlice = createSlice({
    name: 'dashboardStats',
    initialState: {
        "dashboardStatsLoading": true,
        "dashboardStatsData": {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProjectSavingsDataFromApi.fulfilled, (state, action) => {
            let newData = {};
            _.forEach(action.payload, (item) => {
                const column_values = item?.column_values;
                _.forEach(column_values, (column_value) => {
                    const key = column_value?.column?.title;
                    let value = parseFloat(column_value?.text);
                    if (_.isNaN(value)) {
                        value = 0;
                    }
                    if (_.includes(_.keys(newData), key)) {
                        newData[key].push(value);
                    } else {
                        newData[key] = [value];
                    }
                });
            });
            return {
                "dashboardStatsLoading": false,
                "dashboardStatsData": newData
            }
        });
    }
});

export default dashboardStatsSlice.reducer;