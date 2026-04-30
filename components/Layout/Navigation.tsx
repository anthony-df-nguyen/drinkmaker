"use client";
import { useState } from "react";
import SideNav from "./Sidebar";
import { links } from "./Links";
import Link from "next/link";
import { SnackbarProvider } from "notistack";
import { cn } from "@/lib/utils";
import { Bars3Icon, PlusIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useModal } from "@/context/ModalContext";
import { useAuthenticatedContext } from "@/context/Authenticated";
import CreateForm from "@/app/drinks/forms/CreateDrinkForm";
import PleaseSignIn from "@/components/SignIn/PleaseSignIn";

interface Props {
  children: React.ReactNode;
}

export default function Navigation({ children }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showModal } = useModal();
  const { user } = useAuthenticatedContext();

  const isDrinksPage = pathname === "/";

  return (
    <SnackbarProvider anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <SideNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Top header */}
      <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-lg font-bold font-serif tracking-tight text-foreground"
        >
          Drinkmaker
        </Link>

        {/* Desktop nav links */}
        <nav className="ml-8 hidden lg:flex gap-8">
          {links.map((row) => (
            <Link
              key={row.name}
              href={row.href}
              className={cn(
                "text-sm transition-colors",
                pathname === row.href
                  ? "font-semibold text-foreground"
                  : "font-normal text-muted hover:text-foreground"
              )}
            >
              {row.name}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Add Drink — drinks browse page + authenticated only */}
          {isDrinksPage && (
            <button
              type="button"
              onClick={() => showModal(user ? <CreateForm /> : <PleaseSignIn />)}
              className="flex items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-foreground transition-colors"
            >
              <PlusIcon className="h-6 w-6" />
              <span className="hidden sm:inline">Add Drink</span>
            </button>
          )}

          {/* <ThemeToggle /> */}
          {/* <ProfileMenu /> */}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="text-foreground lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <main className="lg:py-8">{children}</main>
    </SnackbarProvider>
  );
}
