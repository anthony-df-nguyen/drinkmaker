import Navigation from "@/components/Layout/Navigation";
import { createClient } from "@/utilities/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select();

  return (
    <main className="">
      <Navigation>{JSON.stringify(notes, null, 2)}</Navigation>
    </main>
  );
}
