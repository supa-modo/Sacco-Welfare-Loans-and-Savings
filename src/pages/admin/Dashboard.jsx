import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  BanknotesIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DataTable from "../../components/common/DataTable";
import FinancialHistoryModal from "../../components/modals/HistoryModal";
import formatDate from "../../utils/dateFormatter";
import { loanService, memberService, savingsService } from "../../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    members: [],
    loans: [],
    savings: [],
    recentTransactions: [],
    activeLoans: [],
    activeMembers: [],
    monthlyStats: [],
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyType, setHistoryType] = useState(null);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [membersData, loansData, savingsData] = await Promise.all([
        memberService.getAllMembers(),
        loanService.getAllLoans(),
        savingsService.getAllSavings(),
      ]);

      // Get recent transactions from both loans and savings
      const loanTransactions = loansData
        .flatMap((loan) => loan.repayments || [])
        .map((repayment) => ({
          ...repayment,
          id: repayment.id,
          type: "Loan Repayment",
          memberName: loansData.find((loan) => loan.id === repayment.loanId)
            ?.member?.name,
          date: repayment.date,
        }));

      const savingsTransactions = savingsData
        .flatMap((saving) => saving.transactions || [])
        .map((transaction) => ({
          ...transaction,
          id: transaction.id,
          type: transaction.transactionType,
          memberName: savingsData.find(
            (saving) => saving.memberId === transaction.memberId
          )?.member?.name,
          date: transaction.transactionDate,
          amount: transaction.amount,
          status: "Completed",
        }));

      // Combine and sort all transactions by date
      const allTransactions = [...loanTransactions, ...savingsTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

      // Filter active loans and members
      const activeLoansData = loansData.filter(
        (loan) => loan.status === "Active"
      );
      const activeMembersData = membersData.filter(
        (member) => member.status === "Active"
      );

      // Generate monthly statistics for the past 12 months
      const monthlyStats = generateMonthlyStats(loansData, savingsData);

      setDashboardData({
        members: membersData,
        loans: loansData,
        savings: savingsData,
        recentTransactions: allTransactions,
        activeLoans: activeLoansData,
        activeMembers: activeMembersData,
        monthlyStats,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyStats = (loans, savings) => {
    const months = [];
    const today = new Date();

    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toLocaleString("default", { month: "short" });

      // Calculate total loan repayments for the month
      const monthlyRepayments = loans
        .flatMap((loan) => loan.repayments || [])
        .filter((repayment) => {
          const repaymentDate = new Date(repayment.date);
          return (
            repaymentDate.getMonth() === date.getMonth() &&
            repaymentDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, repayment) => sum + parseFloat(repayment.amount || 0), 0);

      // Calculate total savings for the month
      const monthlySavings = savings
        .flatMap((saving) => saving.transactions || [])
        .filter((transaction) => {
          const transactionDate = new Date(transaction.transactionDate);
          return (
            transactionDate.getMonth() === date.getMonth() &&
            transactionDate.getFullYear() === date.getFullYear() &&
            transaction.transactionType === "Deposit"
          );
        })
        .reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount || 0),
          0
        );

      // Calculate loan disbursements for the month
      const monthlyDisbursements = loans
        .filter((loan) => {
          const issueDate = new Date(loan.dateIssued);
          return (
            issueDate.getMonth() === date.getMonth() &&
            issueDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, loan) => sum + parseFloat(loan.amount || 0), 0);

      months.push({
        month: monthKey,
        loanRepayments: monthlyRepayments,
        savingsDeposits: monthlySavings,
        loanDisbursements: monthlyDisbursements,
      });
    }

    return months;
  };

  const handleRowClick = (item, type) => {
    setSelectedItem(item);
    setHistoryType(type);
    setHistoryModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-semibold">{error}</div>
      </div>
    );
  }

  // Calculate statistics
  const totalMembers = dashboardData.members.length;
  const activeMembers = dashboardData.members.filter(
    (member) => member.status === "Active"
  ).length;
  const totalLoans = dashboardData.loans.length;
  const activeLoans = dashboardData.loans.filter(
    (loan) => loan.status === "Active"
  ).length;
  const totalLoanAmount = dashboardData.loans.reduce(
    (sum, loan) => sum + parseFloat(loan.amount || 0),
    0
  );
  const totalSavings = dashboardData.members.reduce(
    (sum, member) => sum + parseFloat(member.savingsBalance || 0),
    0
  );

  // Calculate loan performance metrics
  const totalRepaidLoans = dashboardData.loans.filter(
    (loan) => loan.status === "Paid"
  ).length;
  const loanRepaymentRate = (totalRepaidLoans / totalLoans) * 100;
  const averageLoanAmount = totalLoanAmount / totalLoans;

  // Calculate savings metrics
  const averageSavingsPerMember = totalSavings / activeMembers;
  const monthlyGrowthRate =
    dashboardData.monthlyStats.length > 1
      ? (dashboardData.monthlyStats[dashboardData.monthlyStats.length - 1]
          .savingsDeposits /
          dashboardData.monthlyStats[dashboardData.monthlyStats.length - 2]
            .savingsDeposits -
          1) *
        100
      : 0;

  // Prepare data for loan status distribution pie chart
  const loanStatusData = [
    { name: "Active", value: activeLoans },
    { name: "Paid", value: totalRepaidLoans },
    {
      name: "Pending",
      value: dashboardData.loans.filter((loan) => loan.status === "Pending")
        .length,
    },
    {
      name: "Defaulted",
      value: dashboardData.loans.filter((loan) => loan.status === "Defaulted")
        .length,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[2000px] mx-auto">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-700">
            Welcome back, {user?.name || "Admin"}
          </h1>
          <p className="text-gray-500 mt-2">
            Here's what's happening with the welfare group today.
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Savings Card */}
        <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
          <div className="px-5 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-12 w-12 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm text-amber-600 font-semibold font-geist">
                    Total Savings Balance
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold font-nunito-sans text-gray-600 mt-1">
                      $ {totalSavings.toLocaleString()}
                    </div>
                  </dd>
                  <p className=" mt-1 text-sm font-semibold font-nunito-sans text-green-600">
                    {monthlyGrowthRate > 0
                      ? `+${monthlyGrowthRate.toFixed(1)}%`
                      : `${monthlyGrowthRate.toFixed(1)}%`}
                  </p>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Loans Card */}
        <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
          <div className="px-5 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-12 w-12 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm text-amber-600 font-semibold font-geist">
                    Active Loans
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold font-nunito-sans text-gray-600 mt-1">
                      {activeLoans} -{" "}
                      <span className="text-primary-500">
                        $ {totalLoanAmount.toLocaleString()}
                      </span>
                    </div>
                  </dd>
                  <p className="text-sm text-gray-500 mt-1">
                    {loanRepaymentRate.toFixed(1)}% repayment rate
                  </p>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Members Card */}
        <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
          <div className="px-5 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm text-amber-600 font-semibold font-geist">
                    Total Members
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold font-nunito-sans text-gray-600 mt-1">
                      {totalMembers}
                      <span className="ml-2 text-sm text-gray-500">
                        ({activeMembers} active)
                      </span>
                    </div>
                  </dd>
                  <p className="text-sm text-gray-500 mt-1">
                    Avg. savings: ${averageSavingsPerMember.toLocaleString()}
                  </p>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Performance Card */}
        <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
          <div className="px-5 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-12 w-12 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm text-amber-600 font-semibold font-geist">
                    Loan Performance
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold font-nunito-sans text-gray-600 mt-1">
                      ${averageLoanAmount.toLocaleString()}
                    </div>
                  </dd>
                  <p className="text-sm text-gray-500 mt-1">
                    Average loan amount
                  </p>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Financial Trends Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Financial Trends
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="savingsDeposits"
                  name="Savings"
                  stackId="1"
                  stroke="#4F46E5"
                  fill="#818CF8"
                />
                <Area
                  type="monotone"
                  dataKey="loanRepayments"
                  name="Loan Repayments"
                  stackId="2"
                  stroke="#059669"
                  fill="#34D399"
                />
                <Area
                  type="monotone"
                  dataKey="loanDisbursements"
                  name="Loan Disbursements"
                  stackId="3"
                  stroke="#DC2626"
                  fill="#F87171"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Status Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Loan Status Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {loanStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Transactions
          </h2>
          <DataTable
            data={dashboardData.recentTransactions}
            columns={[
              {
                header: "Member",
                accessor: "memberName",
              },
              {
                header: "Transaction Type",
                accessor: "type",
              },
              {
                header: "Amount",
                accessor: "amount",
                render: (item) =>
                  `$${Math.abs(parseFloat(item.amount)).toLocaleString()}`,
              },
              {
                header: "Date",
                accessor: "date",
                render: (item) => formatDate(item.date),
              },
              {
                header: "Status",
                accessor: "status",
              },
            ]}
            onRowClick={(item) =>
              handleRowClick(
                item,
                item.type === "Loan Repayment" ? "loan" : "savings"
              )
            }
            searchPlaceholder="Search transactions..."
          />
        </div>
      </div>

      {/* Active Loans Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Active Loan Applications
          </h2>
          <DataTable
            data={dashboardData.activeLoans}
            columns={[
              {
                header: "Member",
                accessor: "member.name",
              },
              {
                header: "Loan Amount",
                accessor: "amount",
                render: (item) =>
                  `$${parseFloat(item.amount).toLocaleString()}`,
              },
              {
                header: "Balance",
                accessor: "remainingBalance",
                render: (item) =>
                  `$${parseFloat(item.remainingBalance).toLocaleString()}`,
              },
              {
                header: "Issue Date",
                accessor: "dateIssued",
                render: (item) => formatDate(item.dateIssued),
              },
              {
                header: "Due Date",
                accessor: "dueDate",
                render: (item) => formatDate(item.dueDate),
              },
              {
                header: "Status",
                accessor: "status",
              },
            ]}
            onRowClick={(item) => handleRowClick(item, "loan")}
            searchPlaceholder="Search active loans..."
          />
        </div>
      </div>

      {/* History Modal */}
      <FinancialHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        type={historyType}
        id={selectedItem?.id}
        applicantName={selectedItem?.memberName}
      />
    </div>
  );
};

export default Dashboard;
