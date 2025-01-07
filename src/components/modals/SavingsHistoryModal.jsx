import React, { useState } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import savingsHistoryData from '../../data/savingsHistory.json';

const SavingsHistoryModal = ({ open, onClose, memberId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const memberData = savingsHistoryData.savingsHistory[memberId];
  
  if (!memberData || !open) return null;

  const { memberDetails, transactions } = memberData;

  const handleDownload = () => {
    const data = {
      memberDetails,
      transactions,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `savings-history-${memberId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  // Pagination
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${open ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Savings History</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Member Details */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">Member Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-semibold">Member ID:</span> {memberDetails.memberId}</div>
                <div><span className="font-semibold">Name:</span> {memberDetails.memberName}</div>
                <div><span className="font-semibold">Current Balance:</span> KES {memberDetails.currentBalance.toLocaleString()}</div>
                <div><span className="font-semibold">Account Status:</span> 
                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    memberDetails.accountStatus === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {memberDetails.accountStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-lg font-medium">Transaction History</h4>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((transaction) => (
                    <tr key={transaction.transactionNo}>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.transactionNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.transactionType === 'Deposit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        KES {Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        KES {transaction.balanceAfter.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.notes}</td>
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
                      {Math.min(indexOfLastItem, transactions.length)}
                    </span>{' '}
                    of <span className="font-medium">{transactions.length}</span> results
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

export default SavingsHistoryModal;
