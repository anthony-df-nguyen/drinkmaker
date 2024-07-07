"use client";
import { useState } from "react";
import { links } from "./Links";
import Link from "next/link";
import { SnackbarProvider } from "notistack";
import classNames from "@/utils/classNames";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";
import ProfileMenu from "./ProfileMenu";
import { usePathname } from "next/navigation";

interface Props {
  children: any;
}

export default function Navigation({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
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
          <Transition show={sidebarOpen}>
            <Dialog
              className="relative z-50 lg:hidden"
              onClose={setSidebarOpen}
            >
              <TransitionChild
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-stone-900/90" />
              </TransitionChild>

              <div className="fixed inset-0 flex">
                <TransitionChild
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <TransitionChild
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button
                          type="button"
                          className="-m-2.5 p-2.5"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </TransitionChild>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-emerald-600 dark:bg-black px-6 pb-4">
                      <div className="flex h-16 shrink-0 items-center">
                        <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/mark.svg?color=white"
                          alt="Your Company"
                        />
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul
                          role="list"
                          className="flex flex-1 flex-col gap-y-7"
                        >
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {links.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className={classNames(
                                      "text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    )}
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        </ul>
                        <div className="flex items-center gap-2 justify-center mb-4"> <div className="text-white dark:text-gray-400 font-semibold">Theme: </div><ThemeToggle /></div>
                      </nav>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </Dialog>
          </Transition>

          {/* Top header bar */}
          <div className="">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-stone-900 bg-white dark:bg-black px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 dark:text-white lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-900/10 lg:hidden"
                aria-hidden="true"
              />
              <div className="h-16 shrink-0 items-center hidden lg:flex text-xl font-bold wider text-emerald-600 tracking-widest">
                DRINKMAKER
              </div>
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
                  <div className="mt-[5px] hidden sm:block"><ThemeToggle /></div>
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
