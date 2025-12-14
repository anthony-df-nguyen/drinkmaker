"use client";
import { useState } from "react";
import SideNav from "./Sidebar";
import { links } from "./Links";
import Link from "next/link";
import { SnackbarProvider } from "notistack";
import classNames from "@/utils/classNames";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";
import ProfileMenu from "./ProfileMenu";
import { usePathname } from "next/navigation";

interface Props {
  children: any;
}

export default function Navigation({ children }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <div>
          {/* Side Nav */}
          <SideNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

          {/* Top header bar */}
          <div className="">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-stone-900 bg-white dark:bg-stone-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 dark:text-white lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              <Link href="/" className="lg:h-16 shrink-0 items-center  lg:flex text-xl font-bold wider text-emerald-600 tracking-widest">
                DRINKMAKER
              </Link>
              {/* Links */}
              <div className="ml-8 hidden lg:flex gap-8">
                {links.map((row) => (
                  <Link
                    key={row.name}
                    href={row.href}
                    className={classNames(
                      "text-base",
                      pathname === row.href
                        ? "font-semibold text-emerald-600"
                        : "font-light text-slate-600 dark:text-gray-400"
                    )}
                  >
                    {row.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-1 gap-x-4 self-stretch  items-center">
                <div className="relative flex flex-1"></div>

                <div className="flex items-center gap-x-4 ">
                  <div className="mt-[5px] hidden sm:block">
                    <ThemeToggle />
                  </div>
                  <ProfileMenu />
                </div>
              </div>
            </div>

            <main className="py-8">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </SnackbarProvider>
    </>
  );
}
