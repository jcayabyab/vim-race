import React from "react";
import styled from "styled-components";
import logo from "../../assets/vimrace-logo.png";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const NavbarWrapper = styled.div`
  display: flex;
  background-color: #212121;
  align-items: center;
  margin-bottom: 15px;
`;

const LogoImage = styled.img`
  image-rendering: pixelated;
  height: ${({isPlayPage}) => 31 * (isPlayPage ? 2 : 2)}px;
  width: ${({isPlayPage}) => 85 * (isPlayPage ? 2 : 2)}px;
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

export default function NavBar() {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const isPlayPage = location.pathname.slice(0, "/play".length) === "/play";

  const renderNavbarButtons = () => {
    switch (user) {
      case false:
        return <div>...</div>;
      case null:
        return (
          <ButtonWrapper>
            <a href="/auth/google">:login</a>
          </ButtonWrapper>
        );
      default:
        return (
          <React.Fragment>
            <ButtonWrapper>
              <Link to="/play">:play</Link>
            </ButtonWrapper>
            <ButtonWrapper>
              <Link to="/settings">:settings</Link>
            </ButtonWrapper>
            <ButtonWrapper>
              <a href="/api/logout">:logout</a>
            </ButtonWrapper>
          </React.Fragment>
        );
    }
  };

  return (
    <NavbarWrapper>
      <NavbarHeaderChild></NavbarHeaderChild>
      <NavbarHeaderChild>
        <LogoImage isPlayPage={isPlayPage} src={logo}></LogoImage>
      </NavbarHeaderChild>
      <NavbarHeaderChild>{renderNavbarButtons()}</NavbarHeaderChild>
    </NavbarWrapper>
  );
}
