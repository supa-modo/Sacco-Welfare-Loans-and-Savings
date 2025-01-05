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

const AdminDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Simulating API calls
    setLoans(loansData.loans);
    setMembers(membersData.members);
  }, []);

  const loanColumns = [
    { key: "id", header: "Loan ID", className: "font-medium text-gray-900 dark:text-white" },
    { key: "memberName", header: "Member Name", className: "text-gray-700 dark:text-gray-300" },
    { 
      key: "amount", 
      header: "Amount", 
      className: "text-gray-700 dark:text-gray-300",
      render: (loan) => `KES ${loan.amount.toLocaleString()}`
    },
    { key: "purpose", header: "Purpose", className: "text-gray-700 dark:text-gray-300" },
    { 
      key: "status", 
      header: "Status",
      className: "text-gray-700 dark:text-gray-300",
      render: (loan) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          loan.status === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
        }`}>
          {loan.status}
        </span>
      )
    }
  ];

  const memberColumns = [
    { key: "id", header: "Member ID", className: "font-medium text-gray-900 dark:text-white" },
    { key: "name", header: "Name", className: "text-gray-700 dark:text-gray-300" },
    { key: "email", header: "Email", className: "text-gray-700 dark:text-gray-300" },
    { 
      key: "savingsBalance", 
      header: "Savings Balance",
      className: "text-gray-700 dark:text-gray-300",
      render: (member) => `KES ${member.savingsBalance.toLocaleString()}`
    },
    { 
      key: "status", 
      header: "Status",
      className: "text-gray-700 dark:text-gray-300",
      render: (member) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          member.status === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
        }`}>
          {member.status}
        </span>
      )
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 px-8">
          {/* Payment Statistics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Savings Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BanknotesIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total Savings
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          KES 2.4M
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Loans Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Active Loans
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          156
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Members Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total Members
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          1,234
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Contributions Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarDaysIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Monthly Contributions
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          KES 450K
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
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Loans</h2>
            <DataTable columns={loanColumns} data={loans} itemsPerPage={5} />
          </div>

          {/* Recent Members */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Members</h2>
            <DataTable columns={memberColumns} data={members} itemsPerPage={5} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
