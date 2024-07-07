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
    <div className="overflow-hidden  shadow rounded-lg max-w-[800px] mx-auto">
      <div className="px-4 py-4 sm:px-6 flex items-center gap-2 bg-white  dark:bg-stone-950">
        <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
          My Profile
        </h3>
      </div>
      <div className="border-t bg-white dark:bg-stone-900 border-gray-100 dark:border-black">
        <dl className="divide-y bg-white dark:bg-stone-900 divide-gray-100 dark:divide-black">
          {items.map((item) => {
            return (
              <div
                key={item.name}
                className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </dt>
                <dd className="text-sm font-light leading-6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
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
