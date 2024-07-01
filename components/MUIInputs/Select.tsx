import React from "react";
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
    //backgroundColor: "white",
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
  variant?: "standard" | "outlined" | "filled";
} & Omit<SelectProps, "onChange" | "value">;

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  required,
  error,
  variant = "outlined",
  ...props
}) => {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const newValue = event.target.value as string;
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
      <MySelect value={value} onChange={handleChange} label={label} variant={variant} {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MySelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
