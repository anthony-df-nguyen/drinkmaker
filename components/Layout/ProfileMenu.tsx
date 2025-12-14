"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { useAuthenticatedContext } from "@/context/Authenticated";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";

type Props = {};

export default function Profile({}: Props) {
  const { user } = useAuthenticatedContext();
  console.log('user: ', user);

  return (
    <>
      {/* Sign In When Not */}
      {!user && (
        <Link className="text-base" href="/signin">
          Sign In
        </Link>
      )}
      {/* Profile dropdown when logged in */}
      {user && (
        <Menu as="div" className="relative">
          <MenuButton className="-m-1.5 flex items-center p-1.5">
            <span className="sr-only">Open user menu</span>
            {user && (
              <img
                className="h-8 w-8 rounded-full bg-gray-50 block"
                src={user.user_metadata.avatar_url}
                alt=""
              />
            )}
            <span className="flex items-center">
              <span
                className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                aria-hidden="true"
              >
                {user ? (
                  <div className="text-left">
                    <div className="hidden md:block text-md">{user.username}</div>
                    <div className="hidden md:block text-xs font-light">
                      {user.email}
                    </div>
                  </div>
                ) : (
                  "Log In"
                )}
              </span>
              <ChevronDownIcon
                className="hidden sm:block ml-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </MenuButton>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-stone-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <Link
                    href="/profile"
                    className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-400 data-[focus]:bg-gray-100 dark:data-[focus]:bg-stone-800 data-[focus]:text-gray-900"
                  >
                    <UserCircleIcon
                      aria-hidden="true"
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    />
                    My Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <span className=" cursor-pointer group flex items-center px-4 py-2 text-sm text-gray-700  dark:text-gray-400 data-[focus]:bg-gray-100 dark:data-[focus]:bg-stone-800 data-[focus]:text-gray-900">
                    <PowerIcon
                      aria-hidden="true"
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    />
                    <SignOutButton />
                  </span>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      )}
    </>
  );
}
