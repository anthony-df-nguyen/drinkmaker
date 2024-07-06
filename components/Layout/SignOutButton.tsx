"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";

export default function LogoutButton() {
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}
