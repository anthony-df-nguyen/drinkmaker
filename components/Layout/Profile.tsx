"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import LogoutButton from "./SignOutButton";
import { useAuthenticatedContext } from "@/context/Authenticated";
import {
  Menu,
  MenuButton,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type Props = {};

export default function Profile({}: Props) {
  const { session, user } = useAuthenticatedContext();

  return (
    <>
      {/* Sign In When Not */}
      {!session && <Link className="text-base" href="/signin">Sign In</Link>}
      {/* Profile dropdown when logged in */}
      {session && (
        <Menu as="div" className="relative">
          <MenuButton className="-m-1.5 flex items-center p-1.5">
            <span className="sr-only">Open user menu</span>
            {session && (
              <img
                className="h-8 w-8 rounded-full bg-gray-50"
                src={user?.user_metadata.avatar_url}
                alt=""
              />
            )}
            <span className="hidden lg:flex lg:items-center">
              <span
                className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                aria-hidden="true"
              >
                {session ? `${user?.user_metadata.full_name}` : "Log In"}
              </span>
              <ChevronDownIcon
                className="ml-2 h-5 w-5 text-gray-400"
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
            <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 px-4 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <LogoutButton />
            </MenuItems>
          </Transition>
        </Menu>
      )}
    </>
  );
}
