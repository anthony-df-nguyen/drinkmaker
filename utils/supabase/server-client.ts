// utils/supabase/server-client.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Use this INSIDE a Server Action or Route Handler (read/write cookies). */
export async function createSupabaseServerActionClient() {
  const cookieStore = await cookies(); // allowed & mutable here
  return createServerClient(URL, KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}

/** Use this INSIDE a Server Component render (read-only). */
export async function createSupabaseServerComponentClient() {
  const cookieStore = await cookies(); // read-only in RSC
  return createServerClient(URL, KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {}, // no-ops: cannot mutate cookies in Server Components
      remove() {},
    },
  });
}

/** Use this INSIDE middleware, return the mutated `res` from the caller. */
export function createSupabaseMiddlewareClient(
  req: NextRequest,
  res: NextResponse
) {
  return createServerClient(URL, KEY, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}
