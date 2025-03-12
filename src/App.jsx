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
import { fetchSolarInstallsDataFromApi } from "./store/solarInstallsDataSlice.js";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

function App() {
    const { topographyLoading, topographyData } = useSelector(state => state.topography);
    const { countyCountsLoading, countyCountsData } = useSelector(state => state.countyCounts);
    const { dashboardStatsLoading, dashboardStatsData} = useSelector(state => state.dashboardStats);
    const { solarInstallsDataLoading, solarInstallsData } = useSelector(state => state.solarInstallsData);
    const [menuOpen, setMenuOpen] = useState(false);
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
        dispatch(fetchSolarInstallsDataFromApi());
        updateTopographyDataWithCountyCounts(topographyData, countyCountsData);
    }, [dispatch]);

    if (topographyLoading || dashboardStatsLoading || countyCountsLoading || solarInstallsDataLoading) {
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
                <nav className='fixed inset-x-0 top-0 z-10 border-b border-black/5 dark:border-white/10'>
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
                            <div className='hidden md:flex justify-end items-center gap-[1vw]'>
                                {
                                    displayToggle(window)
                                }
                                <Link to="https://www.leap-va.org/"
                                      className="py-2 px-2 bg-[#386fa4] font-bold text-white text-nowrap rounded-md hover:bg-opacity-90 transition-all duration-200 ease-out">About
                                    LEAP</Link>
                                <Link to="/About"
                                      className="py-2 px-2 bg-[#386fa4] font-bold text-white text-nowrap rounded-md hover:bg-opacity-90 transition-all duration-200 ease-out">About
                                    this Dashboard</Link>
                            </div>
                            <div className='md:hidden'>
                                <Bars3Icon className='h-6 w-6 cursor-pointer' onClick={() => setMenuOpen(!menuOpen)}/>
                                {
                                    menuOpen && (
                                        <div className='fixed inset-0 top-16 z-5'>
                                            <Drawer
                                                open={menuOpen}
                                                direction='right'
                                            >
                                                <XMarkIcon className='fixed top-0 right-0 h-6 w-6 cursor-pointer' onClick={() => setMenuOpen(false)}/>
                                                <Link to="https://www.leap-va.org/" className="block px-4 py-3 rounded-lg font-bold text-black dark:text-white">
                                                    About LEAP
                                                </Link>
                                                <br />
                                                <Link to="/About" className="block px-4 py-3 rounded-lg font-bold text-black dark:text-white">
                                                    About this Dashboard
                                                </Link>
                                            </Drawer>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </nav>
                <Fragment>
                    <Routes>
                        <Route path="/About" element={<About/>}/>
                        <Route path="/" element={<Dashboard showHouseholdAverages={showHouseholdAverages}
                                                            dashboardStats={dashboardStatsData}
                                                            topography={topographyData}
                                                            solarInstallsData={solarInstallsData}
                                                            countyCounts={countyCountsData}/>}/>
                    </Routes>
                </Fragment>
            </div>
        </Router>
    );
}

export default App;
