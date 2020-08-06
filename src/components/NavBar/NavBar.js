import React, { useState, useEffect } from "react";
import styled from "styled-components";
import logo from "../../assets/vimrace-logo.png";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { VimButtonWrapper } from "../utils/VimButton";
import Warning from "./Warning";

const NavbarWrapper = styled.div`
  display: flex;
  background-color: #212121;
  align-items: center;
  margin-bottom: 15px;
`;

const LogoImage = styled.img`
  @supports (image-rendering: pixelated) {
    image-rendering: pixelated;
  }
  @supports not (image-rendering: pixelated) {
    image-rendering: crisp-edges;
  }
  height: ${({ isPlayPage }) => 31 * (isPlayPage ? 2 : 2)}px;
  width: ${({ isPlayPage }) => 85 * (isPlayPage ? 2 : 2)}px;
  cursor: pointer;
  padding: 10px;
`;

const NavbarHeaderChild = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;

  &:first-child {
    margin-right: auto;
    justify-content: flex-start;
  }

  &:last-child {
    margin-left: auto;
    justify-content: flex-end;
  }
`;

export default function NavBar() {
  const user = useSelector((state) => state.user);
  const [showUsernameWarning, setShowUsernameWarning] = useState(false);
  const location = useLocation();

  const isPlayPage = location.pathname.slice(0, "/play".length) === "/play";

  useEffect(() => {
    if (user && !user.username) {
      setShowUsernameWarning(true);
    }
    if (isPlayPage) {
      setShowUsernameWarning(true);
    }
  }, [user, setShowUsernameWarning, isPlayPage]);

  const renderNavbarButtons = () => {
    switch (user) {
      case false:
        return <div>...</div>;
      case null:
        return (
          <React.Fragment>
            <VimButtonWrapper>
              <Link to="/about">:about</Link>
            </VimButtonWrapper>
            <VimButtonWrapper>
              <a href="/auth/google">:login</a>
            </VimButtonWrapper>
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <VimButtonWrapper>
              <Link to="/play">:play</Link>
            </VimButtonWrapper>
            <VimButtonWrapper>
              <Link to="/about">:about</Link>
            </VimButtonWrapper>
            <VimButtonWrapper>
              <Link to="/settings">:settings</Link>
            </VimButtonWrapper>
            <VimButtonWrapper>
              <a href="/api/logout">:logout</a>
            </VimButtonWrapper>
          </React.Fragment>
        );
    }
  };

  return (
    <React.Fragment>
      <Warning
        showWarning={showUsernameWarning}
        onCloseClick={() => setShowUsernameWarning(false)}
      >
        New accounts must set a username. The Play page will be inaccessible
        until a username is set.
      </Warning>
      <NavbarWrapper>
        <NavbarHeaderChild></NavbarHeaderChild>
        <NavbarHeaderChild>
          <LogoImage isPlayPage={isPlayPage} src={logo}></LogoImage>
        </NavbarHeaderChild>
        <NavbarHeaderChild>{renderNavbarButtons()}</NavbarHeaderChild>
      </NavbarWrapper>
    </React.Fragment>
  );
}
