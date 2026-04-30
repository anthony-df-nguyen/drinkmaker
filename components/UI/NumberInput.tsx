// components/MUIInputs/NumberInput.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/Label";
import { cn } from "@/lib/utils";

/**
 * Props for the NumberInput component.
 * Mirrors TextInputProps but for numeric values.
 */
type NumberInputProps = {
  /**
   * The current value of the input.
   */
  value: number;
  /**
   * Callback function that is called when the value of the input changes.
   */
  onChange: (value: number) => void;
  /**
   * Optional label for the input.
   */
  label?: string;
  /**
   * Helper text to display below the input.
   */
  helperText?: string;
  /**
   * Error text to display below the input.
   */
  errorText?: string;
  /**
   * Indicates if the input is in an error state.
   */
  error?: boolean;
  /**
   * The minimum allowed value for the input.
   */
  min?: number;
  /**
   * The maximum allowed value for the input.
   */
  max?: number;
  /**
   * CSS classes for the container.
   */
  className?: string;
  /**
   * CSS classes for the input element.
   */
  inputClassName?: string;
  /**
   * Whether the input is disabled.
   */
  disabled?: boolean;
  /**
   * Placeholder text.
   */
  placeholder?: string;
  /**
   * Whether the input is required.
   */
  required?: boolean;
};

/**
 * A custom number input component using the existing Input system.
 */
const NumberInput = ({
  value,
  onChange,
  label,
  helperText,
  errorText,
  error,
  min,
  max,
  className,
  inputClassName,
  disabled,
  placeholder,
  required,
}: NumberInputProps) => {
  // Local state for the input field to handle typing without immediate validation jumps
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [internalError, setInternalError] = useState<string | null>(null);

  // Sync local state with prop value changes
  useEffect(() => {
    setInputValue(value.toString());
    setInternalError(null);
  }, [value]);

  /**
   * Handles the change event for the input element.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow empty string or single dash for negative numbers
    if (newValue === "" || newValue === "-") {
      setInputValue(newValue);
      setInternalError(null);
      // Optionally clear error state from parent if needed, 
      // but usually we wait for blur or valid input to clear errors.
      return;
    }

    // Parse the input value
    const numericValue = parseFloat(newValue);

    // Check for valid number format
    if (isNaN(numericValue)) {
      // If it's not a valid number (and not empty/dash), show error
      setInternalError("Invalid number");
      setInputValue(newValue); // Keep what user typed so they can fix it
      return;
    }

    // Check range constraints
    if (min !== undefined && numericValue < min) {
      setInternalError(`Value must be at least ${min}`);
      setInputValue(newValue);
      return;
    }
    
    if (max !== undefined && numericValue > max) {
      setInternalError(`Value must be at most ${max}`);
      setInputValue(newValue);
      return;
    }

    // Valid input
    setInternalError(null);
    setInputValue(newValue);
    onChange(numericValue);
  };

  /**
   * Handles blur event to reset invalid empty states
   */
  const handleBlur = () => {
    if (inputValue === "" || inputValue === "-") {
      // Reset to prop value if empty on blur
      setInputValue(value.toString());
      setInternalError(null);
    }
  };

  // Determine final error state and text
  const hasError = error || Boolean(internalError);
  const displayErrorText = error ? errorText : internalError;

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Input
        type="number" // Use text to handle formatting manually
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        aria-invalid={hasError || undefined}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClassName}
        // Pass min/max as data attributes if needed for validation, 
        // though we handle validation in JS above.
        //inputProps={{ min, max }}
      />
      {(hasError ? displayErrorText : helperText) && (
        <p className={cn("text-xs", hasError ? "text-red-500" : "text-muted")}>
          {hasError ? displayErrorText : helperText}
        </p>
      )}
    </div>
  );
};

export default NumberInput;