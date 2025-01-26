import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DataTable from "../common/DataTable";
import { LiaUserEditSolid } from "react-icons/lia";
import formatDate from "../../utils/dateFormatter";
import { loanService, savingsService } from "../../services/api";

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
  const [loans, setLoans] = useState([]);
  const [savings, setSavings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && memberId) {
      fetchData();
    }
  }, [open, memberId]);

  const fetchData = async () => {
    if (!memberId) return;

    setLoading(true);
    setError(null);
    try {
      const [loansData, savingsData] = await Promise.all([
        loanService.getMemberLoans(memberId),
        savingsService.getMemberSavings(memberId),
      ]);

      setLoans(loansData || []);
      setSavings(savingsData || null);
    } catch (error) {
      console.error("Error fetching member data:", error);
      setError(error.message || "Failed to fetch member data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberData) {
      setEditedData(memberData);
    }
  }, [memberData]);

  if (!open) return null;

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center">
              <p className="text-red-500 font-semibold">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats for loans
  const totalLoans = loans.length;
  const activeLoans = loans.filter((loan) => loan.status === "Active").length;
  const totalLoanAmount = loans.reduce(
    (sum, loan) => sum + parseFloat(loan.amount),
    0
  );
  const remainingLoanBalance = loans
    .filter((loan) => loan.status === "Active")
    .reduce((sum, loan) => sum + parseFloat(loan.remainingBalance), 0);

  // Calculate stats for savings
  const savingsBalance = savings?.currentSavingsBalance || 0;
  const updatedAt = savings?.transactions?.[0]?.updatedAt || null;
  const totalContributions =
    savings?.transactions?.reduce((sum, trans) => {
      return trans.transactionType === "Deposit"
        ? sum + Number(trans.amount)
        : sum;
    }, 0) || 0;

  const handleSaveChanges = async () => {
    try {
      await memberService.updateMember(memberId, editedData);
      setIsEditing(false);
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error updating member:", error);
      // Handle error appropriately
    }
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-screen items-center justify-center ">
        <div className="relative w-full sm:align-middle md:max-w-7xl sm:w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header - Fixed */}
          <div className="bg-primary-500 pl-6 pr-2 py-4 sm:pl-8 flex justify-between items-center rounded-t-3xl">
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

          {/* Content - Scrollable */}
          <div className="max-h-[82vh] overflow-y-auto">
            {/* Tabs */}
            <div className="px-6 py-4 sm:px-8 border-b border-gray-200">
              <div className="flex space-x-4">
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
                  Loans History
                </TabButton>
                <TabButton
                  active={activeTab === "savings"}
                  onClick={() => setActiveTab("savings")}
                >
                  Savings History
                </TabButton>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8">
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
                      data={loans}
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
                          render: (item) => `${formatDate(item.dateIssued)}`,
                        },
                        {
                          header: "Due Date",
                          accessor: "dueDate",
                          render: (item) => `${formatDate(item.dueDate)}`,
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
                        value={updatedAt ? `${formatDate(updatedAt)}` : "N/A"}
                      />
                    </div>
                  </div>

                  {savings?.transactions && (
                    <div className="shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="font-nunito-sans font-extrabold uppercase text-amber-700">
                          Transaction History
                        </h4>
                      </div>
                      <DataTable
                        data={savings.transactions}
                        columns={[
                          {
                            header: "Transaction No",
                            accessor: "transactionNo",
                          },
                          {
                            header: "Date",
                            accessor: "transactionDate",
                            render: (item) =>
                              `${formatDate(item.transactionDate)}`,
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
    </div>
  );
};

export default MemberDetailsModal;
