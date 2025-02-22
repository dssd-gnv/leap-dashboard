import { Fragment } from "react";
import _ from "lodash";
import DashboardMap from "./DashboardMap.jsx";

function createMap(dashboardStats, columnMapping) {
    const dashboardStatsMap = new Map();
    _.chain(_.map(columnMapping, (entry) => entry.column)).forEach((column) => {
        dashboardStatsMap.set(column, dashboardStats[column]);
    }).value();
    return dashboardStatsMap;
}

function createStatCard(showHouseHoldAverages, columnMapping, column, values) {
    let aggregatedValue;
    if (!showHouseHoldAverages) {
        aggregatedValue = _.round(_.sum(values) / 1000) + 'K';
    } else {
        aggregatedValue = _.round(_.mean(values));
    }
    const isCurrencyType = _.chain(columnMapping).filter(entry => entry.type === 'currency').map((entry) => entry.column).includes(column).value();
    if (isCurrencyType) {
        aggregatedValue = '$' + aggregatedValue;
    }
    const dashboardDisplay = _.chain(columnMapping).filter(entry => entry.column === column).map((entry) => entry.dashboardDisplay).value();
    return (
        <Fragment key={column}>
            <div className="card stat-card">
                <h2 className="stat-heading">{dashboardDisplay}</h2>
                <span className="stat">{aggregatedValue}</span>
            </div>
        </Fragment>
    );

}

export default function Dashboard({ showHouseholdAverages, dashboardStats, topography, countyCounts }) {
    const columnMapping = [
        {
            'column': 'kWh Saved',
            'dashboardDisplay': 'kWh Saved',
            'type': 'numerical',
        },
        {
            'column': 'Annual Fuel Therms Saved',
            'dashboardDisplay': 'Annual Fuel Therms Saved',
            'type': 'numerical',
        },
        {
            'column': 'Annual Fuel Dollars',
            'dashboardDisplay': 'Total Annual Energy Savings',
            'type': 'currency',
        },
        {
            'column': 'Annual Electric Dollars',
            'dashboardDisplay': 'Annual Electric Dollars',
            'type': 'currency',
        },
        {
            'column': 'CO₂ Tons',
            'dashboardDisplay': 'CO₂ Tons',
            'type': 'numerical',
        },
        {
            'column': 'Total Savings',
            'dashboardDisplay': 'Cumulative Savings',
            'type': 'currency',
        },
    ];

    const dashboardStatsMap = createMap(dashboardStats, columnMapping);
    const firstRowColumns = _.chain(columnMapping).map((entry) => entry.column).take(4).value();
    const secondRowColumns = _.chain(columnMapping).map((entry) => entry.column).splice(4).value();
    return (
        <div className="grid grid-cols-4 gap-4">
            {
                Array.from(dashboardStatsMap.entries())
                    .filter((entry) => {
                        let column = entry[0];
                        return _.includes(firstRowColumns, column);
                    })
                    .map((entry) => {
                        let column = entry[0];
                        let values = entry[1];
                        return createStatCard(showHouseholdAverages, columnMapping, column, values);
                    })
            }
            <div className="map-container col-span-3 row-span-3">
                <h2 className="stat-heading">Where We Serve in Virginia</h2>
                <DashboardMap
                    height={500}
                    data={{ topography, countyCounts }}
                />
            </div>
            {
                Array.from(dashboardStatsMap.entries())
                    .filter((entry) => {
                        let column = entry[0];
                        return _.includes(secondRowColumns, column);
                    })
                    .map((entry) => {
                        let column = entry[0];
                        let values = entry[1];
                        return createStatCard(showHouseholdAverages, columnMapping, column, values);
                    })
            }
        </div >
    );
}