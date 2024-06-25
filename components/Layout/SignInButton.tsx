"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { Provider } from "@supabase/supabase-js";

interface Props {
  provider: Provider;
  nextUrl?: string;
}

export default function SignInButton({ provider, nextUrl }: Props) {
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async () => {
    const redirectTo = `${process.env.NEXT_PUBLIC_ORIGIN}/auth/callback?next=${
      nextUrl || ""
    }`;
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirectTo,
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    >
      {`Sign In with ${provider.toUpperCase()}`}
    </button>
  );
}
