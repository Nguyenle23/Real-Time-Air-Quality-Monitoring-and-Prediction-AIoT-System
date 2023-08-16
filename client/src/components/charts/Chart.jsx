import "./Chart.css";
import COChart from "./cochart/coChart";

const Chart = () => {
  return (
    <div className="general-container">
      <div className="full-chart">
        <COChart />
      </div>
    </div>
  );
};

export default Chart;
