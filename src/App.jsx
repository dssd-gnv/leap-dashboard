import {Fragment, useCallback, useEffect, useState} from "react";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Toggle from "react-toggle";
import "react-toggle/style.css"
import _ from "lodash";
import {fetchGeoJsonDataLocally, fetchIntakeDataFromApi, fetchProjectSavingsDataFromApi} from "../util/data.js";

function App() {
    const [topography, setTopography] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countyCounts, setCountyCounts] = useState({});
    const [dashboardStats, setDashboardStats] = useState({});
    const [showHouseholdAverages, setshowHouseholdAverages] = useState(false);

    const displayToggle = (window) => {
        if (window.location.pathname === "/") {
            return (
                <Fragment>
                    <span style={{padding: "1em 1em 0em 0em"}}>State Totals</span>
                    <div style={{paddingTop: "1em"}}>
                        <Toggle
                            defaultChecked={showHouseholdAverages}
                            onChange={() => setshowHouseholdAverages(!showHouseholdAverages)}
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

    const updateCountyCounts = useCallback((intakeData) => {
        const counties = _.map(intakeData, (item) => item.column_values[0].text);
        const counts = _.countBy(counties);
        setCountyCounts(counts);
        if (topography) {
            const updatedGeoJson = topography;
            updatedGeoJson.features.forEach((feature) => {
                const county = feature.properties.NAMELSAD.trim();
                feature.properties.count = countyCounts[county] || 0;
            });
            setTopography(updatedGeoJson);
        }
    }, [topography, countyCounts, setCountyCounts, setTopography]);

    const updateDashboardStats = useCallback((projectSavingsData) => {
        let newData = {};
        _.forEach(projectSavingsData, (item) => {
            const column_values = item.column_values;
            _.forEach(column_values, (column_value) => {
                const key = column_value.column.title;
                let value = parseFloat(column_value.text);
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
        setDashboardStats(newData);
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchGeoJsonDataLocally()
            .then(setTopography).catch(console.error);
        setLoading(false);
    }, [setLoading, setTopography, updateCountyCounts, updateDashboardStats]);

    useEffect(() => {
        setLoading(true);
        fetchProjectSavingsDataFromApi().then(updateDashboardStats).catch(console.error);
        setLoading(false);
    }, [setLoading]);

    useEffect(() => {
        setLoading(true);
        fetchIntakeDataFromApi().then(updateCountyCounts).catch(console.error);
        setLoading(false);
    }, [setLoading]);

    if (loading) {
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
            <div className="dashboard">
                <div className="wrapper">
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
                                                                dashboardStats={dashboardStats} topography={topography}
                                                                countyCounts={countyCounts}/>}/>
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;
