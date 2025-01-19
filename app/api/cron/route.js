// app/api/etc/supabase-activity-scheduler/route.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Fetch data to prevent Supabase project from pausing
    const { data, error } = await supabase.from("drinks").select().limit(1);
    if (error) throw new Error(error.message);
    return Response.json(data);
  } catch (error) {
    const message = error.message ?? "An error occurred.";
    return Response.json({ error: message }, { status: 400 });
  }
}
