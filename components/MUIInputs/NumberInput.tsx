import { TextField, TextFieldProps, FormControl } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import useDebounce from "@/hooks/useDebounce";

// Define the props with conditional types
type DebouncedTextInputProps = {
  value: number;
  onChange: (value: number) => void;
  delay?: number;
  helperText?: string;
  min?: number;
  max?: number;
} & Omit<TextFieldProps, "onChange" | "value">; // Omit the existing onChange and value from TextFieldProps

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
    color: "#059669", // Default label color
  },
  "& .MuiInputLabel-filled.Mui-focused": {
    color: "green", // Label color when focused
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#059669", // Border color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#059669", // Border color when focused
    },
  },
  "& .MuiInputLabel-outlined.Mui-focused": {
    color: "#059669", // Label color when focused
  },
}));

const DebouncedTextInput = ({
  value,
  onChange,
  delay = 300,
  helperText,
  min,
  max,
  ...props
}: DebouncedTextInputProps) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const debouncedValue = useDebounce<string>(inputValue, delay);
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (debouncedValue !== "" && debouncedValue !== value.toString()) {
      onChange(parseFloat(debouncedValue));
    }
  }, [debouncedValue, onChange, value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue === "" || newValue === "-") {
      setInputValue(newValue);
      return;
    }

    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      if (min !== undefined && numericValue < min) {
        setInputValue(min.toString());
      } else if (max !== undefined && numericValue > max) {
        setInputValue(max.toString());
      } else {
        setInputValue(newValue);
      }
    } else {
      setInputValue("");
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue === "" || inputValue === "-") {
      setInputValue(value.toString());
    }
  };

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  return (
    <FormControl fullWidth>
      <MyTextInput
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="text"
        variant="filled"
        fullWidth
        helperText={isFocused ? helperText : ""}
        inputProps={{ min, max }}
        {...props}
      />
    </FormControl>
  );
};

export default DebouncedTextInput;