import { createSupabaseServerActionClient } from "@/utils/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  // prevent open-redirects; only allow same-origin paths
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const redirectUrl = new URL(safeNext, url.origin);

  if (code) {
    const supabase = await createSupabaseServerActionClient(); // <-- await
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(new URL("/auth/auth-error", url.origin));
}
