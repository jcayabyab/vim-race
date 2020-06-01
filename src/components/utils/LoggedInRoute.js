import React from "react";
import RedirectRoute from "./RedirectRoute";
import { useSelector } from "react-redux";

// used when the user must be logged in to access this Route
export default function LoggedInRoute({ children, ...rest }) {
  const user = useSelector((state) => state.user);
  console.log(user);
  return (
    <RedirectRoute condition={user === null} redirect="/" {...rest}>
      {children}
    </RedirectRoute>
  );
}
