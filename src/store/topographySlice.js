import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import * as d3 from "d3";

export const fetchGeoJsonDataLocally = createAsyncThunk(
    'fetchGeoJsonDataLocally', async () => {
    try {
        return d3.json('/data/va_county.geojson');
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
});

const topographySlice = createSlice({
    name: 'topography',
    initialState: {
        "topographyLoading": true,
        "topographyData": null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchGeoJsonDataLocally.fulfilled, (state, action) => {
            return {"topographyLoading": false, "topographyData": action.payload};
        });
    }
});

export default topographySlice.reducer;