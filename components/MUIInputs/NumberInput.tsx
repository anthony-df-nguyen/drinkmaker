import { TextField, TextFieldProps, FormControl } from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";

/**
 * Props for the NumberInput component.
 */
type NumberInputProps = {
    /**
     * The current value of the input.
     */
    value: number;
    /**
     * Callback function that is called when the value of the input changes.
     * @param value - The new value of the input.
     */
    onChange: (value: number) => void;
    /**
     * Callback function that is called when there is an error with the input.
     * @param error - Indicates whether there is an error with the input.
     */
    handleError?: (error: boolean) => void;
    /**
     * Helper text to display below the input.
     */
    helperText?: string;
    /**
     * The minimum allowed value for the input.
     */
    min?: number;
    /**
     * The maximum allowed value for the input.
     */
    max?: number;
} & Omit<TextFieldProps, "onChange" | "value">;

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

/**
 * A custom number input component.
 * @param value - The current value of the input.
 * @param onChange - Callback function that is called when the value of the input changes.
 * @param handleError - Callback function that is called when there is an error with the input.
 * @param helperText - Helper text to display below the input.
 * @param min - The minimum allowed value for the input.
 * @param max - The maximum allowed value for the input.
 * @param props - Additional props for the TextField component.
 * @returns The NumberInput component.
 */
const NumberInput = ({
    value,
    onChange,
    handleError,
    helperText,
    min,
    max,
    ...props
}: NumberInputProps) => {
    const [inputValue, setInputValue] = useState<string>(value.toString());
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    

    /**
     * Handles the change event for the input element.
     * @param event - The change event object.
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        // Clear the input if the value is empty or a dash
        if (newValue === "" || newValue === "-") {
            // Clear the error if the input is empty
            setInputValue(newValue);
            setError(null);
            if (handleError) handleError(false);
            return;
        }

        // Parse the input value as a number
        const numericValue = parseFloat(newValue);

        // Check if the input value is a valid number or a decimal point
        if (!isNaN(numericValue) ||  newValue === ".") {
            // Check if the input value is within the specified range
            if (min !== undefined && numericValue < min) {
                setError(`Value must be at least ${min}`);
                if (handleError) handleError(true);
            } else if (max !== undefined && numericValue > max) {
                setError(`Value must be at most ${max}`);
                if (handleError) handleError(true);
            } else {
                // Clear the error if the input value is valid
                setError(null);
                if (handleError) handleError(false);
            }
            setInputValue(newValue);
            if (!isNaN(numericValue)) {
                onChange(numericValue);
            }
        } else {
            // Display an error if the input value is not a valid number
            setInputValue("");
            setError("Invalid number");
            if (handleError) handleError(true);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (inputValue === "" || inputValue === "-") {
            setInputValue(value.toString());
            setError(null);
            if (handleError) handleError(false);
        }
    };

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    return (
        <MyTextInput
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type="text"
            variant="filled"
            fullWidth
            error={Boolean(error)}
            helperText={isFocused ? helperText : error}
            inputProps={{ min, max }}
            size="small"
            {...props}
        />
    );
};

export default NumberInput;
