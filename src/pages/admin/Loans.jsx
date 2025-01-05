import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import loansData from "../../data/loans.json";

const Loans = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    setLoans(loansData.loans || []);
  }, []);

  const stats = [
    {
      title: 'Active Loans',
      value: '456',
      icon: BanknotesIcon,
      trend: '+12.5%',
      trendUp: true,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      icon: DocumentTextIcon,
      trend: '-2.3%',
      trendUp: false,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-500'
    },
    {
      title: 'Due Repayments',
      value: '₹ 125,000',
      icon: CalendarDaysIcon,
      trend: '+5.2%',
      trendUp: true,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      title: 'Overdue Loans',
      value: '12',
      icon: ClockIcon,
      trend: '+1.2%',
      trendUp: false,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500'
    }
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Loan Applications</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          New Loan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                <div className={`flex items-center mt-2 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="text-sm">{stat.trend}</span>
                </div>
              </div>
              <div className={`h-12 w-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={loanColumns}
          data={loans}
          filters={loanFilters}
          searchPlaceholder="Search by member name or loan ID..."
        />
      </div>
    </div>
  );
};

export default Loans;