import { useState } from "react";
import * as d3 from "d3";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Legend from "./Legend";
import useChartDimensions from "../hooks/useChartDimensions";

const DashboardMap = ({ height, data }) => {
  const { topography, countyCounts } = data;

  const [ref, dms] = useChartDimensions({});
  const width = dms.width;

  const [tooltipData, setTooltipData] = useState({
    show: false,
    name: "",
    county: "",
    x: 0,
    y: 0,
  });

  const colorScale = d3
    .scaleThreshold()
    .domain([5, 10, 15, 20, 30, 40])
    .range(d3.schemeBlues[7]);

  const handleMouseMove = (event, countyName) => {
    // const countyName = geography.properties.NAMELSAD.trim();
    setTooltipData({
      show: true,
      name: countyName,
      county: countyCounts[countyName] || 0,
      x: event.clientX,
      y: event.clientY,
    });
    event.target.setAttribute("opacity", "0.7");
  };

  const handleMouseLeave = (event) => {
    setTooltipData({ show: false, });
    event.target.setAttribute("opacity", "1");
  };

  return (
    <div ref={ref} style={{ height }} className="container">
      {/* Legend */}
      <div className="legend">
        <Legend color={colorScale} width={height / 1.4} tickFormat={d3.format("~s")} />
      </div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-79.4, 38.1],
          scale: 5500,
        }}
        width={width}
        height={height}
      >
        <Geographies geography={topography}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={countyCounts[geo.properties.NAMELSAD.trim()] ? colorScale(countyCounts[geo.properties.NAMELSAD.trim()]) : "#ccc"}
                stroke="#FFFFFF"
                strokeWidth={0.5}
                onMouseMove={event => handleMouseMove(event, geo.properties.NAMELSAD.trim())}
                onMouseLeave={handleMouseLeave}
                style={{
                  default: {
                    transition: "all 0.3s"
                  }
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipData.show && (
        <div
          className="fixed pointer-events-none bg-white border border-[#8b8ba7] rounded-[5px] p-[5px]"
          style={{
            left: tooltipData.x,
            top: tooltipData.y - 50,
          }}
        >
          {tooltipData.name}
          <br />
          Households Served: {tooltipData.county}
        </div>
      )}
    </div>
  );
};

export default DashboardMap;
