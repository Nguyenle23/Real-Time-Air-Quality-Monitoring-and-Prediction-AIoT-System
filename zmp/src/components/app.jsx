import React from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "../pages";
import About from "../pages/about";
import Form from "../pages/form";
import User from "../pages/user";
import Navbar from "./navbar/Navbar";
import Map from "./map/Map";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <Map />
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
        <Navbar />
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
