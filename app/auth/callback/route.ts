import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  console.log('origin: ', origin);
  const code = searchParams.get("code");

  // if "next" is in param, use it in the redirect URL
  const next = searchParams.get("next") ?? "/";
  console.log('next: ', next);

  if (code) {
    console.log('Code exists. Setting up supabase server client');
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log('error: ', error);

    if (!error) {
      console.log('Successfully exchanged')
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // TODO: Create this page
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}