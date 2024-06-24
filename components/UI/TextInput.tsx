"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import useDebounce from "@/hooks/useDebounce";

interface Props {
  id: string;
  label: string;
  placeholder?: string;
  type: "text" | "email" | "password";
  // OnChange function is handled by the parent component
  onChange: (value: string) => void;
  //  If a delay is provided, this will debounce user input before running the onChange handlers
  delay: number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  error?: string;
}

export default function TextInput({
  id,
  label,
  placeholder,
  type,
  onChange,
  delay,
  minLength,
  maxLength,
  error
}: Props) {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, delay);

  useEffect(() => {
    // Debounce if there is user input but if its empty just return empty string
    debouncedValue.length > 0 ? onChange(debouncedValue) : onChange("");
  }, [debouncedValue, onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

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
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          minLength={minLength}
          maxLength={maxLength}
          aria-invalid="true"
          aria-describedby={`${id}-error`}
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
}
