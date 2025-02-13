import { useEffect, useState } from "react";
import * as d3 from "d3";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Toggle from "react-toggle";
import "react-toggle/style.css"
import _ from "lodash";

function App() {
  const [topography, setTopography] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countyCounts, setCountyCounts] = useState({});
  const [dashboardStats, setDashboardStats] = useState({});
  const [showHouseholdAverages, setshowHouseholdAverages] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      let counts = {};

      await Promise.all([
        d3.json('/data/va_county.geojson').then((geoJsonData) => {
          setTopography(geoJsonData);
        }),
        d3.csv('/data/intake.csv').then((csvData) => {
          const counts = csvData.reduce((acc, row) => {
            const county = row['City/ County'].trim();
            acc[county] = (acc[county] || 0) + 1;
            return acc;
          }, {});
          setCountyCounts(counts);
        }),
        d3.csv('/data/project_savings.csv').then((csvData) => {
          let numerical_columns = [
            'kWh Saved',
            'CO2 Tons Diverted',
            'Annual Fuel Therms Saved'
          ]
          let currency_columns = [
            'Annual Fuel Dollars Saved',
            'Annual Electric Dollars Saved',
            'Total Savings'
          ]
          let gauge_column = 'HVAC Duct Efficiency Improved';
          let sum_columns = numerical_columns.concat(currency_columns);
          let newData = {};
          _.forEach(csvData, (row) => {
            let picked = _.pick(row, sum_columns.concat(gauge_column));
            _.forEach(picked, (value, key) => {
              if (_.includes(_.keys(newData), key)) {
                newData[key].push(value);
              } else {
                newData[key] = [value];
              }
            });
          });
          setDashboardStats(newData);
        })
      ]);

      if (topography) {
        const updatedGeoJson = topography;
        updatedGeoJson.features.forEach((feature) => {
          const county = feature.properties.NAMELSAD.trim();
          const count = counts[county] || 0;
          feature.properties.count = count;
        });
        setTopography(updatedGeoJson);
      }
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="wrapper">
          <header className="logo-header">
            <img src="/images/logo_main.png" alt="Logo" className="logo" />
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
                <img src="/images/logo_main.png" alt="Logo" className="logo" />
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
              <a target="_blank" rel="noreferrer" href="https://www.leap-va.org/" className="button">About LEAP</a>
              <Link to="/About" className="button">About this Dashboard</Link>
            </div>
          </header>
          <main className="main">
            <Routes>
              <Route path="/About" element={<About />} />
              <Route path="/" element={<Dashboard showHouseholdAverages={showHouseholdAverages} dashboardStats={dashboardStats} topography={topography} countyCounts={countyCounts} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
