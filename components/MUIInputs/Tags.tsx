import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export type TagOption = {
  label: string;
  value: string;
};

interface TagProps {
  label: string;
  placeholder?: string;
  defaultValue?: TagOption[];
  options: TagOption[];
  onChange: (value: TagOption[]) => void;
}
const Tags: React.FC<TagProps> = ({
  label,
  defaultValue,
  placeholder,
  options,
  onChange,
}) => {
  const onTagChange = (event: React.SyntheticEvent, value: TagOption[]) => {
    onChange(value);
  };
  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={options}
        getOptionLabel={(option) => option.label}
        defaultValue={defaultValue}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        filterSelectedOptions
        onChange={onTagChange}
        renderInput={(params) => (
          <TextField {...params} label={label} placeholder={placeholder} />
        )}
      />
    </Stack>
  );
};

export default Tags;
