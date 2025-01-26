import React, { useState, useEffect, useContext } from "react";
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
import formatDate from "../../utils/dateFormatter";
import { useAuth } from "../../context/AuthContext";

const MemberDashboard = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [savingsHistory, setSavingsHistory] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define month names array
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [user.memberId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch loans
      const loansResponse = await fetch(
        `http://localhost:5000/api/loans/member/${user.memberId}`
      );
      if (!loansResponse.ok) throw new Error("Failed to fetch loans");
      const loansData = await loansResponse.json();
      setLoans(loansData);

      // Fetch savings
      const savingsResponse = await fetch(
        `http://localhost:5000/api/savings/member/${user.memberId}`
      );
      if (!savingsResponse.ok) throw new Error("Failed to fetch savings");
      const savingsData = await savingsResponse.json();
      setSavingsHistory(savingsData);
      setTransactions(savingsData.transactions || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate quick stats
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const quickStats = [
    {
      title: "Total Balance",
      value: `$${(
        savingsHistory?.currentSavingsBalance || 0
      ).toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: BanknotesIcon,
      color: "text-emerald-500",
    },
    {
      title: "Monthly Savings",
      value: `$${transactions
        .filter((tx) => {
          const txDate = new Date(tx.transactionDate);
          return (
            tx.transactionType === "Deposit" &&
            txDate.getMonth() === currentMonth &&
            txDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
        .toLocaleString()}`,
      change: "+8.2%",
      trend: "up",
      icon: BiTrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Active Loans",
      value: `$${loans
        .filter((loan) => loan.status === "Active")
        .reduce((sum, loan) => sum + parseFloat(loan.remainingBalance), 0)
        .toLocaleString()}`,
      change: "-2.4%",
      trend: "down",
      icon: CreditCardIcon,
      color: "text-amber-500",
    },
    {
      title: "Investments",
      value: "$0",
      change: "+0%",
      trend: "up",
      icon: ChartBarIcon,
      color: "text-purple-500",
    },
  ];

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 4).map((tx) => ({
    id: tx.transactionNo,
    description: `${tx.transactionType} - ${tx.notes || "Transaction"}`,
    amount: `${tx.transactionType === "Deposit" ? "+" : "-"}$${Math.abs(
      parseFloat(tx.amount)
    ).toLocaleString()}`,
    date: formatDate(tx.transactionDate),
    type: tx.transactionType === "Deposit" ? "credit" : "debit",
  }));

  // Prepare chart data for the current year
  const chartData = monthNames.map((month, index) => {
    const monthTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.transactionDate);
      return (
        txDate.getFullYear() === currentYear && txDate.getMonth() === index
      );
    });

    const monthLoans = loans.filter((loan) => {
      const loanDate = new Date(loan.dateIssued);
      return (
        loanDate.getFullYear() === currentYear && loanDate.getMonth() === index
      );
    });

    const savingsBalance =
      monthTransactions.length > 0
        ? monthTransactions[monthTransactions.length - 1].balanceAfter
        : 0;

    const loanBalance = monthLoans.reduce(
      (total, loan) =>
        total +
        (loan.status === "Active" ? parseFloat(loan.remainingBalance) : 0),
      0
    );

    return {
      month,
      savingsBalance,
      loanBalance,
    };
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 font-semibold text-gray-600">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold">Error loading dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-500">
            Welcome back,{" "}
            <span className="text-primary-500">
              {user?.member?.name || "Member"}
            </span>
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
                    dataKey="savingsBalance"
                    name="Savings Balance"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#fcd34d"
                  />
                  <Area
                    type="monotone"
                    dataKey="loanBalance"
                    name="Loan Balance"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#fca5a5"
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
            <DataTable
              data={loans}
              columns={[
                { header: "Loan ID", accessor: "id" },
                {
                  header: "Amount",
                  accessor: "amount",
                  render: (item) =>
                    `$ ${parseFloat(item.amount).toLocaleString()}`,
                },
                { header: "Purpose", accessor: "purpose" },
                {
                  header: "Date Issued",
                  accessor: "dateIssued",
                  render: (item) => formatDate(item.dateIssued) || "Not Issued",
                },
                {
                  header: "Due Date",
                  accessor: "dueDate",
                  render: (item) => formatDate(item.dueDate),
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
              onRowClick={(row) => {
                setSelectedLoan(row);
                setIsRepaymentModalOpen(true);
              }}
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
          </div>

          {/* Savings DataTable */}
          <div className="col-span-3 px-4 sm:px-6 lg:px-8 pb-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl font-extrabold mb-3 text-amber-700">
              Your Savings Account
            </h1>
            <DataTable
              data={transactions}
              columns={[
                { header: "Transaction No", accessor: "transactionNo" },
                {
                  header: "Date",
                  accessor: "transactionDate",
                  render: (item) => formatDate(item.transactionDate),
                },
                {
                  header: "Type",
                  accessor: "transactionType",
                  render: (item) => (
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                        item.transactionType === "Deposit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.transactionType}
                    </span>
                  ),
                },
                {
                  header: "Amount",
                  accessor: "amount",
                  render: (item) =>
                    `$ ${Math.abs(parseFloat(item.amount)).toLocaleString()}`,
                },
                {
                  header: "Balance After",
                  accessor: "balanceAfter",
                  render: (item) =>
                    `$ ${parseFloat(item.balanceAfter).toLocaleString()}`,
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
          </div>
        </div>

        {/* Loan Repayment Modal */}
        <FinancialHistoryModal
          open={isRepaymentModalOpen}
          onClose={() => setIsRepaymentModalOpen(false)}
          type="loan"
          id={selectedLoan?.id}
        />
      </div>
    </div>
  );
};

export default MemberDashboard;
