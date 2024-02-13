import "./Chart.css";
import TempChart from "./tempchart/TempChart";
// import HumiChart from "./humichart/humiChart";
// import CO2Chart from "./co2chart/co2Chart";
// import COChart from "./cochart/coChart";
// import UVChart from "./uvchart/uvChart";
// import PM25Chart from "./pm25chart/pm25Chart";

const Chart = () => {
  return (
    <div className="full-chart">
      <TempChart />
      {/* <HumiChart />
      <CO2Chart />
      <COChart />
      <UVChart />
      <PM25Chart /> */}
    </div>
  );
};

export default Chart;
