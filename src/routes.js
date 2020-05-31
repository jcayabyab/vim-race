import React from "react";
import { Route, Switch } from "react-router-dom";
import App from "./App";
import Home from "./components/Home/Home";

export const Routes = (props) => {
  return (
    <App>
      <Switch>
        <Route exact path="/" component={Home}></Route>
      </Switch>
    </App>
  );
};
