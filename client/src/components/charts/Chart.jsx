import { useState } from "react";
import "./Chart.css";
import LineChart from "./lineChart/LineChart";
// import LineChart from "./linechart/LineChart";
// import GeoChart from "./geochart/GeoChart";

const Chart = () => {
  const [type, setType] = useState("lineChart");
  return (
    <div className="chart-view">
      <LineChart type={type} />
    </div>
  );
};

export default Chart;

// <div className="button-container">
//   <button onClick={() => setType("barChart")}>BAR CHART</button>
//   <button onClick={() => setType("lineChart")}>LINE CHART</button>
//   <button onClick={() => setType("geoChart")}>GEO CHART</button>
//   <button onClick={() => setType("test3")}>TEST</button>
// </div>

// {type === "lineChart" && <LineChart type={type} />}
// {type === "geoChart" && <GeoChart type={type} />}
