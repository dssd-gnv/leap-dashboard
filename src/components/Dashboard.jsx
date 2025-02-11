import Map from "./Map";
import Gauge from "./Gauge";
import { Fragment } from "react";

function createStatCard(key, value, divClassName) {
    return (
        <Fragment key={key}>
            <div className={divClassName}>
                <h2 className="stat-heading">{key}</h2>
                <span className="stat">{value}</span>
            </div>
        </Fragment>
    );
}

function createGaugeCard(key, value) {
    return (
        <Fragment key={key}>
            <div className="gauge-container">
                <h2 className="stat-heading">HVAC Efficiency</h2>
                <Gauge value={value} label={"Improvement in"} units={"HVAC Duct Efficiency"} />
            </div>
        </Fragment>
    )
}

export default function Dashboard({ dashboardStats, topography, countyCounts }) {
    let columns1 = ['kWh Saved', 'Annual Fuel Dollars Saved', 'Annual Electric Dollars Saved', 'CO2 Tons Diverted'];
    let columns2 = ['HVAC Duct Efficiency Improved']
    let columns3 = ['Annual Fuel Therms Saved', 'Total Savings']
    return (
        <div className="grid">
            {
                Object.entries(dashboardStats)
                    .filter((entry) => {
                        let key = entry[0];
                        return columns1.includes(key);
                    })
                    .map((entry) => {
                        let key = entry[0];
                        let value = entry[1];
                        return createStatCard(key, value, "card stat-card");
                    })
            }
            <div className="map-container">
                <h2 className="stat-heading">Where We Serve in Virginia</h2>
                <Map
                    height={500}
                    data={{ topography, countyCounts }}
                />
            </div>
            {
                Object.entries(dashboardStats)
                    .filter((entry) => {
                        let key = entry[0];
                        return columns2.includes(key);
                    })
                    .map((entry) => {
                        let key = entry[0];
                        let value = entry[1];
                        return createGaugeCard(key, value);
                    })
            }
            {
                Object.entries(dashboardStats)
                    .filter((entry) => {
                        let key = entry[0];
                        return columns3.includes(key);
                    })
                    .map((entry) => {
                        let key = entry[0];
                        let value = entry[1];
                        return createStatCard(key, value, "card-2 stat-card");
                    })
            }
        </div>
    );
}