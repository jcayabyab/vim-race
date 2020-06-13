import React, { useEffect } from "react";
import Timer from "react-compound-timer";

export default function CustomTimer({
  style,
  shouldStop,
  shouldReset,
  ...props
}) {
  return (
    <Timer
      {...props}
      formatValue={(value) => `${value < 10 ? "0" : ""}${value}`}
    >
      {({ stop, reset, start }) => (
        <TimerHandler
          stop={stop}
          reset={reset}
          start={start}
          shouldStop={shouldStop}
          shouldReset={shouldReset}
        >
          <span style={style}>
            <Timer.Minutes></Timer.Minutes>:<Timer.Seconds></Timer.Seconds>
          </span>
        </TimerHandler>
      )}
    </Timer>
  );
}

const TimerHandler = ({
  stop,
  start,
  reset,
  shouldStop,
  shouldReset,
  children,
}) => {
  useEffect(() => {
    if (stop && shouldStop) stop();
    else start();
  }, [shouldStop, stop, start]);

  useEffect(() => {
    if (reset && shouldReset) {
      reset();
    }
  }, [shouldReset, reset]);

  return <React.Fragment>{children}</React.Fragment>;
};
