import { Fragment } from "react";
import _ from "lodash";
import DashboardMap from "./DashboardMap.jsx";

function createMap(dashboardStats, dashboardStatsColumnMapping) {
    if (dashboardStats) {
        const dashboardStatsMap = new Map();
        _.chain(_.map(dashboardStatsColumnMapping, (entry) => entry.column)).forEach((column) => {
            dashboardStatsMap.set(column, dashboardStats[column]);
        }).value();
        return dashboardStatsMap;
    }
    return new Map();
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
    if (column === 'Solar Installs Savings') {
        aggregatedValue = aggregatedValue + ' kW';
    }
    const dashboardDisplay = _.chain(columnMapping).filter(entry => entry.column === column).map((entry) => entry.dashboardDisplay).value();
    return (
        <Fragment key={column}>
            <div className="h-33 bg-[#fff] text-center items-center rounded-xl p-[1rem] shadow-lg
        transform transition duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
                <h2 className="text-xl mb-2">{dashboardDisplay}</h2>
                <span className="text-[#4292c6] text-5xl font-semibold mb-4 flex-grow">{aggregatedValue}</span>
            </div>
        </Fragment>
    );

}

export default function Dashboard({ showHouseholdAverages, dashboardStats, topography, countyCounts, solarInstallsData }) {
    const dashboardStatsColumnMapping = [
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
        }
    ];

    const solarInstallsDataColumnMapping = [
        {
            'column': 'Solar Installs Savings',
            'dashboardDisplay': 'Solar Installs Savings',
            'type': 'numerical',
        }
    ]

    const dashboardStatsMap = createMap(dashboardStats, dashboardStatsColumnMapping);
    const firstRowColumns = _.chain(dashboardStatsColumnMapping).map((entry) => entry.column).take(4).value();
    const secondRowColumns = _.chain(dashboardStatsColumnMapping).map((entry) => entry.column).splice(4).value();
    return (
        <div className="grid pt-16 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {
                Array.from(dashboardStatsMap.entries())
                    .filter((entry) => {
                        let column = entry[0];
                        return _.includes(firstRowColumns, column);
                    })
                    .map((entry) => {
                        let column = entry[0];
                        let values = entry[1];
                        return createStatCard(showHouseholdAverages, dashboardStatsColumnMapping, column, values);
                    })
            }
            <div className="map-container lg:col-span-1 xl:col-span-3 row-span-3">
                <h2 className="stat-heading">Where We Serve in Virginia</h2>
                {
                    countyCounts && <DashboardMap
                        height={500}
                        data={{ topography, countyCounts }}
                    />
                }
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
                        return createStatCard(showHouseholdAverages, dashboardStatsColumnMapping, column, values);
                    })
            }
            {
                createStatCard(showHouseholdAverages, solarInstallsDataColumnMapping, 'Solar Installs Savings', solarInstallsData)
            }
        </div >
    );
}