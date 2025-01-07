import { useState, useEffect } from "react";
import {
  UsersIcon,
  UserPlusIcon,
  UserMinusIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import membersData from "../../data/members.json";
import AddMemberButton from "../../components/forms/NewMemberForm";
import MemberDetailsModal from "../../components/modals/MemberDetailsModal";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    // Load members data
    setMembers(membersData.members);
  }, []);

  const stats = [
    {
      title: "Total Members",
      value: "1,234",
      icon: UsersIcon,
      trend: "+5.2%",
      trendUp: true,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Active Members",
      value: "1,180",
      icon: UserPlusIcon,
      trend: "+3.1%",
      trendUp: true,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Inactive Members",
      value: "54",
      icon: UserMinusIcon,
      trend: "-0.8%",
      trendUp: false,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Average Savings",
      value: "$  25,000",
      icon: BanknotesIcon,
      trend: "+8.3%",
      trendUp: true,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  const memberColumns = [
    { key: "id", header: "Member ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "joinDate", header: "Join Date" },

    {
      key: "savingsBalance",
      header: "Total Savings",
      render: (item) => `$ ${item.savingsBalance}`,
    },
    {
      key: "loansBalance",
      header: "Loan Balance",
      render: (item) => `$ ${item.loansBalance}`,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-lg font-nunito-sans ${
            item.status === "Active"
              ? "bg-primary-300 text-green-800"
              : "bg-red-300 text-red-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  const memberFilters = [
    {
      key: "status",
      options: [
        { label: "All", value: "all" },
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
  ];

  return (
    <div className="space-y-6 px-4">
      <div className="flex pt-4 justify-between items-center">
        <h1 className="text-3xl font-extrabold text-amber-700">
          Staff Welfare Members
        </h1>
        <AddMemberButton />
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
      <div className="pb-8 w-full max-w-9xl mx-auto">
        <DataTable
          data={members}
          columns={[
            { header: "Member ID", accessor: "id" },
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Phone", accessor: "phone" },
            {
              header: "Join Date",
              accessor: "joinDate",
              render: (item) => new Date(item.joinDate).toLocaleDateString(),
            },
            { header: "Status", accessor: "status" },
            {
              header: "Savings Balance",
              accessor: "savingsBalance",
              render: (item) => `$ ${item.savingsBalance.toLocaleString()}`,
            },
            {
              header: "Loans Balance",
              accessor: "loansBalance",
              render: (item) => `$ ${item.loansBalance.toLocaleString()}`,
            },
          ]}
          onRowClick={(member) => {
            setSelectedMember(member);
            setIsDetailsModalOpen(true);
          }}
          filters={memberFilters}
          searchPlaceholder="Search by name, email or ID..."
          onDelete={(item) => {
            // Handle delete
            console.log("Delete member:", item.id);
          }}
        />

        <MemberDetailsModal
          open={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          memberId={selectedMember?.id}
          memberData={selectedMember}
        />
      </div>
    </div>
  );
};

export default Members;
