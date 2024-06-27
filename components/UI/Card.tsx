import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <div className="relative inline-flex items-center rounded-md bg-white px-3 py-4 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">
      {children}
    </div>
  );
}
