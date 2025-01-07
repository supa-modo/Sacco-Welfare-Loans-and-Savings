import React, { useState } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import loanRepaymentsData from '../../data/loanRepayments.json';

const LoanRepaymentModal = ({ open, onClose, loanId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const loanData = loanRepaymentsData.loanRepayments[loanId];
  
  if (!loanData || !open) return null;

  const { loanDetails, repayments } = loanData;
  const progressPercentage = ((loanDetails.totalAmount - loanDetails.remainingBalance) / loanDetails.totalAmount) * 100;

  const handleDownload = () => {
    const data = {
      loanDetails,
      repayments,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `loan-repayments-${loanId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  // Pagination
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = repayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(repayments.length / rowsPerPage);

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${open ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Loan Repayment History</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Loan Details */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">Loan Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><span className="font-semibold">Loan ID:</span> {loanDetails.loanId}</div>
                <div><span className="font-semibold">Member Name:</span> {loanDetails.memberName}</div>
                <div><span className="font-semibold">Principal Amount:</span> KES {loanDetails.principalAmount.toLocaleString()}</div>
                <div><span className="font-semibold">Interest Rate:</span> {loanDetails.interestRate}%</div>
                <div><span className="font-semibold">Total Amount:</span> KES {loanDetails.totalAmount.toLocaleString()}</div>
                <div><span className="font-semibold">Purpose:</span> {loanDetails.purpose}</div>
                <div><span className="font-semibold">Issue Date:</span> {new Date(loanDetails.dateIssued).toLocaleDateString()}</div>
                <div><span className="font-semibold">Due Date:</span> {new Date(loanDetails.dueDate).toLocaleDateString()}</div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Repayment Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Remaining Balance: KES {loanDetails.remainingBalance.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Repayment History */}
            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-lg font-medium">Repayment History</h4>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download History
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repayment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance After</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((repayment) => (
                    <tr key={repayment.repaymentId}>
                      <td className="px-6 py-4 whitespace-nowrap">{repayment.repaymentId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(repayment.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">KES {repayment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">KES {repayment.principalPaid.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">KES {repayment.interestPaid.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">KES {repayment.balanceAfter.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          repayment.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {repayment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, repayments.length)}
                    </span>{' '}
                    of <span className="font-medium">{repayments.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRepaymentModal;
