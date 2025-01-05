import { useState, useEffect } from 'react';
import { BanknotesIcon, CalendarDaysIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Loans = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loans, setLoans] = useState([]);
  
  const stats = [
    {
      title: 'Active Loans',
      value: '456',
      icon: BanknotesIcon,
      trend: '+12.5%',
      trendUp: true,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      icon: DocumentTextIcon,
      trend: '-2.3%',
      trendUp: false,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-500'
    },
    {
      title: 'Due Repayments',
      value: '₹ 125,000',
      icon: CalendarDaysIcon,
      trend: '+5.2%',
      trendUp: true,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      title: 'Overdue Loans',
      value: '12',
      icon: ClockIcon,
      trend: '+1.2%',
      trendUp: false,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500'
    }
  ];

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch('/src/data/loans.json');
        const data = await response.json();
        setLoans(data.loans);
      } catch (error) {
        console.error('Error fetching loans data:', error);
      }
    };

    fetchLoans();
  }, []);

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || loan.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 ">Loan Applications</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          New Loan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white 800 p-6 rounded-lg border border-gray-200 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 ">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900  mt-1">{stat.value}</p>
                <div className={`flex items-center mt-2 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="text-sm">{stat.trend}</span>
                </div>
              </div>
              <div className={`h-12 w-12 ${stat.bgColor}  rounded-full flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white 800 p-4 rounded-lg border border-gray-200 ">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by member name or loan ID..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300  bg-white 700 text-gray-900  focus:ring-primary focus:border-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300  bg-white 700 text-gray-900  focus:ring-primary focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Member Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Date Issued</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {filteredLoans.map((loan) => (
                <tr key={loan.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{loan.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{loan.memberName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">₹ {loan.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{loan.purpose}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{loan.dateIssued}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{loan.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      loan.status === 'Active' ? 'bg-green-100 text-green-800' :
                      loan.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Loans;