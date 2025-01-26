import { useState, useEffect, useContext } from "react";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import FinancialHistoryModal from "../../components/modals/HistoryModal";
import AddSavingsButton from "../../components/forms/SavingsDepositForm";
import formatDate from "../../utils/dateFormatter";
import { useAuth } from "../../context/AuthContext";

const MemberSavings = () => {
  const { user } = useAuth();
  const [savingsHistory, setSavingsHistory] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavingsData();
  }, [user.memberId]);

  const fetchSavingsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/savings/member/${user.memberId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch savings data");
      }
      const data = await response.json();
      setSavingsHistory(data);
      setTransactions(data.transactions || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate member statistics
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const memberStats = {
    totalSavings: savingsHistory?.currentSavingsBalance || 0,
    monthlyContributions: transactions
      .filter((tx) => {
        const txDate = new Date(tx.transactionDate);
        return (
          tx.transactionType === "Deposit" &&
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
    withdrawals: transactions
      .filter((tx) => tx.transactionType === "Withdrawal")
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0),
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
          My Savings Account
        </h1>
        <AddSavingsButton onSavingsAdded={fetchSavingsData} />
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
          data={transactions}
          columns={[
            { header: "Transaction No", accessor: "transactionNo" },
            {
              header: "Date",
              accessor: "transactionDate",
              render: (item) => formatDate(item.transactionDate),
            },
            {
              header: "Type",
              accessor: "transactionType",
              render: (item) => (
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                    item.transactionType === "Deposit"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.transactionType}
                </span>
              ),
            },
            {
              header: "Amount",
              accessor: "amount",
              render: (item) =>
                `$ ${Math.abs(parseFloat(item.amount)).toLocaleString()}`,
            },
            {
              header: "Balance After",
              accessor: "balanceAfter",
              render: (item) =>
                `$ ${parseFloat(item.balanceAfter).toLocaleString()}`,
            },
            { header: "Notes", accessor: "notes" },
          ]}
          onRowClick={(row) => {
            setSelectedTransaction(row);
            setIsHistoryModalOpen(true);
          }}
          filters={savingsFilters}
          searchPlaceholder="Search by transaction number or type..."
        />

        <FinancialHistoryModal
          open={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          type="savings"
          data={selectedTransaction}
          id={selectedTransaction?.transactionNo}
        />
      </div>
    </div>
  );
};

export default MemberSavings;
