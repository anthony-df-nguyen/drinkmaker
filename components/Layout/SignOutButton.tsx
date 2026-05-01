"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";

export default function LogoutButton() {
  const supabase = createSupabaseBrowserClient();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div className="px-3 py-4 border-t border-border">
      <button
        type="button"
        onClick={handleSignOut}
        className="flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-red-500 hover:bg-surface-raised transition-colors"
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
        Sign Out
      </button>
    </div>
  );
}
