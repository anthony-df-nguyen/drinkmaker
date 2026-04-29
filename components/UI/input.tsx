"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-md border border-border bg-surface-raised px-3 py-2 text-base font-light text-foreground transition-colors outline-none",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
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

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  label?: string;
  helperText?: string;
  errorText?: string;
  error?: boolean;
  className?: string;
} & Omit<React.ComponentProps<"input">, "onChange" | "value">;

function TextInput({
  value,
  onChange,
  delay,
  label,
  helperText,
  errorText,
  error,
  className,
  required,
  ...props
}: TextInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const debounced = useDebounce<string>(inputValue, delay ?? 0);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (delay !== undefined && debounced !== value) {
      onChange(debounced);
    }
  }, [debounced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInputValue(next);
    if (delay === undefined) {
      onChange(next);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <Label>{label } {required && <span className="text-red-500">*</span>}</Label>}
     
      <Input
        value={inputValue}
        onChange={handleChange}
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

export { Input };
export default TextInput;
