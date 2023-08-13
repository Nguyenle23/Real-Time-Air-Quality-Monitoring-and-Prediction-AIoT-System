import "./Chart.css";
import TempChart from "./tempchart/TempChart";

const Chart = () => {
  return (
    <div className="general-container">
      <div className="full-chart">
        <TempChart />
      </div>
    </div>
  );
};

export default Chart;
