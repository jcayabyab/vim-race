import React from "react";
import DemoClient from "./DemoClient/DemoClient";
import { SolidAButton } from "../utils/SolidButton";

export default function LandingPage() {
  return (
    <div>
      <DemoClient>
        <p>
          To submit your solution, use the command <code>:E</code>.
        </p>
        <p>
          To race against others and customize your own <code>.vimrc</code>,
          sign up for an account for free!
        </p>
        <div>

        <SolidAButton href="/auth/google">Sign up for an account</SolidAButton>
        </div>
      </DemoClient>
    </div>
  );
}
