import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import { memberService, loanService, savingsService } from "../../services/api";
import formatDate from "../../utils/dateFormatter";

const AdminDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all required data in parallel
        const [membersData, loansData, savingsData] = await Promise.all([
          memberService.getAllMembers(),
          loanService.getAllLoans(),
          savingsService.getAllSavings(),
        ]);

        setMembers(membersData);
        setLoans(loansData);
        setSavings(savingsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate summary statistics from real data
  const totalMembers = members.length;
  const activeMembersCount = members.filter(
    (m) => m.status === "Active"
  ).length;
  const totalSavingsAmount = members.reduce(
    (sum, m) => sum + (parseFloat(m.savingsBalance) || 0),
    0
  );
  const monthlyContributions = savings
    .filter((s) => s.type === "Monthly Contribution")
    .reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

  const activeLoans = loans.filter((loan) => loan.status === "Active");
  const totalActiveLoanAmount = activeLoans.reduce(
    (sum, loan) => sum + (parseFloat(loan.amount) || 0),
    0
  );

  const loanColumns = [
    { key: "id", header: "Loan ID" },
    { key: "memberName", header: "Member Name" },
    {
      key: "amount",
      header: "Amount",
      render: (item) => `$ ${parseFloat(item.amount).toLocaleString()}`,
    },
    { key: "purpose", header: "Purpose" },
    {
      key: "dateIssued",
      header: "Date Issued",
      render: (item) => formatDate(item.dateIssued),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (item) => formatDate(item.dueDate),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.status === "Active"
              ? "bg-green-100 text-green-800"
              : item.status === "Completed"
              ? "bg-blue-100 text-blue-800"
              : item.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  const memberColumns = [
    { key: "id", header: "Member ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "joinDate",
      header: "Join Date",
      render: (item) => formatDate(item.joinDate),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "savingsBalance",
      header: "Total Savings",
      render: (item) => `$ ${parseFloat(item.savingsBalance).toLocaleString()}`,
    },
  ];

  const savingsColumns = [
    { key: "memberId", header: "Member ID" },
    { key: "memberName", header: "Name" },
    {
      key: "amount",
      header: "Amount",
      render: (item) => `$ ${parseFloat(item.amount).toLocaleString()}`,
    },
    {
      key: "date",
      header: "Date",
      render: (item) => formatDate(item.date),
    },
    { key: "type", header: "Type" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.status === "Completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 font-semibold text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold">Error loading dashboard data</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 pt-4 overflow-y-auto">
        <h1 className="text-3xl font-extrabold text-amber-700">
          Staff Welfare Association Dashboard
        </h1>
        <div className="py-6 px-8">
          {/* Payment Statistics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                          $ {totalSavingsAmount.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Loans Card */}
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
                          {activeLoans.length} -{" "}
                          <span className="text-primary-500">
                            $ {totalActiveLoanAmount.toLocaleString()}
                          </span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Members Card */}
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
                            ({activeMembersCount} active)
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
                          $ {monthlyContributions.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Loans */}
          <div className="mt-8">
            <h2 className="text-xl font-bold font-nunito-sans text-primary-600 mb-4">
              Recent Loans
            </h2>
            <DataTable
              columns={loanColumns}
              data={loans}
              filters={[
                {
                  key: "status",
                  label: "Filter by Status",
                  options: [
                    { value: "All", label: "All Loans" },
                    { value: "Active", label: "Active" },
                    { value: "Completed", label: "Completed" },
                    { value: "Pending", label: "Pending" },
                    { value: "Rejected", label: "Rejected" },
                  ],
                },
              ]}
              searchPlaceholder="Search by loan applicant name or loan ID..."
            />
          </div>

          {/* Members List */}
          <div className="mt-8">
            <h2 className="text-xl font-bold font-nunito-sans text-primary-600 mb-4">
              Welfare Members
            </h2>
            <DataTable
              columns={memberColumns}
              data={members}
              filters={[
                {
                  key: "status",
                  label: "Filter by Status",
                  options: [
                    { value: "All", label: "All Members" },
                    { value: "Active", label: "Active Members" },
                    { value: "Inactive", label: "Inactive Members" },
                  ],
                },
              ]}
              searchPlaceholder="Search by member name or Member ID..."
            />
          </div>

          {/* Savings Accounts */}
          <div className="mt-8">
            <h2 className="text-xl font-bold font-nunito-sans text-primary-600 mb-4">
              Savings Accounts
            </h2>
            <DataTable
              columns={savingsColumns}
              data={savings}
              filters={[
                {
                  key: "type",
                  label: "Filter by Type",
                  options: [
                    { value: "All", label: "All Savings" },
                    {
                      value: "Monthly Contribution",
                      label: "Monthly Contribution",
                    },
                    {
                      value: "Additional Savings",
                      label: "Additional Savings",
                    },
                  ],
                },
                {
                  key: "status",
                  label: "Filter by Status",
                  options: [
                    { value: "All", label: "All Status" },
                    { value: "Completed", label: "Completed" },
                    { value: "Pending", label: "Pending" },
                  ],
                },
              ]}
              searchPlaceholder="Search by member name or savings ID..."
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
