import Chart from "./components/charts/Chart";


import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Map from "./components/map/Map";
import HeaderHCM from "./components/header/HeaderHCM";
import HeaderTD from "./components/header/HeaderTD";

function App() {
  return (
    <>
      <Navbar />
      <div className="container-map">
        <Map />
      </div>
      <HeaderHCM />
      <HeaderTD />
      <div className="container">
        <Chart />
      </div>
    </>
  );
}

export default App;
