import topography from './topographySlice';
import countyCounts from './countyCountsSlice';
import dashboardStats from './dashboardStatsSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        topography,
        countyCounts,
        dashboardStats
    }
});

export default store;