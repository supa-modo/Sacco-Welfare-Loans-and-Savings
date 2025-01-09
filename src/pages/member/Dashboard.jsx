import React, { useState, useEffect } from "react";
import {
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BiTrendingUp } from "react-icons/bi";
import FinancialHistoryModal from "../../components/modals/HistoryModal";
import DataTable from "../../components/common/DataTable";

const MemberDashboard = ({ memberId = "M1002" }) => {
  const chartData = [
    { month: "Jan", balance: 6000, savings: 2400, investment: 2400 },
    { month: "Feb", balance: 3000, savings: 2800, investment: 2800 },
    { month: "Mar", balance: 5000, savings: 3200, investment: 3200 },
    { month: "Apr", balance: 7780, savings: 3600, investment: 3600 },
    { month: "May", balance: 3890, savings: 4000, investment: 4000 },
    { month: "Jun", balance: 4390, savings: 4400, investment: 4400 },
    { month: "Jul", balance: 3390, savings: 5400, investment: 4400 },
    { month: "Aug", balance: 4390, savings: 6400, investment: 4400 },
    { month: "Sep", balance: 2390, savings: 7400, investment: 4400 },
    { month: "Oct", balance: 6390, savings: 5400, investment: 4400 },
    { month: "Nov", balance: 2390, savings: 8400, investment: 4400 },
    { month: "Dec", balance: 4390, savings: 9400, investment: 4400 },
  ];

  const quickStats = [
    {
      title: "Total Balance",
      value: "$24,500",
      change: "+12.5%",
      trend: "up",
      icon: BanknotesIcon,
      color: "text-emerald-500",
    },
    {
      title: "Monthly Savings",
      value: "$2,150",
      change: "+8.2%",
      trend: "up",
      icon: BiTrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Active Loans",
      value: "$12,000",
      change: "-2.4%",
      trend: "down",
      icon: CreditCardIcon,
      color: "text-amber-500",
    },
    {
      title: "Investments",
      value: "$8,750",
      change: "+15.3%",
      trend: "up",
      icon: ChartBarIcon,
      color: "text-purple-500",
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      description: "Monthly Savings Deposit",
      amount: "+$500.00",
      date: "Today",
      type: "credit",
    },
    {
      id: 2,
      description: "Loan Payment",
      amount: "-$350.00",
      date: "Yesterday",
      type: "debit",
    },
    {
      id: 3,
      description: "Investment Return",
      amount: "+$125.50",
      date: "2 days ago",
      type: "credit",
    },
    {
      id: 3,
      description: "Monthly Savings Deposit",
      amount: "+$125.50",
      date: "2 days ago",
      type: "credit",
    },
  ];

  // State management
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
  const [savingsHistory, setSavingsHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch loan data
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        // Import loan data
        const loansData = await import("../../data/loans.json");
        const memberLoans = loansData.loans.filter(
          (loan) => loan.applicantMemberID === memberId
        );
        setLoans(memberLoans);
      } catch (err) {
        console.error("Error loading loans:", err);
        setError("Failed to load loan data");
      }
    };

    fetchLoans();
  }, [memberId]);

  // Fetch savings data
  useEffect(() => {
    const fetchSavingsHistory = async () => {
      try {
        // Import savings history data
        const savingsData = await import("../../data/savingsHistory.json");
        const memberData = savingsData.savingsHistory[memberId];
        if (memberData?.transactions) {
          setSavingsHistory(memberData.transactions);
        }
      } catch (err) {
        console.error("Error loading savings:", err);
        setError("Failed to load savings data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavingsHistory();
  }, [memberId]);

  // Handle loan repayment modal
  const handleLoanRowClick = async (row) => {
    try {
      // Import loan repayments data
      const repaymentData = await import("../../data/loanRepayments.json");
      setSelectedLoanId(row.id);
      setIsRepaymentModalOpen(true);
    } catch (err) {
      console.error("Error loading repayment data:", err);
    }
  };

  const loanFilters = [
    {
      key: "status",
      label: "Filter by Status",
      options: [
        { value: "All", label: "All Loans" },
        { value: "Active", label: "Active" },
        { value: "Paid", label: "Paid" },
        { value: "Pending", label: "Pending" },
        { value: "Rejected", label: "Rejected" },
      ],
    },
  ];

  const savingsFilters = [
    {
      key: "transactionType",
      label: "Filter by Type",
      options: [
        { value: "All", label: "All Transactions" },
        { value: "Deposit", label: "Deposits" },
        { value: "Withdrawal", label: "Withdrawals" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-500">
            Welcome back, <span className="text-primary-500">John</span>
          </h1>
          <p className="text-gray-500 mt-2">Here's your financial overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-gradient-to-br from-primary-100 via-gray-100 to-white py-6 px-8 rounded-xl border border-gray-300"
              >
                <div className="flex items-center space-x-10 mb-2">
                  <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                    <Icon className={`h-12 w-12 ${stat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold font-nunito-sans text-amber-700">
                      {stat.value}
                    </p>
                  </div>
                  {/* <div
                    className={`flex items-center ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm font-semibold">{stat.change}</span>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-gradient-to-br from-amber-50 via-gray-100 to-white py-6 px-8 rounded-xl border border-gray-200 shadow-sm">
            <h1 className="text-2xl font-extrabold mb-3 text-amber-700">
              Financial Overview
            </h1>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#fcd34d"
                  />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#93c5fd"
                  />
                  <Area
                    type="monotone"
                    dataKey="investment"
                    stackId="1"
                    stroke="#10b981"
                    fill="#6ee7b7"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gradient-to-br from-gray-100 via-gray-100 to-white py-6 px-4 rounded-xl border border-gray-200 shadow-sm">
            <h1 className="text-2xl font-extrabold mb-3 text-amber-700">
              Recent Transactions
            </h1>
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-amber-50 border border-gray-200/60 shadow-sm rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold font-nunito-sans text-gray-500">
                        {transaction.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                  <p
                    className={`font-extrabold text-sm font-nunito-sans ${
                      transaction.type === "credit"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Loans DataTable */}
          <div className="col-span-3 px-4 sm:px-6 lg:px-8 pb-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl font-extrabold mb-3 text-amber-700">
              Your Loan Applications
            </h1>
            {isLoading ? (
              <p>Loading loan data...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : loans.length === 0 ? (
              <p>No loan applications found.</p>
            ) : (
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
                  {
                    header: "Date Issued",
                    accessor: "dateIssued",
                    render: (item) =>
                      new Date(item.dateIssued).toLocaleDateString(),
                  },
                  {
                    header: "Due Date",
                    accessor: "dueDate",
                    render: (item) =>
                      new Date(item.dueDate).toLocaleDateString(),
                  },
                  {
                    header: "Status",
                    accessor: "status",
                    render: (item) => (
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-lg font-nunito-sans ${
                          item.status === "Active"
                            ? "bg-primary-300 text-green-800"
                            : item.status === "Paid"
                            ? "bg-blue-100 text-blue-800"
                            : item.status === "Pending"
                            ? "bg-amber-200 text-yellow-800"
                            : "bg-red-400 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    ),
                  },
                ]}
                onRowClick={handleLoanRowClick}
                filters={[
                  {
                    key: "status",
                    label: "Filter by Status",
                    options: [
                      { value: "All", label: "All Loans" },
                      { value: "Active", label: "Active" },
                      { value: "Paid", label: "Paid" },
                      { value: "Pending", label: "Pending" },
                      { value: "Rejected", label: "Rejected" },
                    ],
                  },
                ]}
                searchPlaceholder="Search by loan ID or purpose..."
              />
            )}
          </div>

          {/* Savings DataTable */}
          <div className="col-span-3 px-4 sm:px-6 lg:px-8 pb-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl font-extrabold mb-3 text-amber-700">
              Your Savings Account
            </h1>
            {isLoading ? (
              <p>Loading savings data...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : savingsHistory.length === 0 ? (
              <p>No savings transactions found.</p>
            ) : (
              <DataTable
                data={savingsHistory}
                columns={[
                  { header: "Transaction No", accessor: "transactionNo" },
                  {
                    header: "Date",
                    accessor: "transactionDate",
                    render: (item) =>
                      new Date(item.transactionDate).toLocaleDateString(),
                  },
                  { header: "Type", accessor: "transactionType" },
                  {
                    header: "Amount",
                    accessor: "amount",
                    render: (item) =>
                      `$ ${Math.abs(item.amount).toLocaleString()}`,
                  },
                  {
                    header: "Balance After",
                    accessor: "balanceAfter",
                    render: (item) => `$ ${item.balanceAfter.toLocaleString()}`,
                  },
                  { header: "Notes", accessor: "notes" },
                ]}
                filters={[
                  {
                    key: "transactionType",
                    label: "Filter by Type",
                    options: [
                      { value: "All", label: "All Transactions" },
                      { value: "Deposit", label: "Deposits" },
                      { value: "Withdrawal", label: "Withdrawals" },
                    ],
                  },
                ]}
                searchPlaceholder="Search by transaction number or type..."
              />
            )}
          </div>
        </div>

        {/* Loan Repayment Modal */}
        <FinancialHistoryModal
          open={isRepaymentModalOpen}
          onClose={() => setIsRepaymentModalOpen(false)}
          type="loan"
          data={
            selectedLoanId
              ? import("../../data/loanRepayments.json").then(
                  (data) => data.loanRepayments[selectedLoanId]
                )
              : null
          }
          id={selectedLoanId}
        />
      </div>
    </div>
  );
};

export default MemberDashboard;
