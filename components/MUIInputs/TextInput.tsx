import { TextField, TextFieldProps, FormControl, FormHelperText } from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import useDebounce from "@/hooks/useDebounce";

// Define the props with conditional types
type DebouncedTextInputProps<T extends string | number> = {
  value: T;
  onChange: (value: string) => void;
  delay?: number;
  helperText?: string;
  errorText?: string;
  error?: boolean;
  // size? : "small" | "medium" ;
} & Omit<TextFieldProps, "onChange" | "value">;

const DebouncedTextInput = <T extends string | number>({
  value,
  onChange,
  delay = 300,
  helperText,
  errorText,
  error,
  ...props
}: DebouncedTextInputProps<string>) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const debouncedValue = useDebounce<string>(inputValue, delay);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: string = event.target.value as string;

    setInputValue(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="dark:text-gray-300">
      {" "}
      <TextField
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="text"
        variant="filled"
        fullWidth
        error={error}
        helperText={error ? errorText : helperText}
        // size={size}
        {...props}
      />
     
    </div>
  );
};

export default DebouncedTextInput;
