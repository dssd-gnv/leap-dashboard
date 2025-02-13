import Map from "./Map";
import Gauge from "./Gauge";
import { Fragment } from "react";
import _ from "lodash";

function createStatCard(showHouseHoldAverages, currencyColumns, column, values) {
    let aggregatedValue;
    // Total Savings is calculated by summing up all households regardless of toggle state
    if (column == "Total Savings" || !showHouseHoldAverages) {
        aggregatedValue = Math.round(_.sum(_.map(values, parseFloat)) / 1000) + 'K';
    } else {
        aggregatedValue = Math.round(_.mean(_.map(values, parseFloat)));
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

function createGaugeCard(column, values) {
    let aggregatedValue = parseFloat(_.mean(_.map(values, parseFloat)).toFixed(1));
    return (
        <Fragment key={column}>
            <div className="gauge-container">
                <h2 className="stat-heading">{column}</h2>
                <Gauge value={aggregatedValue} />
            </div>
        </Fragment>
    )
}

export default function Dashboard({ showHouseholdAverages, dashboardStats, topography, countyCounts }) {
    const numericalColumns = [
        'kWh Saved',
        'CO2 Tons Diverted',
        'Annual Fuel Therms Saved'
    ];
    const currencyColumns = [
        'Annual Fuel Dollars Saved',
        'Annual Electric Dollars Saved',
        'Total Savings'
    ];
    let firstRowColumns = _.concat(numericalColumns, [currencyColumns[0]])
    const gaugeColumn = 'HVAC Duct Efficiency Improved';
    let thirdRowColumns = _.range(1, currencyColumns.length).map((idx) => currencyColumns[idx]);
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
                        return _.includes(thirdRowColumns, column);
                    })
                    .map((entry) => {
                        let column = entry[0];
                        let values = entry[1];
                        return createStatCard(showHouseholdAverages, currencyColumns, column, values);
                    })
            }
            {
                createGaugeCard(gaugeColumn, dashboardStats[gaugeColumn])
            }
        </div >
    );
}