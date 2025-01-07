import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import savingsData from "../../data/savings.json";
import AddSavingsButton from "../../components/forms/SavingsDepositForm";
import SavingsHistoryModal from "../../components/modals/SavingsHistoryModal";

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    setSavings(savingsData.savings || []);
  }, []);

  const stats = [
    {
      title: "Total Savings",
      value: "$ 2,500,000",
      icon: BanknotesIcon,
      trend: "+8.3%",
      trendUp: true,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Monthly Contributions",
      value: "$ 150,000",
      icon: ArrowTrendingUpIcon,
      trend: "+5.2%",
      trendUp: true,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Withdrawals",
      value: "$ 50,000",
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

  const savingsFilters = [
    {
      key: "type",
      label: "Filter by Type",
      options: [
        { value: "All", label: "All Savings" },
        { value: "Monthly Contribution", label: "Monthly Contribution" },
        { value: "Additional Savings", label: "Additional Savings" },
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
      <div className="flex pt-4 justify-between items-center">
        <h1 className="text-3xl font-extrabold text-amber-700">
          Member Savings Accounts
        </h1>
        <AddSavingsButton />
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
            { header: "Member Name", accessor: "memberName" },
            { header: "Amount", accessor: "amount", render: (item) => `KES ${item.amount.toLocaleString()}` },
            { header: "Date", accessor: "date", render: (item) => new Date(item.date).toLocaleDateString() },
            { header: "Type", accessor: "type" },
            { header: "Status", accessor: "status" }
          ]}
          onRowClick={(row) => {
            setSelectedMemberId(row.memberId);
            setIsHistoryModalOpen(true);
          }}
          filters={savingsFilters}
          searchPlaceholder="Search by member name or transaction ID..."
          onDelete={(item) => {
            // Handle delete
            console.log('Delete savings:', item.id);
          }}
        />

        <SavingsHistoryModal
          open={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          memberId={selectedMemberId}
        />
      </div>
    </div>
  );
};

export default Savings;
