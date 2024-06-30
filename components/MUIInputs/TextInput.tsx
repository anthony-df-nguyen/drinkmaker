import { TextField, TextFieldProps } from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import useDebounce from "@/hooks/useDebounce";

// Define the props with conditional types
type DebouncedTextInputProps<T extends string | number> = {
  value: T;
  onChange: (value: T) => void;
  delay?: number;
  helperText?: string;
  min?: number;
  max?: number;
  step?: number;
  type?: "text" | "number";
} & Omit<TextFieldProps, 'onChange' | 'value'>; // Omit the existing onChange and value from TextFieldProps

const MyTextInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  "& .MuiFilledInput-root": {
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
    },
  },
  "& .MuiFilledInput-input": {
    // padding: theme.spacing(2),
  },
  "& .MuiInputLabel-filled": {
    color: "default", // Default label color
  },
  "& .MuiInputLabel-filled.Mui-focused": {
    color: "green", // Label color when focused
  },
}));

const DebouncedTextInput = <T extends string | number>({
  value,
  onChange,
  delay = 300,
  type = "text",
  helperText,
  min,
  max,
  ...props
}: DebouncedTextInputProps<T>) => {
  const [inputValue, setInputValue] = useState<T>(value);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const debouncedValue = useDebounce<T>(inputValue, delay);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: T = event.target.value as T;

    if (type === "number") {
      const numericValue = Number(newValue);
      if (min !== undefined && numericValue < min) {
        newValue = min as T;
      } else if (max !== undefined && numericValue > max) {
        newValue = max as T;
      } else {
        newValue = numericValue as T;
      }
    }

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
    <MyTextInput
      value={inputValue}
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      type={type}
      variant="filled"
      fullWidth
      helperText={isFocused ? helperText : ''}
      inputProps={{ min, max }}
      {...props}
    />
  );
};

export default DebouncedTextInput;