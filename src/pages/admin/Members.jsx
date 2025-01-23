import { useState, useEffect } from "react";
import {
  UsersIcon,
  UserPlusIcon,
  UserMinusIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../../components/common/DataTable";
import AddMemberButton from "../../components/forms/NewMemberForm";
import MemberDetailsModal from "../../components/modals/MemberDetailsModal";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch members data from the backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/members");
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Stats (you can update these dynamically based on fetched data)
  const stats = [
    {
      title: "Total Members",
      value: members.length,
      icon: UsersIcon,
      trend: "+5.2%",
      trendUp: true,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Active Members",
      value: members.filter((member) => member.status === "Active").length,
      icon: UserPlusIcon,
      trend: "+3.1%",
      trendUp: true,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Inactive Members",
      value: members.filter((member) => member.status === "Inactive").length,
      icon: UserMinusIcon,
      trend: "-0.8%",
      trendUp: false,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Average Savings",
      value: `$ ${(
        members.reduce(
          (sum, member) => sum + parseFloat(member.savingsBalance),
          0
        ) / members.length
      ).toFixed(2)}`,
      icon: BanknotesIcon,
      trend: "+8.3%",
      trendUp: true,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  // Define columns for the DataTable
  const memberColumns = [
    { key: "id", header: "Member ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "joinDate",
      header: "Join Date",
      render: (item) => new Date(item.joinDate).toLocaleDateString(),
    },
    {
      key: "savingsBalance",
      header: "Total Savings",
      render: (item) => `$ ${parseFloat(item.savingsBalance).toLocaleString()}`,
    },
    {
      key: "loansBalance",
      header: "Loan Balance",
      render: (item) => `$ ${parseFloat(item.loansBalance).toLocaleString()}`,
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

  // Filters for the DataTable
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          columns={memberColumns}
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
