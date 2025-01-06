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
      <div className="flex pt-4 justify-between items-center">
        <h1 className="text-3xl font-extrabold text-amber-700 ">
          Financial System Reports
        </h1>
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
              className={`h-10 w-10 ${
                selectedReport === report.id ? "text-primary" : "text-gray-600"
              }`}
            />
            <h3
              className={`mt-2 text-lg font-medium ${
                selectedReport === report.id
                  ? "text-primary "
                  : "text-amber-600 "
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
          <h2 className="text-lg font-semibold text-amber-700">
            Report Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold font-nunito-sans text-primary-700 mb-2">
                Date Range
              </label>
              <select className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 font-semibold font-nunito-sans shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Custom range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold font-nunito-sans text-primary-700 mb-2">
                Group By
              </label>
              <select className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 font-semibold font-nunito-sans shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold font-nunito-sans text-primary-700 mb-2">
                Format
              </label>
              <select className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 font-semibold font-nunito-sans shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold font-nunito-sans text-primary-700 mb-2">
                Date Range
              </label>
              <select className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 font-semibold font-nunito-sans shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Custom range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold font-nunito-sans text-primary-700 mb-2">
                Group By
              </label>
              <select className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 font-semibold font-nunito-sans shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold font-nunito-sans text-primary-700 mb-2">
                Format
              </label>
              <select className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 font-semibold font-nunito-sans shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200 ">
            <button className="px-10 py-2 bg-gray-200  text-gray-600 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200">
              Reset
            </button>
            <button className="px-10 font-semibold py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2 transition-colors duration-200">
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white  p-6 rounded-lg border border-gray-200 ">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-amber-700">
            Report Preview
          </h2>
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
