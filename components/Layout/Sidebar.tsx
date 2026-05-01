"use client";
import {
  Transition,
  Dialog,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { links } from "./Links";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./SignOutButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { useModal } from "@/context/ModalContext";
import PleaseSignIn from "@/components/SignIn/PleaseSignIn";

interface SideBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const { user } = useAuthenticatedContext();
  const { showModal } = useModal();

  const visibleLinks = links.filter((item) => {
    if (item.requiresAuth && !user) return false;
    if (item.guestOnly && user) return false;
    return true;
  });

  return (
    <Transition show={sidebarOpen}>
      <Dialog
        className="relative z-50 lg:hidden"
        onClose={() => setSidebarOpen(false)}
      >
        {/* Backdrop */}
        <TransitionChild
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        {/* Right-side drawer */}
        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="relative flex w-72 flex-col h-full bg-surface shadow-xl">
              {/* Drawer header */}
              <div className="flex items-end justify-between px-5 pt-14 pb-5 border-b border-border">
                <div>
                  <div className="text-xl font-bold font-serif text-foreground tracking-tight">
                    Drinkmaker
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    Craft · Discover · Share
                  </div>
                </div>
                <button
                  type="button"
                  className="p-1 text-muted hover:text-foreground transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-3">
                {visibleLinks.map((item) => {
                  const active = item.href ? pathname === item.href : false;
                  const sharedClassName = cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm mb-0.5 transition-colors",
                    active
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-foreground font-normal hover:bg-surface-raised",
                  );

                  if (item.action === "signIn") {
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          setSidebarOpen(false);
                          showModal(<PleaseSignIn />);
                        }}
                        className={cn(sharedClassName, "w-full text-left")}
                      >
                        {item.icon && <item.icon className="w-6 h-6" />}
                        {item.name}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href!}
                      onClick={() => setSidebarOpen(false)}
                      className={sharedClassName}
                    >
                      {item.icon && <item.icon className="w-6 h-6" />}
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Dark Mode */}
              <div className="flex items-center gap-2 mx-auto my-4">
                <div className="text-foreground text-sm">Color Mode:</div>
                <ThemeToggle />
              </div>

              {/* Footer */}
              {user && <LogoutButton />}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SideBar;
