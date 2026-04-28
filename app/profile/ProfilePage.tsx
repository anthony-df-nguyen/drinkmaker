import { PaperClipIcon } from "@heroicons/react/20/solid";
import DisplayName from "./DisplayName";
import { useAuthenticatedContext } from "@/context/Authenticated";
import React from "react";

export default function ProfilePage() {
  const { user } = useAuthenticatedContext();
  const items: {
    name: string;
    value: string | undefined | React.ReactNode
  }[] = [
    { name: "Display Name", value: <DisplayName /> },
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
  return (
    <div className="overflow-hidden  shadow rounded-lg max-w-[800px] mx-auto">
      <div className="px-4 py-4 sm:px-6 flex items-center gap-2 bg-surface">
        <h3 className="text-base font-semibold leading-7 text-foreground">
          My Profile
        </h3>
      </div>
      <div className="border-t bg-surface border-border">
        <dl className="divide-y bg-surface divide-border">
          {items.map((item) => {
            return (
              <div
                key={item.name}
                className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt className="text-sm font-medium text-foreground">
                  {item.name}
                </dt>
                <dd className="text-sm font-light leading-6 text-muted sm:col-span-2 sm:mt-0">
                  {item.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
