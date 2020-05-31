import React from "react";
import styled from "styled-components";
import logo from "../../assets/vimrace-logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const NavbarWrapper = styled.div`
  display: flex;
  background-color: #1f1f1f;
  align-items: center;
`;

const LogoImage = styled.img`
  image-rendering: pixelated;
  height: 105px;
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

  const renderNavbarButtons = () => {
    switch (user) {
      case null:
        return <div>...</div>;
      case false:
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
        <LogoImage src={logo}></LogoImage>
      </NavbarHeaderChild>
      <NavbarHeaderChild>{renderNavbarButtons()}</NavbarHeaderChild>
    </NavbarWrapper>
  );
}
