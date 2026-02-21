import { SignInButton, SignUpButton } from "@clerk/clerk-react";

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to <span className="text-primary">Expo-Ecommerce</span>
        </h1>
        <p className="text-base-content/70 mb-10 text-lg">
          Please sign in to continue managing your store, track orders,
          monitor performance, and grow your business.
        </p>
        <div className="flex justify-center gap-4">
          <SignInButton mode="modal">
            <button className="btn btn-primary btn-lg">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn btn-outline btn-primary btn-lg">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;