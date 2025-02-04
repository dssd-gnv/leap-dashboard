import { useEffect, useState } from "react";
import * as d3 from "d3";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Map from "./components/Map";
import Gauge from "./components/Gauge";
import About from "./components/About";

function App() {
  const [topography, setTopography] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countyCounts, setCountyCounts] = useState({});

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
              <a target="_blank" rel="noreferrer" href="https://www.leap-va.org/" className="button">About LEAP</a>
              <Link to="/About" className="button">About this Dashboard</Link>
            </div>
          </header>
          <main className="main">
            <Routes>
              <Route path="/About" element={<About />} />
              <Route path="/" element={
                <div className="grid">
                  <div className="card stat-card">
                    <h2 className="stat-heading">kWh Saved</h2>
                    <span className="stat">600K</span>
                  </div>
                  <div className="card stat-card">
                    <h2 className="stat-heading">Annual Fuel Dollars Saved</h2>
                    <span className="stat">$44K</span>
                  </div>
                  <div className="card stat-card">
                    <h2 className="stat-heading">Annual Electric Dollars Saved</h2>
                    <span className="stat">$62K</span>
                  </div>
                  <div className="card stat-card">
                    <h2 className="stat-heading">CO2 Tons Diverted</h2>
                    <span className="stat">2,000</span>
                  </div>
                  <div className="map-container">
                    <h2 className="stat-heading">Where We Serve in Virginia</h2>
                    <Map
                      height={500}
                      data={{ topography, countyCounts }}
                    />
                  </div>
                  <div className="gauge-container">
                    <h2 className="stat-heading">HVAC Efficiency</h2>
                    <Gauge value={94.7} label={"Improvement in"} units={"HVAC Duct Efficiency"} />
                  </div>
                  <div className="card-2 stat-card">
                    <h2 className="stat-heading">Annual Fuel Therms Saved</h2>
                    <span className="stat">26K</span>
                  </div>
                  <div className="card-2 stat-card">
                    <h2 className="stat-heading">Total Savings</h2>
                    <span className="stat">$127K</span>
                  </div>
                </div>
              }/>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
