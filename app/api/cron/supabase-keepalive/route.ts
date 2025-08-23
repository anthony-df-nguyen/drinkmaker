// app/api/cron/supabase-keepalive/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { error } = await supabase
    .from("drinks")
    .select("id", { head: true, count: "planned" }) // no rows returned
    .limit(1);

  // Always 200 so Vercel Cron doesn't retry; we just care that a request hit Supabase.
  return NextResponse.json(
    { ok: !error, err: error?.message ?? null, ts: new Date().toISOString() },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
