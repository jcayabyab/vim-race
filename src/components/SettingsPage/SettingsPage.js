import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import Input from "../utils/Input";
import FormLabel from "../utils/FormLabel";
import VimButton from "../utils/VimButton";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  max-width: 1024px;
  width: 100%;
  padding: 25px;
  background-color: #212121;
`;

const ButtonWrapper = styled.div`
  font-family: "Share Tech Mono", Consolas, monospace;
  font-size: 24pt;

  & > * {
    padding: 20px;
    cursor: pointer;
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
    display: block;
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

export default function SettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
    }
  }, [user]);

  return (
    <Wrapper>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          dispatch(await updateUserProfile(user, username));
        }}
      >
        <FormLabel>Username</FormLabel>
        <Input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder={"username"}
        ></Input>
        <Center>
          <VimButton type="submit">:save</VimButton>
        </Center>
        <Center>
          <ButtonWrapper>
            <Link to="/settings/vimrc">:edit .vimrc</Link>
          </ButtonWrapper>
        </Center>
      </form>
    </Wrapper>
  );
}
