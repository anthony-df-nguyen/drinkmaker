import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./utils/supabase/server-client";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseReqResClient(request, response);

  const {
    data: {user}
  } = await supabase.auth.getUser();
  console.log("user", user);

  //const user = session?.user;

  // protects the "/account" route and its sub-routes
  if (!user && request.nextUrl.pathname.startsWith("/ingredients")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/ingredients/:path*"],
};
