import { createStore, applyMiddleware } from "redux";
import { rootReducer } from "./reducers/index";
import { createBrowserHistory } from "history";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import freeze from "redux-freeze";

const history = createBrowserHistory();
const loggerMiddleware = createLogger();

let middlewares = [thunkMiddleware];

// add the freeze dev middleware
if (process.env.NODE_ENV !== "production") {
  middlewares.push(freeze);
  middlewares.push(loggerMiddleware);
}

// SSR rendering
const preloadedState = window.__PRELOADED_STATE__;

delete window.__PRELOADED_STATE__;

// create the store
const store = createStore(rootReducer, applyMiddleware(...middlewares));

window.snapSaveState = () => ({ __PRELOADED_STATE__: store.getState() });

export { store, history };
