import React from "react";
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton,} from "@clerk/clerk-react";

const App = () => {
  return (
    <div>
      <header>
        <h1>Homepage</h1>

        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </div>
  );
};

export default App;
