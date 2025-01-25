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
import loansData from "../../data/loans.json";
import loanRepaymentsData from "../../data/loanRepayments.json";

const MemberLoans = ({ memberId = "M1001" }) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);

  useEffect(async () => {
    // Filter loans for logged-in member
    try {
      // const response = await fetch(`http://localhost:5000/api/loans/${id}`);
      const response = await fetch(`http://localhost:5000/api/loans/member/M1001`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const result = await response.json();
          setLoans(result);
    } catch (error) {
      
    }
    // const memberLoans = loansData.loans.filter(
    //   (loan) => loan.applicantMemberID === memberId
    // );
    // setLoans(memberLoans);
  }, [memberId]);

  // Calculate statistics for the logged-in member
  const memberStats = {
    activeLoans: loans.filter((loan) => loan.status === "Active").length,
    pendingLoans: loans.filter((loan) => loan.status === "Pending").length,
    totalDue: loans
      .filter((loan) => loan.status === "Active")
      .reduce((sum, loan) => sum + loan.remainingBalance, 0),
    overdueLoans: loans.filter((loan) => {
      const dueDate = new Date(loan.dueDate);
      return loan.status === "Active" && dueDate < new Date();
    }).length,
  };

  const stats = [
    {
      title: "Active Loans",
      value: memberStats.activeLoans.toString(),
      icon: BanknotesIcon,
      trend: "",
      bgColor: "bg-blue-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Pending Applications",
      value: memberStats.pendingLoans.toString(),
      icon: DocumentTextIcon,
      trend: "",
      bgColor: "bg-yellow-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Due Amount",
      value: `$ ${memberStats.totalDue.toLocaleString()}`,
      icon: CalendarDaysIcon,
      trend: "",
      bgColor: "bg-green-50",
      iconColor: "text-green-700",
    },
    {
      title: "Overdue Loans",
      value: memberStats.overdueLoans.toString(),
      icon: ClockIcon,
      trend: "",
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
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

  return (
    <div className="space-y-8">
      <div className="flex pt-4 justify-between items-center">
        <h1 className="text-3xl font-extrabold text-amber-700">
          My Loan Applications
        </h1>
        <LoanApplicationButton />
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
      <div className="px-4 sm:px-6 lg:px-8 pb-8 w-full max-w-9xl mx-auto">
        <DataTable
          data={loans}
          columns={[
            { header: "Loan ID", accessor: "id" },
            {
              header: "Amount",
              accessor: "amount",
              render: (item) => `$ ${item.amount.toLocaleString()}`,
            },
            { header: "Purpose", accessor: "purpose" },
            {
              header: "Date Issued",
              accessor: "dateIssued",
              render: (item) => new Date(item.dateIssued).toLocaleDateString(),
            },
            {
              header: "Due Date",
              accessor: "dueDate",
              render: (item) => new Date(item.dueDate).toLocaleDateString(),
            },
            {
              header: "Status",
              accessor: "status",
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
          ]}
          onRowClick={(row) => {
            setSelectedLoanId(row.id);
            setIsRepaymentModalOpen(true);
          }}
          filters={loanFilters}
          searchPlaceholder="Search by loan ID or purpose..."
        />

        <FinancialHistoryModal
          open={isRepaymentModalOpen}
          onClose={() => setIsRepaymentModalOpen(false)}
          type="loan"
          data={loanRepaymentsData?.loanRepayments[selectedLoanId]}
          id={selectedLoanId}
        />
      </div>
    </div>
  );
};

export default MemberLoans;
