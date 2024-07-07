import React from "react";
import classNames from "@/utils/classNames";

type ButtonProps = {
  label: string;
  type: "submit" | "button";
  variant: "primary" | "cancel" | "delete" | "info";
  onClick?: () => void;
  disabled?: boolean;
};

const variantClasses = {
  primary: "bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600",
  cancel: "bg-gray-600 dark:bg-stone-900 hover:bg-gray-500 focus-visible:outline-gray-600",
  delete: "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600",
  info: "bg-gray-400 dark:bg-stone-600 focus-visible:outline-gray-300 hover:bg-gray-400",
};

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, type, variant }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type={type}
      className={classNames(
        "rounded px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        variantClasses[variant]
      )}
    >
      {label}
    </button>
  );
};

export default Button;