import Chart from "./components/charts/Chart";
import Headers from "./components/header/Header";

import "./App.css";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Chart />
      </div>
      <Headers />
    </>
  );
}

export default App;
