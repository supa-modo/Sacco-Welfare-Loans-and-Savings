import { useState } from "react";
import {
  DocumentChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("savings");

  const reportTypes = [
    {
      id: "savings",
      name: "Savings Report",
      description: "View detailed savings transactions and balances",
      icon: DocumentChartBarIcon,
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
      icon: DocumentChartBarIcon,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 ">Reports</h1>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`p-6 rounded-lg border transition-colors duration-200 ${
              selectedReport === report.id
                ? "border-primary bg-primary/5 "
                : "border-gray-200  bg-white 0"
            } hover:border-primary`}
          >
            <report.icon
              className={`h-8 w-8 ${
                selectedReport === report.id ? "text-primary" : "text-gray-400"
              }`}
            />
            <h3
              className={`mt-4 text-lg font-medium ${
                selectedReport === report.id
                  ? "text-primary "
                  : "text-gray-900 "
              }`}
            >
              {report.name}
            </h3>
            <p className="mt-2 text-sm text-gray-500 ">{report.description}</p>
          </button>
        ))}
      </div>

      {/* Report Configuration */}
      <div className="bg-white  p-6 rounded-lg border border-gray-200 ">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900 ">
            Report Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-200    focus:ring-2 focus:ring-primary">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Custom range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group By
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-200    focus:ring-2 focus:ring-primary">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-200    focus:ring-2 focus:ring-primary">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200 ">
            <button className="px-4 py-2 bg-gray-100  text-gray-700  rounded-lg hover:bg-gray-200 transition-colors duration-200">
              Reset
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2 transition-colors duration-200">
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white  p-6 rounded-lg border border-gray-200 ">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 ">Report Preview</h2>
          <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200">
            View Full Screen
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
