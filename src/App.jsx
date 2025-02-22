import {Fragment, useEffect, useState} from "react";
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
                    <span style={{padding: "1em 1em 0em 0em"}}>State Totals</span>
                    <div style={{paddingTop: "1em"}}>
                        <Toggle
                            defaultChecked={showHouseholdAverages}
                            icons={false}
                            onChange={() => setShowHouseholdAverages(!showHouseholdAverages)}
                        />
                    </div>
                    <span style={{padding: "0.5em 1em 0em 1em"}}>Household Averages</span>
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
            <div className="dashboard">
                <div className="wrapper">
                    <header className="flex justify-between m-auto p-[1.5vh]">
                        <img src="/images/logo_main.png" alt="Logo" className="logo"/>
                    </header>
                </div>
            </div>
        )
    }

    return (
        <Router>
            <Fragment>
                <div className="relative min-h-screen">
                    <header className="flex justify-between m-auto p-[1.5vh]">
                        <div>
                            <Link to="/">
                                <img src="/images/logo_main.png" alt="Logo"
                                     className="flex w-auto h-[7vh] align-middle"/>
                            </Link>
                        </div>
                        <div className="flex justify-end items-center gap-[1vw]">
                            {
                                displayToggle(window)
                            }
                            <button
                                className="flex items-center py-[10px] px-[20px] text-[1.1rem] font-medium text-white bg-[#386fa4] rounded-[0.75rem] no-underline transition-colors duration-300 hover:bg-blue-900">
                                <Link to="https://www.leap-va.org/">About LEAP</Link>
                            </button>
                            <button
                                className="flex items-center py-[10px] px-[20px] text-[1.1rem] font-medium text-white bg-[#386fa4] rounded-[0.75rem] no-underline transition-colors duration-300 hover:bg-blue-900">
                                <Link to="/About" className="button">About this Dashboard</Link>
                            </button>
                        </div>
                    </header>
                    <main className="main">
                        <Routes>
                            <Route path="/About" element={<About/>}/>
                            <Route path="/" element={<Dashboard showHouseholdAverages={showHouseholdAverages}
                                                                dashboardStats={dashboardStatsData} topography={topographyData}
                                                                countyCounts={countyCountsData}/>}/>
                        </Routes>
                    </main>
                </div>
            </Fragment>
        </Router>
    );
}

export default App;
