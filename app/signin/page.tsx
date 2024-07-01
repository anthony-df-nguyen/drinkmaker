import providers from "./providers";
import SignInButton from "@/components/Layout/SignInButton";
export default function SignInPage() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign In / Register
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm grid gap-2">
          {providers.map((provider) => (
            <SignInButton key={provider} provider={provider} nextUrl="/" />
          ))}
        </div>
      </div>
    </>
  );
}
