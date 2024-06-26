import React, { useState, useEffect, ChangeEvent } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import useDebounce from "@/hooks/useDebounce";

interface Props {
  id: string;
  label: string;
  placeholder?: string;
  onChange: (value: string) => void;
  delay?: number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  error?: string;
  value: string;
  rows?: number;
}

const TextArea: React.FC<Props> = ({
  id,
  label,
  placeholder,
  onChange,
  delay = 300,
  required,
  minLength,
  maxLength,
  error,
  value,
  rows = 4,
}) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const debouncedValue = useDebounce<string>(inputValue, delay);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
        <textarea
          rows={rows}
          name="comment"
          id="comment"
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

export default TextArea;
