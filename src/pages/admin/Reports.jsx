import React, { useState, useEffect } from "react";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { FaRegChartBar } from "react-icons/fa";
import {
  HiOutlinePresentationChartBar,
  HiPresentationChartBar,
} from "react-icons/hi2";
import { MdOutlineDownload, MdOutlineDownloadDone } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import { RiFullscreenExitLine, RiFullscreenFill } from "react-icons/ri";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("savings");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedMember, setSelectedMember] = useState("all");
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState("last7");
  const [groupBy, setGroupBy] = useState("daily");
  const [format, setFormat] = useState("pdf");
  const [reportType, setReportType] = useState("summary");
  const [transactionType, setTransactionType] = useState("all");
  const [loanStatus, setLoanStatus] = useState("all");
  const [memberStatus, setMemberStatus] = useState("all");

  const reportTypes = [
    {
      id: "savings",
      name: "Savings Report",
      description: "View detailed savings transactions and balances",
      icon: HiOutlinePresentationChartBar,
    },
    {
      id: "loans",
      name: "Loans Report",
      description: "Track loan disbursements and repayments",
      icon: DocumentTextIcon,
    },
    {
      id: "members",
      name: "Members Report",
      description: "Analyze member statistics and activities",
      icon: UserGroupIcon,
    },
  ];

  const generateMockData = () => {
    if (selectedReport === "savings") {
      return [
        { month: "Jan", deposits: 45000, withdrawals: 15000 },
        { month: "Feb", deposits: 52000, withdrawals: 18000 },
        { month: "Mar", deposits: 48000, withdrawals: 12000 },
      ];
    } else if (selectedReport === "loans") {
      return [
        { status: "Active", value: 65 },
        { status: "Paid", value: 25 },
        { status: "Defaulted", value: 10 },
      ];
    } else {
      return [
        { month: "Jan", active: 120, inactive: 8 },
        { month: "Feb", active: 135, inactive: 10 },
        { month: "Mar", active: 150, inactive: 12 },
      ];
    }
  };

  const renderFilters = () => {
    const commonFilters = (
      <>
        <div>
          <label className="block text-[0.93rem] font-nunito-sans font-extrabold text-primary-600 mb-2">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="custom">Custom range</option>
          </select>
        </div>

        <div>
          <label className="block text-[0.93rem] font-nunito-sans font-extrabold text-primary-600 mb-2">
            Group By
          </label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </>
    );

    if (selectedReport === "savings") {
      return (
        <>
          {commonFilters}
          <div>
            <label className="block text-[0.93rem] font-nunito-sans font-extrabold text-primary-600 mb-2">
              Transaction Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Transactions</option>
              <option value="deposits">Deposits Only</option>
              <option value="withdrawals">Withdrawals Only</option>
            </select>
          </div>
          <div>
            <label className="block text-[0.93rem] font-nunito-sans font-extrabold text-primary-600 mb-2">
              Member Selection
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Members</option>
              <option value="individual">Select Individual</option>
            </select>
          </div>
        </>
      );
    } else if (selectedReport === "loans") {
      return (
        <>
          {commonFilters}
          <div>
            <label className="block text-[0.93rem] font-nunito-sans font-extrabold text-primary-600 mb-2">
              Loan Status
            </label>
            <select
              value={loanStatus}
              onChange={(e) => setLoanStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Loans</option>
              <option value="active">Active Loans</option>
              <option value="paid">Paid Loans</option>
              <option value="defaulted">Defaulted Loans</option>
            </select>
          </div>
          <div>
            <label className="block text-[0.93rem] font-nunito-sans font-extrabold text-primary-600 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="repayment">Repayment Schedule</option>
            </select>
          </div>
        </>
      );
    } else {
      return (
        <>
          {commonFilters}
          <div>
            <label className="block text-[0.93rem] font-nunito-sans font-extrabold text-primary-600 mb-2">
              Member Status
            </label>
            <select
              value={memberStatus}
              onChange={(e) => setMemberStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Members</option>
              <option value="active">Active Members</option>
              <option value="inactive">Inactive Members</option>
            </select>
          </div>
          <div>
            <label className="block text-[0.93rem] font-nunito-sans font-extrabold text-primary-600 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="summary">Summary Statistics</option>
              <option value="detailed">Detailed Member List</option>
              <option value="activity">Activity Report</option>
            </select>
          </div>
        </>
      );
    }
  };

  return (
    <div className="space-y-6 px-8">
      <div className="flex pt-4 justify-between items-center">
        <h1 className="text-3xl font-extrabold text-amber-700">
          Financial System Reports
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => {
              setSelectedReport(report.id);
              setShowPreview(false);
            }}
            className={`p-8 shadow-md flex items-center space-x-4 rounded-xl border transition-colors duration-200 ${
              selectedReport === report.id
                ? "border-primary bg-gradient-to-br from-gray-100 to-primary/20"
                : "border-gray-200 bg-gradient-to-br from-amber-50 via-gray-100 to-white"
            } hover:border-primary`}
          >
            <report.icon
              className={`h-10 w-10 ${
                selectedReport === report.id ? "text-primary" : "text-gray-600"
              }`}
            />

            <div className="pl-6">
              <h3
                className={`mt-2 text-lg font-medium ${
                  selectedReport === report.id
                    ? "text-primary"
                    : "text-gray-600"
                }`}
              >
                {report.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{report.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-amber-700">
            Report Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderFilters()}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setDateRange("last7");
                setGroupBy("daily");
                setFormat("pdf");
                setReportType("summary");
                setTransactionType("all");
                setLoanStatus("all");
                setMemberStatus("all");
                setSelectedMember("all");
                setShowPreview(false);
              }}
              className="px-12 py-2 bg-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="px-12 py-2 bg-primary font-semibold text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2.5"
            >
              <FiLoader className="h-5 w-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white  p-6 rounded-xl border border-gray-200 ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-amber-700">
            Report Preview
          </h2>
          <button className="text-primary border border-primary/40 py-2 px-8 rounded-lg flex items-center space-x-4 hover:text-primary/80 text-sm font-bold font-nunito-sans transition-colors duration-200">
          <RiFullscreenFill size={18}/>
            <span>View Full Screen</span>
          </button>
        </div>

        <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200  rounded-lg">
          <p className="text-gray-500">
            Configure and generate a report to preview it here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
