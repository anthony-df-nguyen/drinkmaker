"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(theme === "dark");
  }, [theme]);

  const handleChange = () => {
    setEnabled(!enabled);
    setTheme(enabled ? "light" : "dark");
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:ring-offset-2 data-[checked]:bg-stone-700"
    >
      <span className="sr-only">Use setting</span>
      <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white dark:bg-emerald-600 shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5">
        <span
          aria-hidden="true"
          className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in group-data-[checked]:opacity-0 group-data-[checked]:duration-100 group-data-[checked]:ease-out"
        >
          {/* Off Toggle */}
          <SunIcon className="text-emerald-600"/>
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-[checked]:opacity-100 group-data-[checked]:duration-200 group-data-[checked]:ease-in"
        >
          {/* On Toggle */}
          <MoonIcon className="text-white" />
        </span>
      </span>
    </Switch>
  );
}
