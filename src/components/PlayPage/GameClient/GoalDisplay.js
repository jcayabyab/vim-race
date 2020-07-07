import React, { useState } from "react";
import styled from "styled-components";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

const GoalBox = styled.div`
  background-color: #212121;
  border: 1px solid black;
  border-radius: 3px;
  font-family: "Lucida Console", "Consolas", monospace;
  white-space: pre-wrap;
  font-size: 9pt;
  height: 300px;
  width: 600px;
  padding: 3px;
`;

const GoalHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const GoalHeaderChild = styled.div`
  display: flex;
  flex: 1;
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

const ShowDiffButton = styled.button`
  border: 4px double white;
  background-color: transparent;
  font-family: "Share Tech Mono", source-code-pro, Menlo, Monaco, Consolas,
    "Courier New", monospace;
  color: white;
  cursor: pointer;
  padding: 5px;
  font-size: 12pt;
  border-radius: 3px;
`;

const RedText = styled.span`
  background-color: rgba(220, 50, 60, 0.6);
`;

const GreenText = styled.span`
  background-color: rgba(50, 205, 50, 0.6);
`;

const GoalDisplay = ({ diff, goalText }) => {
  const createDiffText = () => {
    return (
      <React.Fragment>
        {diff.map((token, index) => {
          if (token.removed) {
            return <RedText key={index}>{token.value}</RedText>;
          }
          if (token.added) {
            return <GreenText key={index}>{token.value}</GreenText>;
          }
          return <span key={index}>{token.value}</span>;
        })}
      </React.Fragment>
    );
  };

  const [showDiff, setShowDiff] = useState(false);
  return (
    <React.Fragment>
      <GoalHeader>
        <GoalHeaderChild></GoalHeaderChild>
        <GoalHeaderChild>
          <h3>Goal</h3>
        </GoalHeaderChild>
        <GoalHeaderChild>
          {!!diff.length && (
            <ShowDiffButton onClick={() => setShowDiff(!showDiff)}>
              {showDiff ? "Hide" : "Show"} diff
            </ShowDiffButton>
          )}
        </GoalHeaderChild>
      </GoalHeader>
      <GoalBox>
        <PerfectScrollbar>
          <span>{showDiff && diff.length ? createDiffText() : goalText}</span>
        </PerfectScrollbar>
      </GoalBox>
    </React.Fragment>
  );
};

export default GoalDisplay;
