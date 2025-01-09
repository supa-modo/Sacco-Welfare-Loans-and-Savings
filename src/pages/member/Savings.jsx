import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import FinancialHistoryModal from "../../components/modals/HistoryModal";
import AddSavingsButton from "../../components/forms/SavingsDepositForm";
import savingsHistoryData from "../../data/savingsHistory.json";

const MemberSavings = ({ memberId = "M1001" }) => {
  const [savingsHistory, setSavingsHistory] = useState([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    // Get member's savings history
    const memberData = savingsHistoryData.savingsHistory[memberId];
    if (memberData?.transactions) {
      setSavingsHistory(memberData.transactions);
    }
  }, [memberId]);

  // Calculate member statistics
  const memberStats = {
    totalSavings:
      savingsHistoryData.savingsHistory[memberId]?.memberDetails
        ?.currentSavingsBalance || 0,
    monthlyContributions: savingsHistory
      .filter(
        (tx) =>
          tx.transactionType === "Deposit" &&
          new Date(tx.transactionDate).getMonth() === new Date().getMonth()
      )
      .reduce((sum, tx) => sum + tx.amount, 0),
    withdrawals: savingsHistory
      .filter((tx) => tx.transactionType === "Withdrawal")
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
    daysToNextCollection: 5, // This would be calculated based on your collection schedule
  };

  const stats = [
    {
      title: "Total Savings",
      value: `$ ${memberStats.totalSavings.toLocaleString()}`,
      icon: BanknotesIcon,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Monthly Contributions",
      value: `$ ${memberStats.monthlyContributions.toLocaleString()}`,
      icon: ArrowTrendingUpIcon,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Total Withdrawals",
      value: `$ ${memberStats.withdrawals.toLocaleString()}`,
      icon: ArrowTrendingDownIcon,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Next Collection",
      value: `${memberStats.daysToNextCollection} Days`,
      icon: CalendarDaysIcon,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  const savingsFilters = [
    {
      key: "transactionType",
      label: "Filter by Type",
      options: [
        { value: "All", label: "All Transactions" },
        { value: "Deposit", label: "Deposits" },
        { value: "Withdrawal", label: "Withdrawals" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex pt-4 justify-between items-center">
        <h1 className="text-3xl font-extrabold text-amber-700">
          My Savings Account
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

      {/* DataTable */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <DataTable
          data={savingsHistory}
          columns={[
            { header: "Transaction No", accessor: "transactionNo" },
            {
              header: "Date",
              accessor: "transactionDate",
              render: (item) =>
                new Date(item.transactionDate).toLocaleDateString(),
            },
            { header: "Type", accessor: "transactionType" },
            {
              header: "Amount",
              accessor: "amount",
              render: (item) => `$ ${Math.abs(item.amount).toLocaleString()}`,
            },
            {
              header: "Balance After",
              accessor: "balanceAfter",
              render: (item) => `$ ${item.balanceAfter.toLocaleString()}`,
            },
            { header: "Notes", accessor: "notes" },
          ]}
        //   onRowClick={(row) => {
        //     setSelectedTransactionId(row.transactionNo);
        //     setIsHistoryModalOpen(true);
        //   }}
          filters={savingsFilters}
          searchPlaceholder="Search by transaction number or type..."
        />

        {/* <FinancialHistoryModal
          open={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          type="savings"
          data={savingsHistory.find(
            (tx) => tx.transactionNo === selectedTransactionId
          )}
          id={selectedTransactionId}
        /> */}
      </div>
    </div>
  );
};

export default MemberSavings;
