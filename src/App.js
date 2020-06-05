import React, { useEffect, useCallback } from "react";
import Navbar from "./components/NavBar/NavBar";
import { fetchUser } from "./actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Modal from "./components/Modal/Modal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const App = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const fetchUserOnLoad = useCallback(async () => {
    dispatch(await fetchUser());
  }, [dispatch]);

  // TODO: check if user is already logged in using a cookie or ls or something
  useEffect(() => {
    fetchUserOnLoad();
  }, [fetchUserOnLoad]);

  return (
    <div>
      {/* <Modal isOpen={user && !user.username}></Modal> */}
      <Navbar></Navbar>
      <Wrapper>{props.children}</Wrapper>
    </div>
  );
};

export default App;
