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
import { cn } from "@/lib/utils";

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
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-lg bg-surface p-4 border focus-visible:outline-offset-0",
        className
      )}
    >
      {children}
    </div>
  );
}
