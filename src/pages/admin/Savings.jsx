import { useState, useEffect } from "react";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Define stats here to fix the error
  const stats = [
    {
      title: "Total Savings",
      value: "₹2,45,000",
      trend: "+12.5% from last month",
      trendUp: true,
      icon: BanknotesIcon,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Monthly Deposits",
      value: "₹35,000",
      trend: "+8.2% from last month",
      trendUp: true,
      icon: ArrowTrendingUpIcon,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Withdrawals",
      value: "₹12,000",
      trend: "-2.4% from last month",
      trendUp: false,
      icon: ArrowTrendingDownIcon,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Active Members",
      value: "245",
      trend: "+15 this month",
      trendUp: true,
      icon: CalendarDaysIcon,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
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

  const FilterDropdown = ({ filter, onSelect }) => (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {filter.label}
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </button>

      {isFilterOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {filter.options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(filter.key, option.value);
                  setIsFilterOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const filteredSavings = savings.filter((item) => {
    const matchesFilters = Object.entries(activeFilters).every(
      ([key, value]) => !value || item[key] === value
    );
    const matchesSearch =
      searchQuery.toLowerCase() === "" ||
      item.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilters && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Savings Accounts</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
            <ArrowTrendingUpIcon className="h-5 w-5" />
            <span>Record Deposit</span>
          </button>
          <button className="px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md">
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
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <div
                  className={`flex items-center mt-2 ${
                    stat.trendUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trendUp ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{stat.trend}</span>
                </div>
              </div>
              <div
                className={`h-14 w-14 ${stat.bgColor} rounded-full flex items-center justify-center`}
              >
                <stat.icon className={`h-7 w-7 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-0">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by member name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3">
            {savingsFilters.map((filter) => (
              <FilterDropdown
                key={filter.key}
                filter={filter}
                onSelect={(key, value) =>
                  setActiveFilters((prev) => ({ ...prev, [key]: value }))
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {savingsColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSavings.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {savingsColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
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
