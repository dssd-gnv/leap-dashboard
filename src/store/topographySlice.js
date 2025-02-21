import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import * as d3 from "d3";
import {setCountyCounts} from "./countyCountsSlice.js";

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
    initialState: null,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchGeoJsonDataLocally.fulfilled, (state, action) => {
            return action.payload;
        });

        builder.addCase(setCountyCounts, (state, action) => {
            const updatedGeoJson = state;
            updatedGeoJson.features.forEach((feature) => {
                const county = feature.properties.NAMELSAD.trim();
                feature.properties.count = action.payload[county] || 0;
            });
            return updatedGeoJson;
        });
    }
});

export default topographySlice.reducer;