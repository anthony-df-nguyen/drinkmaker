import React from "react";
import classNames from "@/utils/classNames";

type Props = {
  label: string;
  onClick?: any;
  disabled?: boolean;
  type: "submit" | "button";
  variant: "primary" | "cancel" | "delete";
};

/**
 * Button component that can be customized with different variants.
 *
 * @component
 *
 * @param {string} label - The text to display on the button.
 * @param {function} onClick - The function to be called when the button is clicked.
 * @param {boolean} [disabled] - Whether the button is disabled or not.
 * @param {"submit" | "button"} type - The type of the button.
 * @param {"confirm" | "cancel" | "delete"} variant - The variant of the button.
 *
 * @returns {JSX.Element} The rendered Button component.
 */
export default function Button({ label, onClick, disabled, type, variant }: Props) {
  const disabledClass = "opacity-50 cursor-not-allowed";
  const confirmClass =
    "bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600 hover:bg-emerald-500";
  const cancelClass =
    "bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600 hover:bg-gray-500";
  const deleteClass =
    "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600 hover:bg-red-500";

  return (
    <button
      onClick={onClick}
      type={type}
      className={classNames(
        "rounded px-4 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        disabled ? disabledClass : "",
        variant === "primary" ? confirmClass : "",
        variant === "cancel" ? cancelClass : "",
        variant === "delete" ? deleteClass : ""
      )}
    >
      {label}
    </button>
  );
}
