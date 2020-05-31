import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ children, condition, redirect, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        condition ? (
          <Redirect
            to={{
              pathname: redirect,
              state: { from: location }
            }}
          ></Redirect>
        ) : (
          children
        )
      }
    ></Route>
  );
};
