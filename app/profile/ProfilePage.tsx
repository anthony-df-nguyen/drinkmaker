import { PaperClipIcon } from "@heroicons/react/20/solid";
import DisplayName from "./DisplayName";
import { useAuthenticatedContext } from "@/context/Authenticated";
import React, { useEffect, useState } from "react";
import { getDrinkCountByUser } from "../drinks/actions";
import LogoutButton from "@/components/Layout/SignOutButton";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuthenticatedContext();
  const [drinkCount, setDrinkCount] = useState<number | string>("Searching...");

  const items: {
    name: string;
    value: string | undefined | React.ReactNode;
  }[] = [
    { name: "Email", value: user?.email },
    { name: "Authenticated With", value: user?.app_metadata.provider },
    {
      name: "Account Created",
      value: user?.created_at
        ? new Date(user?.created_at).toLocaleDateString()
        : "",
    },
    { name: "User ID", value: user?.id },
  ];
  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const data = await getDrinkCountByUser(user.id);
          setDrinkCount(data);
        } catch (error) {
          console.error("Error");
          setDrinkCount("Error searching");
        }
      } else {
        return null;
      }
    };
    fetchData();
  }, [user]);
  return (
    <div className="overflow-hidden  max-w-[800px] mx-auto">
      {/* Icon Circle */}
      <div className="mt-8">
        {user?.user_metadata.avatar_url ? (
          <img
            src={user?.user_metadata.avatar_url}
            className="h-24 w-24 rounded-full mx-auto"
          />
        ) : (
          <div className="bg-accent h-24 w-24 mx-auto rounded-full  flex items-center text-white font-serif text-bold text-3xl justify-center">
            <div>{user?.username.charAt(0).toUpperCase()}</div>
          </div>
        )}
      </div>
      {/* User Name */}
      <div className="font-serif text-center text-foreground my-4">
        <DisplayName />
      </div>
      {/* Table */}
      <div className="px-4 mt-6">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-3 text-base text-foreground text-muted">
            Account
          </div>
          <dl className="divide-y divide-border">
            {items.map((row, i) => (
              // Each Row
              <div key={i} className={cn("px-4 py-4 bg-surface")}>
                <div className="flex items-center gap-2 justify-between">
                  <div>
                    <div className="text-foreground text-sm text-muted">
                      {row.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-foreground text-muted font-light text-sm">
                      {row.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 mt-6">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-3 text-base text-foreground text-muted">
            Activity
          </div>
          <dl className="divide-y divide-border">
            <div className={cn("px-4 py-4 bg-surface")}>
              <div className="flex items-center gap-2 justify-between">
                <div>
                  <div className="text-foreground text-sm text-muted">
                    Drinks Created
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-foreground text-muted font-light text-sm">
                    {drinkCount}
                  </div>
                </div>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {/* Sign Out */}
      <div className="flex justify-center">
        <LogoutButton />
      </div>
    </div>
  );
}
