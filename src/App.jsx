import {Fragment, useEffect, useState} from "react";
import ReactLoading from "react-loading";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Toggle from "react-toggle";
import "react-toggle/style.css"
import { useSelector, useDispatch } from 'react-redux';
import { fetchGeoJsonDataLocally } from "./store/topographySlice.js";
import { fetchIntakeDataFromApi } from "./store/countyCountsSlice.js";
import { fetchProjectSavingsDataFromApi } from "./store/dashboardStatsSlice.js";

function App() {
    const { topographyLoading, topographyData } = useSelector(state => state.topography);
    const { countyCountsLoading, countyCountsData } = useSelector(state => state.countyCounts);
    const { dashboardStatsLoading, dashboardStatsData} = useSelector(state => state.dashboardStats);
    const dispatch = useDispatch();
    const [showHouseholdAverages, setShowHouseholdAverages] = useState(false);
    const displayToggle = (window) => {
        if (window.location.pathname === "/") {
            return (
                <Fragment>
                    <span className='pr-4 text-sm text-nowrap md:text-base'>State Totals</span>
                    <Toggle
                            defaultChecked={showHouseholdAverages}
                            icons={false}
                            onChange={() => setShowHouseholdAverages(!showHouseholdAverages)}
                        />
                    <span className='pl-4 pr-4 text-sm text-nowrap md:text-base'>Household Averages</span>
                </Fragment>
            )
        }
        return (
            <Fragment></Fragment>
        )
    }

    const updateTopographyDataWithCountyCounts = (topographyData, countyCountsData) => {
        if (topographyData && countyCountsData) {
            topographyData.features.forEach(feature => {
                const countyName = feature.properties.NAMELSAD.trim();
                const countyCount = countyCountsData[countyName] || 0;
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        countyCount
                    }
                };
            });
        }
        return topographyData;
    }

    useEffect(() => {
        dispatch(fetchGeoJsonDataLocally());
        dispatch(fetchIntakeDataFromApi());
        dispatch(fetchProjectSavingsDataFromApi());
        updateTopographyDataWithCountyCounts(topographyData, countyCountsData);
    }, [dispatch]);

    if (topographyLoading || dashboardStatsLoading || countyCountsLoading) {
        return (
            <Fragment>
                <div className="flex h-screen items-center justify-center">
                    <ReactLoading type="spin" color="#4292c6" height="5%" width="5%" />
                </div>
            </Fragment>
        )
    }

    return (
        <Router>
            <div className='max-w-screen overflow-x-hidden'>
                <div className='fixed inset-x-0 top-0 z-10 border-b border-black/5 dark:border-white/10'>
                    <div className='bg-white'>
                        {/* Main navbar content */}
                        <div className='flex h-14 items-center justify-between gap-8 px-4 sm:px-6'>
                            <Link to="/" className='flex items-center space-x-3 shrink-0'>
                                <img
                                    src="/images/logo_main.png"
                                    alt="Logo"
                                    width={100}
                                />
                            </Link>
                            <div className='flex justify-end items-center gap-[1vw]'>
                                {
                                    displayToggle(window)
                                }
                                <div className='hidden md:flex items-center gap-[1vw]'>
                                    <Link to="https://www.leap-va.org/"
                                          className="py-[10px] px-[20px] bg-[#386fa4] font-bold text-white rounded-md hover:bg-opacity-90 transition-all duration-200 ease-out">About
                                        LEAP</Link>
                                    <Link to="/About"
                                          className="py-[10px] px-[20px] bg-[#386fa4] font-bold text-white rounded-md hover:bg-opacity-90 transition-all duration-200 ease-out">About
                                        this Dashboard</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Fragment>
                    <Routes>
                        <Route path="/About" element={<About/>}/>
                        <Route path="/" element={<Dashboard showHouseholdAverages={showHouseholdAverages}
                                                            dashboardStats={dashboardStatsData}
                                                            topography={topographyData}
                                                            countyCounts={countyCountsData}/>}/>
                    </Routes>
                </Fragment>
            </div>
        </Router>
    );
}

export default App;
