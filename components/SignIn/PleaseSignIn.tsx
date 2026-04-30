import SignInButton from "./SignInButton";

const PleaseSignIn = () => {
  return (
    <div>
      {" "}
      <div className="font-serif font-bold text-xl">
        Save & Share Your Drinks 🍸
      </div>
      <div className="mt-4 mb-12 flex flex-col gap-4">
        <div className="text-foreground text-sm">
          Sign in to build and save your own recipes. No password
          required. Takes seconds.
        </div>
        <SignInButton provider="google" />
        <SignInButton provider="github" />
      </div>
    </div>
  );
};

export default PleaseSignIn;
