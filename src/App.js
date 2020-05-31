import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/NavBar/NavBar";
import { fetchUser } from "./actions/userActions";
import { useDispatch } from "react-redux";

const App = (props) => {
  const [username, setUsername] = useState(null);
  const dispatch = useDispatch();

  const fetchUserOnLoad = useCallback(async () => {
    dispatch(await fetchUser());
  }, [dispatch]);

  // TODO: check if user is already logged in using a cookie or ls or something
  useEffect(() => {
    fetchUserOnLoad();
  }, [fetchUserOnLoad]);

  return (
    <div className="App">
      <Navbar></Navbar>
      {props.children}
    </div>
  );
};

export default App;
