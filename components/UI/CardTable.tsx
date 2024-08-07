import React from "react";
import Card from "./Card";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  breakpoint?: string; // Optional breakpoint prop
  hideColumnsOnMobile?: boolean; // Optional hideColumnsOnMobile prop
}

const CardTable = <T extends { [key: string]: any }>({
  columns,
  data,
  breakpoint = "md", // Default breakpoint is medium,
  hideColumnsOnMobile = false,
}: TableProps<T>): JSX.Element => {
  const isCardView = window.matchMedia(`(max-width: ${breakpoint})`).matches;

  return (
    <div className="flow-root relative w-full">
      {isCardView ? (
        <div className="flex flex-col gap-4">
          {data.map((row, rowIndex) => (
            <Card key={rowIndex} className="flex flex-col gap-4">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="">
                  {!hideColumnsOnMobile && (
                    <div className="font-semibold">{column.header}</div>
                  )}
                  <div className="mt-1">
                    {column.render ? column.render(row, colIndex) : row[column.accessor]}
                  </div>
                </div>
              ))}
            </Card>
          ))}
        </div>
      ) : (
        <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden ring-1 ring-black ring-opacity-5 rounded-md">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-black">
                <thead className="bg-gray-100 dark:bg-stone-900">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={String(column.accessor)}
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-stone-800 bg-white dark:bg-stone-700">
                  {data.map((item, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td
                          key={String(column.accessor)}
                          className="whitespace-wrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-300 sm:pl-6"
                        >
                          {column.render
                            ? column.render(item, index)
                            : item[column.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardTable;
export type { Column };
