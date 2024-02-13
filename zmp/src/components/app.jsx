import React from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "../pages";
import About from "../pages/about";
import Form from "../pages/form";
import User from "../pages/user";
import Navbar from "./navbar/Navbar";
import MapChart from "./map/MapChart";
import InfoHighlight from "./highlight/InfoHighlight";
import Footer from "./footer/Footer";
import Chart from "./chart/Chart";

import "./app.css";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <Navbar />
        <MapChart />
        <InfoHighlight />
        <Chart />
        <Footer />
        {/* <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route path="/about" element={<About></About>}></Route>
              <Route path="/form" element={<Form></Form>}></Route>
              <Route path="/user" element={<User></User>}></Route>
            </AnimationRoutes>
          </ZMPRouter>
        </SnackbarProvider> */}
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
