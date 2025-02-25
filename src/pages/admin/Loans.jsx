import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import LoanApplicationButton from "../../components/forms/LoanApplicationForm";
import FinancialHistoryModal from "../../components/modals/HistoryModal";
import formatDate from "../../utils/dateFormatter";
import LoanRepaymentButton from "../../components/forms/LoanRepaymentForm";
import { loanService } from "../../services/api";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch loans data from the backend
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await loanService.getAllLoans();
      setLoans(data);
    } catch (error) {
      setError(error.message || "Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  // Stats (you can update these dynamically based on fetched data)
  const stats = [
    {
      title: "Active Loans",
      value: loans.filter((loan) => loan.status === "Active").length,
      icon: BanknotesIcon,
      trend: "+12.5%",
      trendUp: true,
      bgColor: "bg-blue-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Pending Approvals",
      value: loans.filter((loan) => loan.status === "Pending").length,
      icon: DocumentTextIcon,
      trend: "-2.3%",
      trendUp: false,
      bgColor: "bg-yellow-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Due Repayments",
      value: `$ ${loans
        .filter((loan) => loan.status === "Active")
        .reduce((sum, loan) => sum + parseFloat(loan.remainingBalance), 0)
        .toLocaleString()}`,
      icon: CalendarDaysIcon,
      trend: "+5.2%",
      trendUp: true,
      bgColor: "bg-green-50",
      iconColor: "text-green-700",
    },
    {
      title: "Overdue Loans",
      value: loans.filter((loan) => loan.status === "Overdue").length,
      icon: ClockIcon,
      trend: "+1.2%",
      trendUp: false,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
  ];

  const loanColumns = [
    { key: "id", header: "Loan ID" },
    {
      key: "member.name",
      header: "Applicant Name",
      render: (item) => item.member.name,
    },
    { key: "amount", header: "Amount", render: (item) => `$ ${item.amount}` },
    {
      key: "remainingBalance",
      header: "Remaining Bal.",
      render: (item) => `$ ${item.remainingBalance}`,
    },
    {
      key: "dateIssued",
      header: "Date Issued",
      render: (item) => `${formatDate(item.dateIssued) || "Not yet Issued"}`,
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (item) => `${formatDate(item.dueDate)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-lg font-nunito-sans ${
            item.status === "Active"
              ? "bg-primary-300 text-green-800"
              : item.status === "Paid"
              ? "bg-blue-100 text-blue-800"
              : item.status === "Pending"
              ? "bg-amber-200 text-yellow-800"
              : "bg-red-400 text-red-800"
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
        { value: "All", label: "All Loans" },
        { value: "Active", label: "Active" },
        { value: "Paid", label: "Paid" },
        { value: "Pending", label: "Pending" },
        { value: "Rejected", label: "Rejected" },
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
    <div className="space-y-8">
      <div className="flex pt-4 justify-between items-center">
        <h1 className="text-3xl font-extrabold text-amber-700">
          Welfare Loan Applications
        </h1>
        <div className="flex gap-6 mr-6">
          <LoanApplicationButton
            onLoanAdded={() => {
              fetchLoans();
            }}
          />
          <LoanRepaymentButton
            onRepaymentAdded={() => {
              fetchLoans();
            }}
          />
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
      <div className="px-4 sm:px-6 lg:px-8 pb-8 w-full max-w-9xl mx-auto">
        <DataTable
          data={loans}
          columns={loanColumns}
          onRowClick={(row) => {
            setSelectedLoan(row);
            setIsRepaymentModalOpen(true);
          }}
          filters={loanFilters}
          searchPlaceholder="Search by member name or loan ID..."
          onDelete={(item) => {
            // Handle delete
            console.log("Delete loan:", item.id);
          }}
        />

        <FinancialHistoryModal
          open={isRepaymentModalOpen}
          onClose={() => setIsRepaymentModalOpen(false)}
          type="loan"
          id={selectedLoan?.id}
          applicantName={selectedLoan?.member?.name}
        />
      </div>
    </div>
  );
};

export default Loans;
