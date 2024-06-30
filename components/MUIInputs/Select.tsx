import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectProps,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const MySelect = styled(Select)<SelectProps>(({ theme }) => ({
  "& .MuiSelect-select": {
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "lightgrey",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
    },
  },
}));

type CustomSelectProps = {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  required,
  error,
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value);
  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const newValue = e.target.value as string;
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return (
    <FormControl
      variant="outlined"
      fullWidth
      error={Boolean(error)}
      required={required}
    >
      <InputLabel>{label}</InputLabel>
      <MySelect
        value={currentValue}
        onChange={(e) => handleChange(e)}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MySelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
