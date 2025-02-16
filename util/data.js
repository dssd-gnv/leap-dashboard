import * as d3 from "d3";

const fetchDataLocally = async () => {
    const geoJsonData = await d3.json('/data/va_county.geojson');
    const intakeData = await d3.csv('/data/intake.csv');
    const projectSavingsData = await d3.csv('/data/project_savings.csv');
    return {
        "geoJsonData": geoJsonData,
        "intakeData": intakeData,
        "projectSavingsData": projectSavingsData
    };
};

export {
    fetchDataLocally
};