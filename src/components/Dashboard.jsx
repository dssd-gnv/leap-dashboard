import Map from "./Map";
import { Fragment } from "react";
import _ from "lodash";

function createStatCard(showHouseHoldAverages, currencyColumns, column, values) {
    let aggregatedValue;
    if (!showHouseHoldAverages) {
        aggregatedValue = _.round(_.sum(values) / 1000) + 'K';
    } else {
        aggregatedValue = _.round(_.mean(values));
    }
    if (_.includes(currencyColumns, column)) {
        aggregatedValue = '$' + aggregatedValue;
    }
    return (
        <Fragment key={column}>
            <div className="card stat-card">
                <h2 className="stat-heading">{column}</h2>
                <span className="stat">{aggregatedValue}</span>
            </div>
        </Fragment>
    );

}

export default function Dashboard({ showHouseholdAverages, dashboardStats, topography, countyCounts }) {
    const numericalColumns = [
        'kWh Saved',
        'CO₂ Tons',
        'Annual Fuel Therms Saved'
    ];
    const currencyColumns = [
        'Annual Fuel Dollars',
        'Annual Electric Dollars',
        'Total Savings'
    ];
    let firstRowColumns = _.concat(numericalColumns, [currencyColumns[0]])
    let secondRowColumns = _.range(1, currencyColumns.length).map((idx) => currencyColumns[idx]);
    return (
        <div className="grid grid-cols-4 gap-4">
            {
                Object.entries(dashboardStats)
                    .filter((entry) => {
                        let column = entry[0];
                        return _.includes(firstRowColumns, column);
                    })
                    .map((entry) => {
                        let column = entry[0];
                        let values = entry[1];
                        return createStatCard(showHouseholdAverages, currencyColumns, column, values);
                    })
            }
            <div className="map-container col-span-3 row-span-3">
                <h2 className="stat-heading">Where We Serve in Virginia</h2>
                <Map
                    height={500}
                    data={{ topography, countyCounts }}
                />
            </div>
            {
                Object.entries(dashboardStats)
                    .filter((entry) => {
                        let column = entry[0];
                        return _.includes(secondRowColumns, column);
                    })
                    .map((entry) => {
                        let column = entry[0];
                        let values = entry[1];
                        return createStatCard(showHouseholdAverages, currencyColumns, column, values);
                    })
            }
        </div >
    );
}