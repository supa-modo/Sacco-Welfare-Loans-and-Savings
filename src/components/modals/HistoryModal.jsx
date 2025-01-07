import React, { useState } from "react";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

const FinancialHistoryModal = ({ open, onClose, type = "loan", data, id }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!data || !open) return null;

  const { details, transactions } =
    type === "loan"
      ? { details: data.loanDetails, transactions: data.repayments }
      : { details: data.memberDetails, transactions: data.transactions };

  const handleDownload = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${type}-history-${id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const progressPercentage =
    type === "loan"
      ? ((details.totalAmount - details.remainingBalance) /
          details.totalAmount) *
        100
      : null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${open ? "" : "hidden"}`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm]"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl pb-1 text-left overflow-hidden shadow-2xl transform transition-all sm:my-12 sm:align-middle md:max-w-7xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-500 pl-6 pr-2 py-4 sm:pl-8 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              {type === "loan"
                ? "Loan Details & Repayment History"
                : "Memeber Savings Details"}
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-primary-600 rounded-lg p-2 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white px-6 pt-6 pb-8 sm:px-8">
            {/* Details Section */}
            <div className="mb-6 bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
              <h4 className="font-nunito-sans font-extrabold uppercase mb-4 text-amber-700">
                {type === "loan"
                  ? "Loan Application Details"
                  : "Member Details"}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(details).map(
                  ([key, value]) =>
                    key !== "remainingBalance" && (
                      <div key={key} className="flex flex-col">
                        <span className="text-sm font-bold text-gray-500 mb-1">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                        <span className="text-primary-500 font-nunito-sans font-bold">
                          {typeof value === "number" &&
                          key.toLowerCase().includes("amount")
                            ? `$ ${value.toLocaleString()}`
                            : typeof value === "string" &&
                              !isNaN(Date.parse(value))
                            ? new Date(value).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : value}
                        </span>
                      </div>
                    )
                )}
              </div>

              {/* Progress Bar for Loans */}
              {type === "loan" && (
                <div className="mt-3 bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-gray-500">
                      Repayment Progress
                    </span>
                    <span className="text-sm font-semibold text-primary-600">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Remaining Balance:{" "}
                    <span className="font-bold text-red-500">
                      USD {details.remainingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction History Section */}
            <div>
            <div className="px-6 py-3 bg-white border-gray-300 flex justify-between items-center">
            <h4 className="font-nunito-sans font-extrabold uppercase text-amber-700">
                  Transactions History
                </h4>
                <button
                  onClick={handleDownload}
                  className="flex items-center px-4 py-[0.3rem] bg-primary-100 font-semibold text-primary-600 rounded-lg hover:bg-primary-100 transition-colors border border-gray-300"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Download History Report
                </button>
              </div>

            </div>
            <div className="rounded-xl border border-gray-300 overflow-hidden">
              
              <table className="w-full">
                <thead>
                  <tr className="bg-primary-500">
                    {Object.keys(currentItems[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <span>
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </span>
                          <HiMiniArrowsUpDown className="h-4 w-4 text-white/70" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-amber-50 transition-colors"
                    >
                      {Object.entries(item).map(([key, value]) => (
                        <td
                          key={key}
                          className="px-6 py-4 text-sm text-gray-600"
                        >
                          {typeof value === "number" &&
                          key.toLowerCase().includes("amount")
                            ? `$ ${Math.abs(value).toLocaleString()}`
                            : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, transactions.length)} of{" "}
                    {transactions.length} entries
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 bg-white border font-nunito-sans border-gray-300 rounded-lg text-sm text-gray-600 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {[10, 25, 50, 100].map((value) => (
                      <option key={value} value={value}>
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

                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
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
                    }
                  )}

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
        </div>
      </div>
    </div>
  );
};

export default FinancialHistoryModal;
