// utils/sanitizeInput.ts

/**
 * Sanitizes a string by trimming leading/trailing spaces, removing all internal spaces, and converting it to lowercase.
 * @param input - The string to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeInput = (input: string): string => {
  return input.trim()
              .replace(/\s+/g, " ")
              .replace(/ /g, "_")
              .replace(/[^\w-]/g, "") // This line removes special characters except underscores and hyphens
              .toLowerCase();
};

/**
 * Validates a string to ensure it meets specific criteria.
 * @param input - The string to validate.
 * @param criteria - An optional object containing validation criteria.
 * @returns An object with isValid (boolean) and message (string) properties.
 */
export const validateInput = (
  input: string,
  criteria?: { minLength?: number; maxLength?: number; regex?: RegExp }
): { isValid: boolean; message: string } => {
  if (criteria?.minLength && input.length < criteria.minLength) {
    return {
      isValid: false,
      message: `Input must be at least ${criteria.minLength} characters long.`,
    };
  }
  if (criteria?.maxLength && input.length > criteria.maxLength) {
    return {
      isValid: false,
      message: `Input must be no more than ${criteria.maxLength} characters long.`,
    };
  }
  if (criteria?.regex && !criteria.regex.test(input)) {
    return {
      isValid: false,
      message: `Input does not match the required format.`,
    };
  }
  return { isValid: true, message: "Input is valid." };
};
