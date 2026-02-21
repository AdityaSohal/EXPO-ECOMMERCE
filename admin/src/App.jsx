import React from "react";
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton,} from "@clerk/clerk-react";

const App = () => {
  return (
    <div>
      <header>
        <h1 className="text-red-500 text-3xl">Homepage</h1>

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
