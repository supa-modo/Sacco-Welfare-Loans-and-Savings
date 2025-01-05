import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";

const Savings = () => {
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await fetch("/src/data/savings.json");
        const data = await response.json();
        setSavings(data.savings);
      } catch (error) {
        console.error("Error fetching savings data:", error);
      }
    };

    fetchSavings();
  }, []);

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 ">
          Savings Accounts
        </h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2">
            <ArrowTrendingUpIcon className="h-5 w-5" />
            <span>Record Deposit</span>
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 e rounded-lg flex items-center space-x-2">
            <ArrowTrendingDownIcon className="h-5 w-5" />
            <span>Record Withdrawal</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200 "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 ">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900  mt-1">
                  {stat.value}
                </p>
                <div
                  className={`flex items-center mt-2 ${
                    stat.trendUp ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <span className="text-sm">{stat.trend}</span>
                </div>
              </div>
              <div
                className={`h-12 w-12 ${stat.bgColor} rounded-full flex items-center justify-center`}
              >
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Savings Table */}
      <DataTable
        columns={savingsColumns}
        data={savings}
        filters={savingsFilters}
        searchPlaceholder="Search by member name or savings ID..."
      />
    </div>
  );
};

export default Savings;
