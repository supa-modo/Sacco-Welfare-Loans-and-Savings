import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import AddSavingsButton from "../../components/forms/SavingsDepositForm";
import FinancialHistoryModal from "../../components/modals/HistoryModal";
import { savingsService } from "../../services/api";
import formatDate from "../../utils/dateFormatter";

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSavings = async () => {
    try {
      const data = await savingsService.getAllSavings();
      if (!data) {
        setError("Failed to fetch savings");
      } else {
        setSavings(data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavings();
  }, []);

  // Stats (you can update these dynamically based on fetched data)
  const stats = [
    {
      title: "Total Savings",
      value: `$ ${savings
        .reduce(
          (sum, saving) => sum + parseFloat(saving.currentSavingsBalance),
          0
        )
        .toLocaleString()}`,
      icon: BanknotesIcon,
      trend: "+8.3%",
      trendUp: true,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Active Savings Accounts",
      value: `$ ${savings
        .filter((saving) => saving.type === "Monthly Contribution")
        .reduce((sum, saving) => sum + parseFloat(saving.amount), 0)
        .toLocaleString()}`,
      icon: ArrowTrendingUpIcon,
      trend: "+5.2%",
      trendUp: true,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Average Monthly Savings",
      value: `$ ${savings
        .filter((saving) => saving.type === "Withdrawal")
        .reduce((sum, saving) => sum + parseFloat(saving.amount), 0)
        .toLocaleString()}`,
      icon: ArrowTrendingDownIcon,
      trend: "-2.3%",
      trendUp: false,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Next Savings Collection",
      value: "5 Days",
      icon: CalendarDaysIcon,
      trend: "",
      trendUp: true,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  const savingsFilters = [
    {
      key: "accountStatus",
      label: "Filter by Account Status",
      options: [
        { value: "All", label: "All Savings" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
    // {
    //   key: "status",
    //   label: "Filter by Status",
    //   options: [
    //     { value: "Completed", label: "Completed" },
    //     { value: "Pending", label: "Pending" },
    //     { value: "Failed", label: "Failed" },
    //   ],
    // },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 font-semibold text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold">Error loading data</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex pt-4 justify-between items-center">
        <h1 className="text-3xl font-extrabold text-amber-700">
          Member Savings Accounts
        </h1>
        <div className="flex items-center space-x-10">
          <AddSavingsButton onSavingsAdded={loadSavings} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-amber-50 via-gray-100 to-white p-6 rounded-xl border border-gray-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-semibold font-geist">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold font-nunito-sans text-gray-700 mt-1">
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
                <stat.icon className={`${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DataTable */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <DataTable
          data={savings}
          columns={[
            { header: "Member ID", accessor: "memberId" },
            {
              header: "Member Name",
              accessor: "member.name",
              render: (item) => item.member.name,
            },
            {
              header: "Balance",
              accessor: "currentSavingsBalance",
              render: (item) =>
                `$ ${item.currentSavingsBalance.toLocaleString()}`,
            },
            {
              header: "Monthly",
              accessor: "monthlySavingsAmt",
              render: (item) => `$ ${item.monthlySavingsAmt.toLocaleString()}`,
            },
            {
              header: "Date Joined",
              accessor: "dateJoined",
              render: (item) => `${formatDate(item.updatedAt)}`,
            },
            {
              header: "Account",
              accessor: "accountStatus",
              render: (item) => (
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-lg font-nunito-sans ${
                    item.accountStatus === "Active"
                      ? "bg-primary-300 text-green-800"
                      : item.accountStatus === "Inactive"
                      ? "bg-red-400 text-red-800"
                      : "bg-amber-200 text-yellow-800"
                  }`}
                >
                  {item.accountStatus}
                </span>
              ),
            },
          ]}
          onRowClick={(row) => {
            setSelectedSaving(row);
            setIsHistoryModalOpen(true);
          }}
          filters={savingsFilters}
          searchPlaceholder="Search by member name or transaction ID..."
          onDelete={(item) => {
            // Handle delete
            console.log("Delete savings:", item.id);
          }}
        />

        <FinancialHistoryModal
          open={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          type="savings"
          id={selectedSaving?.memberId}
          applicantName={selectedSaving?.member?.name}
        />
      </div>
    </div>
  );
};

export default Savings;
