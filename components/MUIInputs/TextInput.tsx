import { TextField, TextFieldProps } from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import useDebounce from "@/hooks/useDebounce";

type DebouncedTextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
  required?: boolean;
  error?: string;
  minRows?: number;
  multiline?: boolean;
};

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
    //   padding: theme.spacing(2),
    },
    "& .MuiInputLabel-filled": {
      color: "default", // Default label color
    },
    "& .MuiInputLabel-filled.Mui-focused": {
      color: "green", // Label color when focused
    },
  }));

const DebouncedTextInput: React.FC<DebouncedTextInputProps> = ({
  label,
  value,
  onChange,
  delay = 300,
  placeholder,
  required,
  error,
  multiline,
  minRows,
}) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const debouncedValue = useDebounce<string>(inputValue, delay);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <MyTextInput
      label={label}
      value={inputValue}
      onChange={handleInputChange}
      type="text"
      variant="filled"
      fullWidth
      placeholder={placeholder}
      required={required}
      error={Boolean(error)}
      helperText={error}
      multiline={multiline}
      minRows={minRows}
    />
  );
};

export default DebouncedTextInput;
