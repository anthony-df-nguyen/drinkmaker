// utilities/formatText.ts

/**
 * Converts underscored text to user-friendly text.
 * @param text - The underscored text to convert.
 * @returns The user-friendly text.
 */
export const formatText = (text: string): string => {
    return text
      .split('_')  // Split the string by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
      .join(' ');  // Join the words with spaces
  };