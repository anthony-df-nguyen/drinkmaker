"use client";
import { useState } from "react";
import SideNav from "./Sidebar";
import { links } from "./Links";
import Link from "next/link";
import CreateDrinkButton from "../UI/CreateDrinkButton";
import { SnackbarProvider } from "notistack";
import { cn } from "@/lib/utils";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { useModal } from "@/context/ModalContext";
import PleaseSignIn from "@/components/SignIn/PleaseSignIn";

interface Props {
  children: React.ReactNode;
}

export default function Navigation({ children }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthenticatedContext();
  const { showModal } = useModal();

  const isDrinksPage = pathname === "/";

  const visibleLinks = links.filter((item) => {
    if (item.requiresAuth && !user) return false;
    if (item.guestOnly && user) return false;
    return true;
  });

  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <SideNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Top header */}
      <div className="sticky top-0 z-40  bg-surface border-b border-border">
        {/* Container */}
        <div className="max-w-[860px] w-full mx-auto flex items-center h-14 shrink-0   px-4 lg:px-0">
          {" "}
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-lg font-bold font-serif tracking-tight text-foreground"
          >
            Drinkmaker
          </Link>
          {/* Desktop nav links */}
          <nav className="ml-8 hidden lg:flex gap-8">
            {visibleLinks.map((row) => {
              const activeClass = cn(
                "text-sm transition-colors",
                pathname === row.href
                  ? "font-semibold text-foreground"
                  : "font-normal text-muted hover:text-foreground",
              );

              if (row.action === "signIn") {
                return (
                  <button
                    key={row.name}
                    onClick={() => showModal(<PleaseSignIn />)}
                    className={activeClass}
                  >
                    {row.name}
                  </button>
                );
              }

              return (
                <Link
                  key={row.name}
                  href={row.href!}
                  className={activeClass}
                >
                  {row.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex-1" />
          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Add Drink — drinks browse page + authenticated only */}
            {isDrinksPage && <CreateDrinkButton showBreakpoint="lg" />}

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
      </div>

      <main className="lg:py-8">{children}</main>
    </SnackbarProvider>
  );
}
