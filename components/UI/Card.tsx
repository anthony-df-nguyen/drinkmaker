/**
 * A reusable card component.
 *
 * @component
 * @example
 * ```tsx
 * import Card from "@/components/UI/Card";
 *
 * function App() {
 *   return (
 *     <Card className="my-card">
 *       <h1>Card Title</h1>
 *       <p>This is the content of the card.</p>
 *     </Card>
 *   );
 * }
 * ```
 */
import React from "react";
import classNames from "@/utils/classNames";

type Props = {
  /**
   * The content of the card.
   */
  children: React.ReactNode;
  /**
   * Additional class name(s) for the card.
   */
  className?: string;
  onClick?: () => void;
};

export default function Card({ children, className = "", onClick }: Props) {
  return (
    <div onClick={onClick} className={classNames("relative inline-flex items-center rounded-md bg-white px-3 py-4 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0", className)}>
      {children}
    </div>
  );
}
