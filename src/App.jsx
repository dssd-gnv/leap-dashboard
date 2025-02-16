import {useCallback, useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Toggle from "react-toggle";
import "react-toggle/style.css"
import _ from "lodash";
import {fetchDataLocally, fetchProjectSavingsDataFromApi, fetchIntakeDataFromApi} from "../util/data.js";

function App() {
    const [topography, setTopography] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countyCounts, setCountyCounts] = useState({});
    const [dashboardStats, setDashboardStats] = useState({});
    const [showHouseholdAverages, setshowHouseholdAverages] = useState(false);

    const updateCountyCounts = useCallback((intakeData) => {
        const counts = intakeData.reduce((acc, row) => {
            const county = row['City/ County'].trim();
            acc[county] = (acc[county] || 0) + 1;
            return acc;
        }, {});
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
        fetchDataLocally()
            .then((data) => {
                setTopography(data['geoJsonData']);
            }).catch(console.error);
        setLoading(false);
    }, [setLoading, setTopography, updateCountyCounts, updateDashboardStats]);

    useEffect(() => {
        setLoading(true);
        fetchProjectSavingsDataFromApi().then((response) => {
            const data = response.data.boards[0].items_page.items;
            updateDashboardStats(data);
        }).catch(console.error);
        setLoading(false);
    }, [setLoading]);

    useEffect(() => {
        setLoading(true);
        fetchIntakeDataFromApi().then((response) => {
            const items = response.data.boards[0].items_page.items;
            const counties = _.map(items, (item) => item.column_values[0].text);
            const counts = _.countBy(counties);
            updateCountyCounts(counts);
        }).catch(console.error);
        setLoading(false);
    }, [setLoading]);

    if (loading) {
        return (
            <div className="dashboard">
                <div className="wrapper">
                    <header className="logo-header">
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
                    <header>
                        <div className="logo-header">
                            <Link to="/">
                                <img src="/images/logo_main.png" alt="Logo" className="logo"/>
                            </Link>
                        </div>
                        <div className="button-container">
                            <span style={{padding: "1em 1em 0em 0em"}}>State Totals</span>
                            <div style={{paddingTop: "1em"}}>
                                <Toggle
                                    defaultChecked={showHouseholdAverages}
                                    onChange={() => setshowHouseholdAverages(!showHouseholdAverages)}
                                />
                            </div>
                            <span style={{padding: "0.5em 1em 0em 1em"}}>Household Averages</span>
                            <a target="_blank" rel="noreferrer" href="https://www.leap-va.org/" className="button">About
                                LEAP</a>
                            <Link to="/About" className="button">About this Dashboard</Link>
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
