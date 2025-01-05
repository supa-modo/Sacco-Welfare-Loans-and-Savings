import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import savingsData from "../../data/savings.json";

const Savings = () => {
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    setSavings(savingsData.savings || []);
  }, []);

  const stats = [
    {
      title: "Total Savings",
      value: "₹ 2,500,000",
      icon: BanknotesIcon,
      trend: "+8.3%",
      trendUp: true,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Monthly Contributions",
      value: "₹ 150,000",
      icon: ArrowTrendingUpIcon,
      trend: "+5.2%",
      trendUp: true,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Withdrawals",
      value: "₹ 50,000",
      icon: ArrowTrendingDownIcon,
      trend: "-2.3%",
      trendUp: false,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Next Collection",
      value: "5 Days",
      icon: CalendarDaysIcon,
      trend: "",
      trendUp: true,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  const savingsColumns = [
    { key: "id", header: "Transaction ID" },
    { key: "memberName", header: "Member Name" },
    { key: "amount", header: "Amount", render: (item) => `₹ ${item.amount}` },
    { key: "type", header: "Type" },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.status === "Completed"
              ? "bg-green-100 text-green-800"
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
        { value: "Failed", label: "Failed" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Savings</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          Record Transaction
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
                {stat.trend && (
                  <div className={`flex items-center mt-2 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    <span className="text-sm">{stat.trend}</span>
                  </div>
                )}
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
          columns={savingsColumns}
          data={savings}
          filters={savingsFilters}
          searchPlaceholder="Search by member name or transaction ID..."
        />
      </div>
    </div>
  );
};

export default Savings;
