import React, { useState, useEffect } from "react";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import DataTable from "../common/DataTable";
import loansData from "../../data/loans.json";
import savingsHistoryData from "../../data/savingsHistory.json";
import { LiaUserEditSolid } from "react-icons/lia";

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-8 py-2.5 font-nunito-sans font-bold text-sm rounded-lg transition-all ${
      active
        ? "bg-primary-500 text-white shadow-md"
        : "text-gray-600 hover:bg-primary-50 border border-gray-200"
    }`}
  >
    {children}
  </button>
);

const StatCard = ({ title, value, className = "" }) => (
  <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white p-4 rounded-xl shadow-sm border border-gray-300 hover:border-primary-400 transition-colors">
    <h4 className="text-sm font-bold text-gray-500 mb-1">{title}</h4>
    <p className="text-2xl font-nunito-sans font-extrabold text-primary-500">
      {value}
    </p>
  </div>
);

const MemberDetailsModal = ({ open, onClose, memberId, memberData }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (memberData) {
      setEditedData(memberData);
    }
  }, [memberData]);

  if (!open) return null;

  const memberLoans = memberId
    ? loansData.loans.filter((loan) => loan.applicantMemberID === memberId)
    : [];

  const savingsHistory =
    memberId && savingsHistoryData.savingsHistory
      ? savingsHistoryData.savingsHistory[memberId]
      : null;

  // Calculate stats
  const totalLoans = memberLoans.length;
  const activeLoans = memberLoans.filter(
    (loan) => loan.status === "Active"
  ).length;
  const totalLoanAmount = memberLoans.reduce(
    (sum, loan) => sum + (loan.amount || 0),
    0
  );
  const remainingLoanBalance = memberLoans
    .filter((loan) => loan.status === "Active")
    .reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);

  const savingsBalance = memberData?.savingsBalance || 0;
  const lastContribution = memberData?.lastContribution;
  const totalContributions =
    savingsHistory?.transactions?.reduce(
      (sum, trans) =>
        sum + (trans.transactionType === "Deposit" ? trans.amount : 0),
      0
    ) || 0;

  const handleSaveChanges = () => {
    console.log("Saving member details:", editedData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const memberFields = memberData
    ? [
        { key: "id", label: "Member ID" },
        { key: "name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "pfNo", label: "Staff Number" },
        { key: "jobTitle", label: "Job Title" },
        { key: "phone", label: "Phone" },
        { key: "address", label: "Residential Address" },
        { key: "joinDate", label: "Join Date" },
        { key: "status", label: "Status" },
        { key: "savingsBalance", label: "Savings Account Balance" },
        { key: "lastContribution", label: "Last Contribution" },
      ]
    : [];

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${open ? "" : "hidden"}`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-12 sm:align-middle md:max-w-7xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-500 pl-6 pr-2 py-4 sm:pl-8 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white font-nunito-sans">
              {memberData
                ? `Welfare Member Information - ${memberData.name}`
                : "Loading..."}
            </h3>
            <button
              onClick={onClose}
              className="hover:text-white text-white hover:bg-primary-600 rounded-lg px-3 py-2 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white/50">
            <div className="px-6 sm:px-8 py-4 flex space-x-2">
              <TabButton
                active={activeTab === "details"}
                onClick={() => setActiveTab("details")}
              >
                Member Details
              </TabButton>
              <TabButton
                active={activeTab === "loans"}
                onClick={() => setActiveTab("loans")}
              >
                Loan Applications
              </TabButton>
              <TabButton
                active={activeTab === "savings"}
                onClick={() => setActiveTab("savings")}
              >
                Savings Account
              </TabButton>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pt-6 pb-8 sm:px-8 bg-gray-50">
            {/* Member Details Tab */}
            {activeTab === "details" && memberData && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-nunito-sans font-extrabold uppercase text-amber-700">
                      Personal Information
                    </h4>
                    <div className="flex">
                      {isEditing ? (
                        <button
                          onClick={handleSaveChanges}
                          className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold shadow-sm"
                        >
                          Save Changes
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 px-6 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                        >
                          <LiaUserEditSolid size={23} />
                          <span>Edit Member Details</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {memberFields.map(({ key, label }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-sm font-bold text-gray-500">
                          {label}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData[key] || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-nunito-sans"
                          />
                        ) : (
                          <p className="text-primary-500 font-nunito-sans font-bold">
                            {key.includes("Balance")
                              ? `$ ${(editedData[key] || 0).toLocaleString()}`
                              : key.includes("Date")
                              ? new Date(editedData[key]).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : key.includes("lastContribution")
                              ? new Date(editedData[key]).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : editedData[key]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loans Tab */}
            {activeTab === "loans" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-nunito-sans font-extrabold uppercase mb-4 text-amber-700">
                    Loans Overview
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="Total Loans" value={totalLoans} />
                    <StatCard title="Active Loans" value={activeLoans} />
                    <StatCard
                      title="Total Amount"
                      value={`$ ${totalLoanAmount.toLocaleString()}`}
                    />
                    <StatCard
                      title="Outstanding Balance"
                      value={`$ ${remainingLoanBalance.toLocaleString()}`}
                    />
                  </div>
                </div>

                <div className="shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="font-nunito-sans font-extrabold uppercase text-amber-700">
                      Loan Applications History
                    </h4>
                  </div>
                  <DataTable
                    data={memberLoans}
                    columns={[
                      { header: "Loan ID", accessor: "id" },
                      {
                        header: "Amount",
                        accessor: "amount",
                        render: (item) => `$ ${item.amount.toLocaleString()}`,
                      },
                      { header: "Purpose", accessor: "purpose" },
                      { header: "Status", accessor: "status" },
                      {
                        header: "Date Issued",
                        accessor: "dateIssued",
                        render: (item) =>
                          new Date(item.dateIssued).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          ),
                      },
                      {
                        header: "Due Date",
                        accessor: "dueDate",
                        render: (item) =>
                          new Date(item.dueDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }),
                      },
                    ]}
                    searchPlaceholder="Filter loans by Loan ID / Amount / Purpose / Status..."
                  />
                </div>
              </div>
            )}

            {/* Savings Tab */}
            {activeTab === "savings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-nunito-sans font-extrabold uppercase mb-4 text-amber-700">
                    Savings Overview
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                      title="Current Balance"
                      value={`$ ${savingsBalance.toLocaleString()}`}
                    />
                    <StatCard
                      title="Total Contributions"
                      value={`$ ${totalContributions.toLocaleString()}`}
                    />
                    <StatCard
                      title="Last Contribution"
                      value={
                        lastContribution
                          ? new Date(lastContribution).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"
                      }
                    />
                  </div>
                </div>

                {savingsHistory?.transactions && (
                  <div className=" shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h4 className="font-nunito-sans font-extrabold uppercase text-amber-700">
                        Transaction History
                      </h4>
                    </div>
                    <DataTable
                      data={savingsHistory.transactions}
                      columns={[
                        { header: "Transaction No", accessor: "transactionNo" },
                        {
                          header: "Date",
                          accessor: "transactionDate",
                          render: (item) =>
                            new Date(item.transactionDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            ),
                        },
                        { header: "Type", accessor: "transactionType" },
                        {
                          header: "Amount",
                          accessor: "amount",
                          render: (item) =>
                            `$ ${Math.abs(item.amount).toLocaleString()}`,
                        },
                        {
                          header: "Balance",
                          accessor: "balanceAfter",
                          render: (item) =>
                            `$ ${item.balanceAfter.toLocaleString()}`,
                        },
                        { header: "Notes", accessor: "notes" },
                      ]}
                      searchPlaceholder="Search transactions..."
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;
