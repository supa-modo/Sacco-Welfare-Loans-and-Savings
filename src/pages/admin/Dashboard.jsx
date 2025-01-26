import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  BanknotesIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
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
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyType, setHistoryType] = useState(null);

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
        .slice(0, 10); // Get only the 10 most recent transactions

      // Filter active loans and members
      const activeLoansData = loansData.filter(
        (loan) => loan.status === "Active"
      );
      const activeMembersData = membersData.filter(
        (member) => member.status === "Active"
      );

      setDashboardData({
        members: membersData,
        loans: loansData,
        savings: savingsData,
        recentTransactions: allTransactions,
        activeLoans: activeLoansData,
        activeMembers: activeMembersData,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
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

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Savings Card */}
        <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white p-4 rounded-xl border border-gray-300 shadow-md">
          <div className="p-5">
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
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Loans Card */}
        <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white p-4 rounded-xl border border-gray-300 shadow-md">
          <div className="p-5">
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
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Members Card */}
        <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white p-4 rounded-xl border border-gray-300 shadow-md">
          <div className="p-5">
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
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Contributions Card */}
        <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white p-4 rounded-xl border border-gray-300 shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-12 w-12 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm text-amber-600 font-semibold font-geist">
                    Monthly Contributions
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold font-nunito-sans text-gray-600 mt-1">
                      $ {(totalSavings / totalMembers).toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="   rounded-2xl overflow-hidden">
        <DataTable
          title="Recent Transactions"
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

      {/* Active Loans Table */}
      <div className=" rounded-2xl overflow-hidden">
        <DataTable
          title="Active Loan Applications"
          data={dashboardData.activeLoans || []}
          columns={[
            {
              header: "Member",
              accessor: "member.name",
            },
            {
              header: "Loan Amount",
              accessor: "amount",
              render: (item) => `$${parseFloat(item.amount).toLocaleString()}`,
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

      {/* Active Members Table */}
      <div className=" rounded-2xl overflow-hidden">
        <DataTable
          title="Active Welfare Members"
          data={dashboardData.activeMembers || []}
          columns={[
            {
              header: "Member ID",
              accessor: "id",
            },
            {
              header: "Name",
              accessor: "name",
            },
            {
              header: "Email",
              accessor: "email",
            },
            {
              header: "Phone",
              accessor: "phone",
            },
            {
              header: "Join Date",
              accessor: "joinDate",
              render: (item) => formatDate(item.joinDate),
            },
            {
              header: "Savings Balance",
              accessor: "savingsBalance",
              render: (item) =>
                `$${parseFloat(item.savingsBalance).toLocaleString()}`,
            },
          ]}
          searchPlaceholder="Search active members..."
        />
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
