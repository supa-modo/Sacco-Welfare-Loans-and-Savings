import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { HiMiniArrowsUpDown, HiMiniShieldCheck } from "react-icons/hi2";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import formatDate from "../../utils/dateFormatter";
import { loanService } from "../../services/api";
import NotificationModal from "../common/NotificationModal";
import { useAuth } from "../../context/AuthContext";

const FinancialHistoryModal = ({
  open,
  onClose,
  type = "loan",
  id,
  applicantName,
}) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    type: "confirm",
    title: "",
    message: "",
    onConfirm: null,
  });

  // Fetch data based on type and ID
  useEffect(() => {
    if (open && id) {
      const fetchData = async () => {
        try {
          const endpoint =
            type === "loan"
              ? `http://localhost:5000/api/loans/${id}`
              : `http://localhost:5000/api/savings/member/${id}`;
          const response = await fetch(endpoint);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const result = await response.json();
          setData(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [open, id, type]);

  if (!open || !data) return null;

  // Safely extract details and transactions
  const details = data || {};
  const transactions =
    type === "loan" ? data.repayments || [] : data.transactions || [];

  // Filter out unwanted fields from details
  const filteredDetails = Object.entries(details).reduce(
    (acc, [key, value]) => {
      if (
        (type === "savings" &&
          !["createdAt", "updatedAt", "transactions"].includes(key)) ||
        (type === "loan" &&
          ![
            "createdAt",
            "updatedAt",
            "memberId",
            "member",
            "remainingBalance",
            "repayments",
            "documents",
            "employmentContract",
            "bankStatements",
            "idDocument",
          ].includes(key))
      ) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  // Define table columns based on type
  const tableColumns =
    type === "savings"
      ? [
          { key: "transactionNo", header: "Transaction No" },
          {
            key: "transactionDate",
            header: "Trans. Date",
            render: (item) =>
              item.transactionDate
                ? `${formatDate(item.transactionDate)}`
                : "N/A",
          },
          { key: "transactionType", header: "Trans. Type" },
          {
            key: "amount",
            header: "Amount",
            render: (item) =>
              item.amount
                ? `$ ${Math.abs(item.amount).toLocaleString()}`
                : "N/A",
          },
          {
            key: "balanceAfter",
            header: "Balance",
            render: (item) =>
              item.balanceAfter
                ? `$ ${item.balanceAfter.toLocaleString()}`
                : "N/A",
          },
          { key: "notes", header: "Notes" },
        ]
      : [
          { key: "repaymentId", header: "Repayment Id" },
          {
            key: "date",
            header: "Date",
            render: (item) => (item.date ? `${formatDate(item.date)}` : "N/A"),
          },
          {
            key: "amount",
            header: "Amount",
            render: (item) =>
              item.amount
                ? `$ ${Math.abs(item.amount).toLocaleString()}`
                : "N/A",
          },
          {
            key: "principalPaid",
            header: "Principal",
            render: (item) =>
              item.principalPaid
                ? `$ ${item.principalPaid.toLocaleString()}`
                : "N/A",
          },
          {
            key: "interestPaid",
            header: "Interest",
            render: (item) =>
              item.interestPaid
                ? `$ ${item.interestPaid.toLocaleString()}`
                : "N/A",
          },
          {
            key: "balanceAfter",
            header: "Balance",
            render: (item) =>
              item.balanceAfter
                ? `$ ${item.balanceAfter.toLocaleString()}`
                : "N/A",
          },
          {
            key: "status",
            header: "Status",
            render: (item) => (
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-lg font-nunito-sans ${
                  item.status === "Completed"
                    ? "bg-primary-300 text-green-900"
                    : item.status === "Pending"
                    ? "bg-amber-200 text-yellow-800"
                    : "bg-red-400 text-red-800"
                }`}
              >
                {item.status}
              </span>
            ),
          },
        ];

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
      ? details.remainingBalance === 0
        ? 100
        : ((details.amount - details.remainingBalance) / details.amount) * 100
      : null;

  const handleLoanApproval = async () => {
    try {
      await loanService.approveLoan(id);
      setNotificationConfig({
        type: "success",
        title: "Loan Approved",
        message: "The loan has been successfully approved.",
      });
      setNotificationModalOpen(true);

      // Refresh the data
      const response = await fetch(`http://localhost:5000/api/loans/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch updated data");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setNotificationConfig({
        type: "error",
        title: "Approval Failed",
        message: error.response?.data?.error || "Failed to approve the loan.",
      });
      setNotificationModalOpen(true);
    }
  };

  const showApprovalConfirmation = () => {
    setNotificationConfig({
      type: "confirm",
      title: "Confirm Loan Approval",
      message: "Are you sure you want to approve this loan application?",
      onConfirm: handleLoanApproval,
    });
    setNotificationModalOpen(true);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${open ? "" : "hidden"}`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm"></div>
        </div>

        {/* Modal Container */}
        <div
          className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-12 sm:align-middle md:max-w-7xl sm:w-full"
          style={{ maxHeight: "92vh" }} // Set max height to 80% of viewport height
        >
          {/* Header Section */}
          <div className="bg-primary-500 pl-6 pr-2 py-4 sm:pl-8 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              {type === "loan"
                ? "Loan Details & Repayment History"
                : "Member Savings Details"}
              {applicantName && (
                <span className="text-amber-300 font-bold font-open-sans ml-2">
                  - {applicantName} - {data.memberId}
                </span>
              )}
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-primary-600 rounded-lg p-2 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content Section (Scrollable) */}
          <div className="overflow-y-auto" style={{ maxHeight: "90vh" }}>
            <div className="bg-white px-6 pt-6 pb-8 mb-14 sm:px-8">
              {/* Details Section */}
              <div className="mb-6 bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h4 className="font-nunito-sans font-extrabold uppercase mb-4 text-amber-700">
                  {type === "loan"
                    ? "Loan Application Details"
                    : "Member Details"}
                </h4>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                    {Object.entries(filteredDetails).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-sm font-bold text-gray-500 mb-1">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                        <span className="text-primary-500 font-nunito-sans font-bold">
                          {value === null || value === undefined || value === ""
                            ? "N/A"
                            : typeof value === "number" &&
                              key.toLowerCase().includes("amount")
                            ? `$ ${value.toLocaleString()}`
                            : typeof value === "string" &&
                              !isNaN(Date.parse(value))
                            ? `${formatDate(value)}`
                            : value.toString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  {type === "loan" && (
                    <div className="w-[40%]">
                      <div className="">
                        <h4 className="text-sm font-bold text-amber-700">
                          Documents Provided
                        </h4>
                        <div className="mt-6 space-y-4">
                          {data.documents?.employmentContract ? (
                            <a
                              href={data.documents.employmentContract}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-gray-500 hover:text-primary-500 hover:font-bold hover:underline hover:underline-offset-4 cursor-pointer"
                            >
                              <DocumentTextIcon className="h-5 w-5 mr-2" />
                              Employment Letter / Contract
                            </a>
                          ) : (
                            <div className="flex items-center text-sm text-red-500">
                              <DocumentTextIcon className="h-5 w-5 mr-2" />
                              Contract/Letter - N/A
                            </div>
                          )}
                          {data.documents?.bankStatements ? (
                            <a
                              href={data.documents.bankStatements}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-gray-500 hover:text-primary-500 hover:font-bold hover:underline hover:underline-offset-4 cursor-pointer"
                            >
                              <DocumentTextIcon className="h-5 w-5 mr-2" />
                              Bank Statements
                            </a>
                          ) : (
                            <div className="flex items-center text-sm text-red-500">
                              <DocumentTextIcon className="h-5 w-5 mr-2" />
                              Bank Statement - N/A
                            </div>
                          )}
                          {data.documents?.idDocument ? (
                            <a
                              href={data.documents.idDocument}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-gray-500 hover:text-primary-500 hover:font-bold hover:underline hover:underline-offset-4 cursor-pointer"
                            >
                              <DocumentTextIcon className="h-5 w-5 mr-2" />
                              Identification Document
                            </a>
                          ) : (
                            <div className="flex items-center text-sm text-red-500">
                              <DocumentTextIcon className="h-5 w-5 mr-2" />
                              ID - N/A
                            </div>
                          )}
                        </div>
                      </div>

                      {user?.role === "admin" && (
                        <div className="mt-6">
                          <button
                            onClick={showApprovalConfirmation}
                            disabled={data?.status !== "Pending"}
                            className={`px-6 py-2 flex items-center space-x-3 rounded-lg font-semibold transition-all ${
                              data?.status === "Pending"
                                ? "bg-primary-500 text-white hover:bg-primary-600"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                            title={
                              data?.status !== "Pending"
                                ? "This loan has already been processed"
                                : "Approve this loan"
                            }
                          >
                            <HiMiniShieldCheck size={22} />
                            <span>Approve this Loan</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress Bar for Loans */}
                {type === "loan" && details.amount && (
                  <div className="mt-3 bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-gray-500">
                        Repayment Progress
                      </span>
                      <span className="text-sm font-extrabold font-nunito-sans text-primary-600">
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
                        USD{" "}
                        {details.remainingBalance
                          ? details.remainingBalance.toLocaleString()
                          : "0"}
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
                      {tableColumns.map((column) => (
                        <th
                          key={column.key}
                          className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-2">
                            <span>{column.header}</span>
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
                        {tableColumns.map((column) => (
                          <td
                            key={column.key}
                            className="px-6 py-4 text-sm text-gray-600"
                          >
                            {column.render
                              ? column.render(item)
                              : item[column.key]}
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

      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        onConfirm={
          notificationConfig.type === "confirm"
            ? notificationConfig.onConfirm
            : undefined
        }
        title={notificationConfig.title}
        message={notificationConfig.message}
        type={notificationConfig.type}
      />
    </div>
  );
};

export default FinancialHistoryModal;
