import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";

interface MenuItemProps {
  href?: string;
  icon: React.ElementType;
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  isLink?: boolean;
}

export const CustomMenuItem: React.FC<MenuItemProps> = ({
  href,
  icon: Icon,
  children,
  onClick,
  disabled = false,
  isLink = true,
}) => (
  <MenuItem disabled={disabled}>
    {({ active }) =>
      isLink ? (
        <a
          href={!disabled ? href : undefined}
          className={`group flex items-center px-4 py-2 text-sm text-gray-700 ${
            active ? "bg-gray-100 dark:bg-stone-800 text-gray-900 dark:text-gray-400" : ""
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <Icon
            aria-hidden="true"
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
          />
          <span className="dark:text-gray-400">{children}</span>
        </a>
      ) : (
        <button
          onClick={!disabled ? onClick : undefined}
          className={`group flex items-center w-full px-4 py-2 text-sm text-gray-700 ${
            active ? "bg-gray-100 dark:bg-stone-900 text-gray-900 dark:text-gray-400" : ""
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <Icon
            aria-hidden="true"
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
          />
           <span className="dark:text-gray-400">{children}</span>
        </button>
      )
    }
  </MenuItem>
);

interface ActionDropProps {
  label: string;
  children: React.ReactNode;
}

const ActionDrop: React.FC<ActionDropProps> = ({ label, children }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-stone-900 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-stone-700 hover:bg-gray-50">
          <div className="flex items-center">
            <div className="hidden sm:block text-gray-900 dark:text-gray-300 mr-2">{label}</div>
            <div className="h-5 w-5 text-gray-900 dark:text-gray-300">
              <EllipsisVerticalIcon />
            </div>
            {/* <ChevronDownIcon
              aria-hidden="true"
              className="-mr-1 h-5 w-5 text-gray-400"
            /> */}
          </div>
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-stone-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {children}
      </MenuItems>
    </Menu>
  );
};

export default ActionDrop;
