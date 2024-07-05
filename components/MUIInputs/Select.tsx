import React, { useState } from "react";
import {
  Select,
  SelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

type CustomSelectProps = {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  variant?: "outlined" | "standard" | "filled";
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  required,
  error,variant
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const newValue = event.target.value as string;
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return (
    <FormControl
      variant={variant || "outlined"}
      fullWidth
      required={required}
      error={Boolean(error)}
    >
      <InputLabel>{label}</InputLabel>
      <Select value={currentValue} onChange={handleChange} label={label} size="small">
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
