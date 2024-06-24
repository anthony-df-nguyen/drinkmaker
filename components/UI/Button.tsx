import React from "react";
import classNames from "@/utilities/classNames";

type Props = {
  label: string;
  onClick: () => void;
  disabled: boolean;
};

/**
 * Checks if a row with the given value exists in the specified table.
 * @param label - what to name the button
 * @param onClick - Pass in the onClick handler function
 * @param disabled? - boolean
 */

export default function Button({ label, onClick, disabled }: Props) {
  const disabledClass = "opacity-50 cursor-not-allowed";
  return (
    <button
      onClick={onClick}
      type="button"
      className={classNames(
        "bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600 hover:bg-blue-500  rounded px-4 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        disabled ? disabledClass : ""
      )}
    >
      {label}
    </button>
  );
}
