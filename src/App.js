import React, { useEffect, useCallback } from "react";
import Navbar from "./components/NavBar/NavBar";
import { fetchUser } from "./actions/userActions";
import { useDispatch } from "react-redux";
import styled from "styled-components";
// import Modal from "./components/Modal/Modal";

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

  useEffect(() => {
    fetchUserOnLoad();
  }, [fetchUserOnLoad]);

  if (window.SharedArrayBuffer) {
    console.log("yes");
  } else {
    console.log("no");
  }

  return (
    <div>
      <Navbar></Navbar>
      <Wrapper>{props.children}</Wrapper>
    </div>
  );
};

export default App;
