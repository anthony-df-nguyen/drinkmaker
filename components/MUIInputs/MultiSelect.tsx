import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectProps,
  FormHelperText,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Chip,
  Box,
  MenuItemProps
} from "@mui/material";
import { styled } from "@mui/material/styles";

const MyMultiSelect = styled(Select)<SelectProps>(({ theme }) => ({
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
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  error?: string;
};

const CustomMultiSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  required,
  error,
}) => {
  const [currentValues, setCurrentValues] = useState<string[]>(value);
  const ITEM_HEIGHT = 72;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const newValue = e.target.value as string[];
    setCurrentValues(newValue);
    onChange(newValue);
  };

  const handleDelete = (deletedValue: string, event: React.MouseEvent) => {
    const newValues = currentValues.filter((val) => val !== deletedValue);
    setCurrentValues(newValues);
    onChange(newValues);
  };

  return (
    <FormControl
      variant="outlined"
      fullWidth
      error={Boolean(error)}
      required={required}
    >
      <InputLabel>{label}</InputLabel>
      <MyMultiSelect
        value={currentValues}
        onChange={handleChange}
        label={label}
        multiple
        MenuProps={MenuProps}
        renderValue={(selected: any) => {
          const labelMap = selected.map(
            (opt: string) =>
              options.find((o) => o.value === opt)?.label || ""
          );
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {labelMap.map((label: string, index: number) => (
                <Chip
                  sx={{ backgroundColor: 'red' }}
                  key={label}
                  label={label}
                  onDelete={(event) => handleDelete(selected[index], event)}
                  onMouseDown={(event) => event.stopPropagation()}
                />
              ))}
            </Box>
          );
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={currentValues.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </MyMultiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomMultiSelect;