import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useAuthenticatedContext } from "@/context/Authenticated";

export default function ProfilePage() {
  const { user } = useAuthenticatedContext();
  const items = [
    { name: "Display Name", value: user?.username },
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
    <div className="overflow-hidden bg-white shadow rounded-lg max-w-[800px] mx-auto">
      <div className="px-4 py-4 sm:px-6 flex items-center gap-2">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          User Information
        </h3>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {items.map((item) => {
            return (
              <div
                key={item.name}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt className="text-sm font-medium text-gray-900">
                  {item.name}
                </dt>
                <dd className="mt-1 text-sm font-medium leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
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
