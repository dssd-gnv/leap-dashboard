import topography from './topographySlice';
import countryCounts from './countyCountsSlice';
import dashboardStats from './dashboardStatsSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        topography,
        countryCounts,
        dashboardStats
    }
});

export default store;