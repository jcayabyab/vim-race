import React from "react";
import { Route, Switch } from "react-router-dom";
import App from "./App";
import LoggedInRoute from "./components/utils/LoggedInRoute";
import HomePage from "./components/HomePage/HomePage";
import LandingPage from "./components/LandingPage/LandingPage";
import PlayPage from "./components/PlayPage/PlayPage";
import RedirectRoute from "./components/utils/RedirectRoute";
import { useSelector } from "react-redux";

export const Routes = (props) => {
  const user = useSelector((state) => state.user);
  return (
    <App>
      <Switch>
        <RedirectRoute exact condition={user} redirect="/home" path="/">
          <LandingPage></LandingPage>
        </RedirectRoute>
        <LoggedInRoute exact path="/home">
          <HomePage></HomePage>
        </LoggedInRoute>
        <LoggedInRoute exact path="/home">
          <HomePage></HomePage>
        </LoggedInRoute>
        <LoggedInRoute exact path="/play">
          <PlayPage></PlayPage>
        </LoggedInRoute>
      </Switch>
    </App>
  );
};
