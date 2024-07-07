/**
 * Props for the Pagination component.
 */
interface PaginationProps {
  /**
   * The total number of items.
   */
  totalItems: number;

  /**
   * The number of items to display per page.
   */
  itemsPerPage: number;

  /**
   * The current page number.
   */
  currentPage: number;

  /**
   * Callback function triggered when the page changes.
   * @param page - The new page number.
   */
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 dark:border-0 py-3"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700 dark:text-gray-400">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md bg-white dark:bg-stone-950 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400 ring-1 dark:ring-0 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md bg-white dark:bg-stone-950 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400 ring-1 dark:ring-0 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
