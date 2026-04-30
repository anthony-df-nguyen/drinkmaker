import SignInButton from "./SignInButton";

interface Props {
  title: string;
  text: string;
}
const PleaseSignIn = ({
  title = "Save & Share Your Drinks 🍸",
  text = "  Sign in to build and save your own recipes. No password required. Takes seconds.",
}: Props) => {
  return (
    <div>
      {" "}
      <div className="font-serif font-bold text-xl">{title}</div>
      <div className="mt-4 mb-12 flex flex-col gap-4">
        <div className="text-foreground text-sm">{text}</div>
        <SignInButton provider="google" />
        <SignInButton provider="github" />
      </div>
    </div>
  );
};

export default PleaseSignIn;
