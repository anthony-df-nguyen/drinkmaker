import providers from "./providers";
import SignInButton from "@/components/Layout/SignInButton";
export default function SignInPage() {
  return (
    <>
      <div className=" flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-lg shadow p-8 w-full max-w-sm mx-auto">
          <div className="mb-6 text-center text-3xl font-bold wider text-accent-text tracking-widest">
            DRINKMAKER
          </div>
          <div className="text-center text-lg font-base tracking-tight text-foreground">
            Sign in to continue
          </div>
          <div className="mt-4 grid gap-4 grid-cols-1">
            {providers.map((provider) => (
              <SignInButton key={provider} provider={provider} nextUrl="/" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
