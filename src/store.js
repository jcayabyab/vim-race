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

// create the store
const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

export { store, history };
