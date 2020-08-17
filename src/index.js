import React from "react";
import { hydrate, render } from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";
import * as serviceWorker from "./serviceWorker";

const Index = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes></Routes>
    </BrowserRouter>
  </Provider>
);

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<Index></Index>, rootElement);
} else {
  render(<Index></Index>, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
