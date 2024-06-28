"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return <div className="cursor-pointer text-base" onClick={handleLogout}>Sign Out</div>;
}
