"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-base font-light text-foreground transition-colors outline-none resize-y",
        "placeholder:text-subtle",
        "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
        className
      )}
      {...props}
    />
  );
}

type TextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  errorText?: string;
  error?: boolean;
  className?: string;
} & Omit<React.ComponentProps<"textarea">, "onChange" | "value">;

function TextArea({
  value,
  onChange,
  label,
  helperText,
  errorText,
  error,
  className,
  ...props
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <Label>{label}</Label>}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error || undefined}
        className={className}
        {...props}
      />
      {(error ? errorText : helperText) && (
        <p className={cn("text-xs", error ? "text-red-500" : "text-muted")}>
          {error ? errorText : helperText}
        </p>
      )}
    </div>
  );
}

export { Textarea };
export default TextArea;
