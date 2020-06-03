import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/NavBar/NavBar";
import { fetchUser } from "./actions/userActions";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const App = (props) => {
  const dispatch = useDispatch();

  const fetchUserOnLoad = useCallback(async () => {
    dispatch(await fetchUser());
  }, [dispatch]);

  // TODO: check if user is already logged in using a cookie or ls or something
  useEffect(() => {
    fetchUserOnLoad();
  }, [fetchUserOnLoad]);

  return (
    <div>
      <Navbar></Navbar>
      <Wrapper>{props.children}</Wrapper>
    </div>
  );
};

export default App;
