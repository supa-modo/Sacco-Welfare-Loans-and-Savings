import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import loansData from "../../data/loans.json";
import membersData from "../../data/members.json";
import savingsData from "../../data/savings.json";

const AdminDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    // Set the parsed data
    setMembers(membersData.members || []);
    setSavings(savingsData.savings || []);
    setLoans(loansData.loans || []);
  }, []);

  // Calculate summary statistics
  const totalMembers = members.length;
  const activeMembersCount = members.filter(
    (m) => m.status === "Active"
  ).length;
  const totalSavingsAmount = members.reduce(
    (sum, m) => sum + (m.savingsBalance || 0),
    0
  );
  const monthlyContributions = savings
    .filter((s) => s.type === "Monthly Contribution")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const loanColumns = [
    { key: "id", header: "Loan ID" },
    { key: "memberName", header: "Member Name" },
    { key: "amount", header: "Amount", render: (item) => `₹ ${item.amount}` },
    { key: "purpose", header: "Purpose" },
    { key: "dateIssued", header: "Date Issued" },
    { key: "dueDate", header: "Due Date" },
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
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  const loanFilters = [
    {
      key: "status",
      label: "Filter by Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Completed", label: "Completed" },
        { value: "Pending", label: "Pending" },
      ],
    },
  ];

  const memberColumns = [
    { key: "id", header: "Member ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "joinDate", header: "Join Date" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      ),
    },
    {
      key: "savingsBalance",
      header: "Total Savings",
      render: (item) => `₹ ${item.savingsBalance}`,
    },
  ];

  const memberFilters = [
    {
      key: "status",
      label: "Filter by Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  // For Savings component
  const savingsColumns = [
    { key: "memberId", header: "Member ID" },
    { key: "memberName", header: "Name" },
    { key: "amount", header: "Amount", render: (item) => `₹ ${item.amount}` },
    { key: "date", header: "Date" },
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

  const savingsFilters = [
    {
      key: "type",
      label: "Filter by Type",
      options: [
        { value: "Monthly Contribution", label: "Monthly Contribution" },
        { value: "Additional Savings", label: "Additional Savings" },
        { value: "Withdrawal", label: "Withdrawal" },
      ],
    },
    {
      key: "status",
      label: "Filter by Status",
      options: [
        { value: "Completed", label: "Completed" },
        { value: "Pending", label: "Pending" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 px-8">
          {/* Payment Statistics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Savings Card */}
            <div className="bg-white overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BanknotesIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Savings
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          KES {totalSavingsAmount.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Loans Card */}
            <div className="bg-white overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Loans
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {loans.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Members Card */}
            <div className="bg-white overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Members
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {totalMembers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Contributions Card */}
            <div className="bg-white overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Monthly Contributions
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          KES {monthlyContributions.toLocaleString()}
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Loans
            </h2>
            <DataTable
              columns={loanColumns}
              data={loans}
              filters={loanFilters}
              searchPlaceholder="Search by loan applicant name or loan ID..."
            />
          </div>

          {/* Members List */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Welfare Members
            </h2>
            <DataTable
              columns={memberColumns}
              data={members}
              filters={memberFilters}
              searchPlaceholder="Search by member name or Member ID..."
            />
          </div>

          {/* Savings Accounts */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Savings Accounts
            </h2>
            <DataTable
              columns={savingsColumns}
              data={savings}
              filters={savingsFilters}
              searchPlaceholder="Search by member name or savings ID..."
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
