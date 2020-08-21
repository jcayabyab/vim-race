import React, { useEffect, useCallback } from "react";
import Navbar from "../NavBar/NavBar";
import { fetchUser } from "../../actions/userActions";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import BrowserIncompatibleModal from "./BrowserIncompatibleModal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
`;

const App = (props) => {
  const dispatch = useDispatch();

  const fetchUserOnLoad = useCallback(async () => {
    dispatch(await fetchUser());
  }, [dispatch]);

  useEffect(() => {
    fetchUserOnLoad();
  }, [fetchUserOnLoad]);

  return (
    <div>
      <Navbar></Navbar>
      <Wrapper>{props.children}</Wrapper>
      <BrowserIncompatibleModal></BrowserIncompatibleModal>
    </div>
  );
};

export default App;
