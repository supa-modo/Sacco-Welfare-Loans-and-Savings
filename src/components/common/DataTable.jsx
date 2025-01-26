import React, { useState, useMemo } from "react";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { TbChevronLeft, TbChevronRight, TbTrash } from "react-icons/tb";

const DataTable = ({
  title,
  columns,
  data,
  filters,
  searchPlaceholder = "Search...",
  defaultItemsPerPage = 10,
  onDelete,
  onRowClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [activeFilters, setActiveFilters] = useState(() => {
    if (!filters) return {};
    return filters.reduce((acc, filter) => {
      acc[filter.key] = "All";
      return acc;
    }, {});
  });

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Handle filter selection
  const handleFilterClick = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "All" : value,
    }));
  };

  // Handle delete
  const handleDelete = (item) => {
    if (onDelete) {
      onDelete(item);
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Apply search
    if (searchQuery) {
      processedData = processedData.filter((item) =>
        columns.some((column) =>
          String(item[column.accessor || column.key])
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.keys(activeFilters).forEach((key) => {
      if (activeFilters[key] && activeFilters[key] !== "All") {
        processedData = processedData.filter(
          (item) =>
            String(item[key]).toLowerCase() === activeFilters[key].toLowerCase()
        );
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      processedData.sort((a, b) => {
        const aValue = String(a[sortConfig.key]);
        const bValue = String(b[sortConfig.key]);
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    return processedData;
  }, [data, searchQuery, sortConfig, activeFilters, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-2">
      {/* Header Section */}
      <div className="bg-white shadow-md border-t border-gray-100 rounded-2xl flex items-center justify-between py-4 px-6 space-x-4">
        {title && (
          <h3 className="font-nunito-sans font-extrabold uppercase text-amber-700 text-[17pxs] ">
            {title}
          </h3>
        )}
        {/* Filters */}
        {filters && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <div key={filter.key} className="flex flex-wrap gap-1">
                {filter.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterClick(filter.key, option.value)}
                    className={`px-6 py-[0.55rem] text-sm shadow-md font-semibold font-nunito-sans rounded-lg transition-all
                      ${
                        activeFilters[filter.key] === option.value
                          ? "bg-primary-500 text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative w-[40%] font-semibold">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-14 pr-4 py-[0.65rem] text-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IoMdClose className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border-gray-300 overflow-hidden">
        <table className="w-full">
          <thead className="border border-primary-500">
            <tr className="bg-primary-500">
              <th key="index" className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column.accessor || column.key}
                  onClick={() => handleSort(column.accessor || column.key)}
                  className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    <HiMiniArrowsUpDown className="h-4 w-4 text-white" />
                  </div>
                </th>
              ))}
              <th key="actions" className="px-6 py-5 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-x border-gray-300 hover:bg-amber-100 transition-colors"
              >
                <td className="px-6 py-2 text-sm border-b border-gray-200 text-gray-600">
                  {startIndex + index + 1}.
                </td>
                {columns.map((column) => (
                  <td
                    key={column.accessor || column.key}
                    onClick={() => onRowClick && onRowClick(item)}
                    className="px-6 py-2 text-sm border-b border-gray-200 text-gray-600 cursor-pointer"
                  >
                    {column.render ? column.render(item) : item[column.accessor || column.key]}
                  </td>
                ))}
                <td className="px-6 py-2 text-sm border-b border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <TbTrash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-x border-b rounded-b-2xl border-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredAndSortedData.length)} of{" "}
              {filteredAndSortedData.length} entries
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-semibold font-nunito-sans shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {[10, 25, 50, 100].map((value) => (
                <option key={value} value={value} className="bg-gray-100">
                  {value} per page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TbChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - (4 - i);
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    currentPage === pageNum
                      ? "bg-primary-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TbChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
