import "./App.css";
import Chart from "./components/charts/Chart";
import Headers from "./components/header/Header";
import SideBar from "./components/sidebar/SideBar";

function App() {
  return (
    <>
      <Headers />
      <div className="container">
        <SideBar />
        <Chart />
      </div>
    </>
  );
}

export default App;
