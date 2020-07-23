import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import Input from "../utils/Input";
import FormLabel from "../utils/FormLabel";
import VimButton from "../utils/VimButton";
import styled from "styled-components";
import { Link } from "react-router-dom";
import moment from "moment";

const Wrapper = styled.div`
  max-width: 1024px;
  width: 100%;
  padding: 25px;
  background-color: #212121;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  flex: 1;
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

const Message = styled.div`
  height: 1em;
  font-size: 11pt;
`;

export default function SettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [usernameEditable, setUsernameEditable] = useState(false);
  const [message, setMessage] = useState("");

  // handle username editability
  useEffect(() => {
    if (user) {
      const usernameLastChanged = new Date(user.usernameLastChanged);
      const timeDifference =
        new Date().getTime() - usernameLastChanged.getTime();
      // 30 days in ms
      const minTimeDifference = 30 * 24 * 60 * 60 * 1000;
      if (timeDifference < minTimeDifference) {
        setUsernameEditable(false);
      } else {
        setUsernameEditable(true);
      }
    }
  }, [user, setUsernameEditable]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
    }
  }, [user]);

  const flashMessage = (msg, ms) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), ms);
  };

  const getTimeUntilUsernameEdit = () => {
    console.log({ user });
    const timeUsernameEditable = new Date(user.usernameLastChanged);
    timeUsernameEditable.setDate(timeUsernameEditable.getDate() + 30);
    return moment(timeUsernameEditable).fromNow();
  };

  return (
    <Wrapper>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            dispatch(await updateUserProfile(user, username));
            flashMessage("Changes saved successfully.", 3000);
          } catch (e) {
            flashMessage(e, 10000);
          }
        }}
      >
        <FormLabel>Username</FormLabel>
        <Row>
          <InputWrapper>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder={"username"}
              disabled={!usernameEditable}
            ></Input>
          </InputWrapper>
          <VimButton type="submit" disabled={!usernameEditable}>
            :save
          </VimButton>
        </Row>
        {!usernameEditable && user && (
          <Center>
            <Message>
              You can change your username {getTimeUntilUsernameEdit()}.
            </Message>
          </Center>
        )}
        <Center>
          <Message>{message}</Message>
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
