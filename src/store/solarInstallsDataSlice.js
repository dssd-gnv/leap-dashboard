import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {sendGoogleSheetsApiRequest} from "../../util/apiRequests.js";
import _ from "lodash";


export const fetchSolarInstallsDataFromApi = createAsyncThunk(
    'fetchSolarInstallsDataFromApi', async () => {
        try {
            let responseData = await sendGoogleSheetsApiRequest();
            return responseData?.sheets[0].data[0].rowData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    })

const solarInstallsDataSlice = createSlice({
    name: 'solarInstalls',
    initialState: {
        "solarInstallsDataLoading": true,
        "solarInstallsData": {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSolarInstallsDataFromApi.fulfilled, (state, action) => {
            const values = _.map(action.payload, (row) =>
                _.map(row["values"], (value) => {
                        const returnValue = value["formattedValue"];
                        return returnValue ? returnValue : "";
                    }
                )
            );
            const columns = values[0];
            const data = values.slice(1);
            let newData = {};
            _.forEach(columns, (column, index) => {
                newData[column] = _.map(data, (row) => row[index]);
            });
            newData["System Size Wattage"] = _.map(newData["System Size Wattage"], (value) => value === "" ? 0 : parseFloat(value));
            return {
                "solarInstallsDataLoading": false,
                "solarInstallsData": newData["System Size Wattage"]
            };
        });
    }
});

export default solarInstallsDataSlice.reducer;