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

const MySelect = styled(Select)<SelectProps>(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "", // Default border color
    },
    "&:hover fieldset": {
      borderColor: "#059669", // Border color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#059669", // Border color when focused
    },
  },
  "& .MuiSelect-select": {
    backgroundColor: "none",
    "&:hover": {
      backgroundColor: "none", // Background color on hover
    },
    "&.Mui-focused": {
      backgroundColor: "none", // Background color when focused
    },
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#059669", // Border color when focused
  },
}));

const MyFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: "#059669", // Default label color
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#059669", // Label color when focused
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

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const newValue = event.target.value as string;
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return (
    <MyFormControl
      variant="outlined"
      fullWidth
      required={required}
      error={Boolean(error)}
    >
      <InputLabel>{label}</InputLabel>
      <MySelect value={currentValue} onChange={handleChange} label={label} size="small">
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MySelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </MyFormControl>
  );
};

export default CustomSelect;
