import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const Savings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [savings, setSavings] = useState([]);

  const stats = [
    {
      title: "Total Savings",
      value: "₹ 15.2M",
      icon: BanknotesIcon,
      trend: "+8.1%",
      trendUp: true,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Monthly Deposits",
      value: "₹ 2.5M",
      icon: ArrowTrendingUpIcon,
      trend: "+12.3%",
      trendUp: true,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Monthly Withdrawals",
      value: "₹ 1.2M",
      icon: ArrowTrendingDownIcon,
      trend: "-5.4%",
      trendUp: false,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Average Monthly Savings",
      value: "₹ 25,000",
      icon: CalendarDaysIcon,
      trend: "+3.2%",
      trendUp: true,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

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

  const filteredSavings = savings.filter(
    (saving) =>
      saving.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saving.memberId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="bg-white p-4 rounded-lg border border-gray-200 ">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by member name or ID..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300  bg-white text-gray-900  focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                  Member ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {filteredSavings.map((saving) => (
                <tr key={saving.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                    {saving.memberId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                    {saving.memberName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                    ₹ {saving.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                    {saving.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                    {saving.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        saving.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {saving.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Savings;
