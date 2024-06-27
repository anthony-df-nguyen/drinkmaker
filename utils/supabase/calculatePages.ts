/**
 * Calculates the total number of pages based on the total count of items and the number of results per page.
 * 
 * @param totalCount - The total count of items.
 * @param resultsPerPage - The number of results to display per page.
 * @returns The total number of pages.
 */
export const calculatePages = (totalCount: number, resultsPerPage: number): number => {
  return Math.ceil(totalCount / resultsPerPage);
};

