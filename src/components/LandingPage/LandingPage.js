import React from "react";
import DemoClient from "./DemoClient/DemoClient";

export default function LandingPage() {
  return (
    <div>
      <DemoClient>
        <p>Race against others to see who can edit text the fastest!</p>
        <p>
          To submit your solution, use the command <code>:E</code>.
        </p>
      </DemoClient>
    </div>
  );
}
