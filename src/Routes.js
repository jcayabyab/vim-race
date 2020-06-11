import React from "react";
import { Switch } from "react-router-dom";
import App from "./App";
import LoggedInRoute from "./components/utils/LoggedInRoute";
// import HomePage from "./components/HomePage/HomePage";
import LandingPage from "./components/LandingPage/LandingPage";
import PlayPage from "./components/PlayPage/PlayPage";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import VimrcPage from "./components/SettingsPage/VimrcPage";
// import RedirectRoute from "./components/utils/RedirectRoute";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";

export const Routes = (props) => {
  return (
    <App>
      <Switch>
        <Route exact path="/">
          <LandingPage></LandingPage>
        </Route>
        {/* <LoggedInRoute exact path="/home">
          <HomePage></HomePage>
        </LoggedInRoute> */}
        <LoggedInRoute exact path="/settings">
          <SettingsPage></SettingsPage>
        </LoggedInRoute>
        <LoggedInRoute exact path="/settings/vimrc">
          <VimrcPage></VimrcPage>
        </LoggedInRoute>
        <LoggedInRoute exact path="/play">
          <PlayPage></PlayPage>
        </LoggedInRoute>
      </Switch>
    </App>
  );
};
