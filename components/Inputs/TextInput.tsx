/**
 * A reusable text input component.
 *
 * @component
 * @example
 * ```tsx
 * <TextInput
 *   id="name"
 *   label="Name"
 *   placeholder="Enter your name"
 *   type="text"
 *   onChange={(value) => console.log(value)}
 *   delay={500}
 *   required
 *   minLength={3}
 *   maxLength={20}
 *   error="Name is required"
 *   value=""
 * />
 * ```
 */
import React, { useState, useEffect, ChangeEvent } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import useDebounce from "@/hooks/useDebounce";

interface Props {
  /**
   * The unique identifier for the input element.
   */
  id: string;
  /**
   * The label text for the input element.
   */
  label: string;
  /**
   * The placeholder text for the input element.
   */
  placeholder?: string;
  /**
   * The type of the input element.
   */
  type: "text" | "email" | "password";
  /**
   * The callback function called when the input value changes.
   * @param value - The new value of the input element.
   */
  onChange: (value: string) => void;
  /**
   * The delay (in milliseconds) before triggering the onChange callback after the input value changes.
   * @default 300
   */
  delay?: number;
  /**
   * Specifies whether the input element is required.
   */
  required?: boolean;
  /**
   * The minimum length of the input value.
   */
  minLength?: number;
  /**
   * The maximum length of the input value.
   */
  maxLength?: number;
  /**
   * The error message to display when there is an error with the input value.
   */
  error?: string;
  /**
   * The value of the input element. Use this prop to handle controlled input.
   */
  value: string;
}

const TextInput: React.FC<Props> = ({
  id,
  label,
  placeholder,
  type,
  onChange,
  delay = 300,
  required,
  minLength,
  maxLength,
  error,
  value,
}) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const debouncedValue = useDebounce<string>(inputValue, delay);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type={type}
          name={id}
          id={id}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          minLength={minLength}
          maxLength={maxLength}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;