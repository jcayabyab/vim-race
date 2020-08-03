import React from "react";
import { Switch } from "react-router-dom";
import App from "./App";
import LoggedInRoute from "./components/utils/LoggedInRoute";
import LandingPage from "./components/LandingPage/LandingPage";
import PlayPage from "./components/PlayPage/PlayPage";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import VimrcPage from "./components/SettingsPage/VimrcPage";
import { Route } from "react-router-dom";
import AboutPage from "./components/AboutPage/AboutPage";
import ChangelogPage from "./components/AboutPage/ChangelogPage";
import TutorPage from "./components/TutorPage/TutorPage";

export const Routes = (props) => {
  return (
    <App>
      <Switch>
        <Route exact path="/">
          <LandingPage></LandingPage>
        </Route>
        <Route exact path="/about">
          <AboutPage></AboutPage>
        </Route>
        <Route exact path="/about/changelog">
          <ChangelogPage></ChangelogPage>
        </Route>
        <Route exact path="/vimtutor">
          <TutorPage></TutorPage>
        </Route>
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
