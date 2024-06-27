import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <div className="overflow-hidden rounded-md bg-white px-6 py-4 shadow">
      {children}
    </div>
  );
}
