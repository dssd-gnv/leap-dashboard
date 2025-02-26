import topography from './topographySlice';
import countyCounts from './countyCountsSlice';
import dashboardStats from './dashboardStatsSlice';
import solarInstallsData from './solarInstallsDataSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        topography,
        countyCounts,
        dashboardStats,
        solarInstallsData
    }
});

export default store;