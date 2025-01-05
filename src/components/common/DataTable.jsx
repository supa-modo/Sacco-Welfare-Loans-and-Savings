import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const DataTable = ({ columns, data, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        {columns.map((column) => (
          <div key={column.key} className={column.className}>
            {column.header}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {currentData.map((item, index) => (
          <div
            key={item.id || index}
            className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4 p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            {columns.map((column) => (
              <div key={column.key} className={column.className}>
                {column.render ? column.render(item) : item[column.key]}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
