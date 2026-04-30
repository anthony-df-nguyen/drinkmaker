"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { Provider } from "@supabase/supabase-js";
import { providerIcons } from "./constants";

interface Props {
  provider: Provider;
  nextUrl?: string;
}

export default function SignInButton({ provider, nextUrl }: Props) {
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async () => {
    const redirectTo = `/auth/callback?next=${nextUrl || ""}`;
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
      // className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      className="flex w-full items-center justify-center gap-3 rounded-md bg-surface border border-border px-3 py-2 text-sm font-semibold text-foreground shadow-xs hover:bg-surface-raised focus-visible:border-transparent"
    >
      {/* {`Sign In with ${provider.toUpperCase()}`} */}
      {providerIcons[provider as keyof typeof providerIcons]}
      <span className="text-sm/6 font-semibold">{`Continue with ${provider.toUpperCase()}`}</span>
    </button>
  );
}
