import * as React from "react";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export type TagOption = {
  label: string;
  value: string;
};

/**
 * Props for the Tags component.
 */
interface TagProps {
  label: string;
  placeholder?: string;
  defaultValue?: TagOption[];
  options: TagOption[];
  onChange: (value: TagOption[]) => void;
}

/**
 * A component for selecting tags from a list of options.
 */
const Tags: React.FC<TagProps> = ({
  label,
  defaultValue = [],
  placeholder,
  options,
  onChange,
}) => {
  const [selectedTags, setSelectedTags] = useState<TagOption[]>(defaultValue);

  useEffect(() => {
    setSelectedTags(defaultValue);
  }, [defaultValue]);

  /**
   * Handles the change event when tags are selected or deselected.
   * @param event - The event object.
   * @param value - The selected tags.
   */
  const onTagChange = (event: React.SyntheticEvent, value: TagOption[]) => {
    setSelectedTags(value);
    onChange(value);
  };

  return (
    <Stack spacing={3}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={options}
        getOptionLabel={(option) => option.label}
        value={selectedTags}
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