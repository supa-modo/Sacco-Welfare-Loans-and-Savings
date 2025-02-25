import React, { useState, useEffect } from "react";
import { memberService, savingsService } from "../../services/api";
import {
  PlusIcon,
  XMarkIcon,
  UserIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import members from "../../data/members.json";
import NotificationModal from "../common/NotificationModal";
import { useAuth } from "../../context/AuthContext";

const AddSavingsButton = ({ onSavingsAdded }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const handleClick = () => {
    if (user?.role !== "admin") {
      setNotificationConfig({
        type: "error",
        title: "Access Restricted",
        message:
          "Only administrators can record savings deposits. Please contact your administrator for assistance.",
      });
      setNotificationModalOpen(true);
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`group flex items-center gap-2 px-6 py-3 ${
          user?.role === "admin"
            ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            : "bg-gray-300 cursor-not-allowed"
        } text-white rounded-lg shadow-lg transition-all duration-300`}
        // disabled={user?.role !== "admin"}
      >
        <PlusIcon
          className={`w-5 h-5 transition-transform ${
            user?.role === "admin" ? "group-hover:rotate-90" : ""
          } duration-300`}
        />
        <span className="font-semibold text-[0.9rem]">
          Record New Savings Deposit
        </span>
      </button>

      {isOpen && (
        <SavingsModal
          onClose={() => setIsOpen(false)}
          setNotificationConfig={setNotificationConfig}
          setNotificationModalOpen={setNotificationModalOpen}
        />
      )}

      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        title={notificationConfig.title}
        message={notificationConfig.message}
        type={notificationConfig.type}
      />
    </>
  );
};

const SavingsModal = ({
  onClose,
  setNotificationConfig,
  setNotificationModalOpen,
}) => {
  const [mode, setMode] = useState("individual"); // individual or group
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    type: "Monthly Contribution",
  });
  const [groupData, setGroupData] = useState({
    date: new Date().toISOString().split("T")[0],
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear().toString(),
    amount: "",
    type: "Monthly Contribution",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (searchTerm) {
        try {
          const members = await memberService.getAllMembers();
          const filtered = members.filter(
            (member) =>
              member.status === "Active" &&
              member.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredMembers(filtered);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Failed to fetch members:", error);
        }
      } else {
        setFilteredMembers([]);
        setShowSuggestions(false);
      }
    };
    fetchMembers();
  }, [searchTerm]);

  const selectMember = (member) => {
    setFormData({
      ...formData,
      memberId: member.id,
      memberName: member.name,
    });
    setSearchTerm(member.name);
    setShowSuggestions(false);
  };

  const handleInputChange = (e, type = "individual") => {
    const { name, value } = e.target;
    if (type === "individual") {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
    } else {
      setGroupData({ ...groupData, [name]: value });
      if (errors[`group_${name}`]) {
        setErrors({ ...errors, [`group_${name}`]: null });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "individual") {
      if (!formData.memberId) newErrors.memberId = "Please select a member";
      if (!formData.amount || formData.amount <= 0) {
        newErrors.amount = "Please enter a valid amount";
      }
    } else {
      if (!groupData.month) newErrors.month = "Please select a month";
      if (!groupData.year) newErrors.year = "Please select a year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (mode === "individual") {
        await savingsService.recordIndividualSavings({
          memberId: formData.memberId,
          amount: formData.amount,
          type: formData.type,
          date: formData.date,
          notes: formData.notes,
        });
        setNotificationConfig({
          type: "success",
          title: "Savings Recorded",
          message:
            "Individual savings transaction has been successfully recorded.",
        });
      } else {
        const payload = {
          date: groupData.date,
          month: groupData.month,
          year: groupData.year,
          type: groupData.type,
          notes:
            groupData.notes ||
            `Monthly Contribution for ${groupData.month} ${groupData.year}`,
        };

        // Only add amount if it's provided
        if (groupData.amount) {
          payload.amount = parseFloat(groupData.amount);
        }

        await savingsService.recordGroupSavings(payload);
        setNotificationConfig({
          type: "success",
          title: "Group Savings Recorded",
          message:
            "Monthly group contribution has been successfully recorded for all members.",
        });
      }
      setNotificationModalOpen(true);
      onClose();
    } catch (error) {
      console.error("Savings Error:", error);
      setNotificationConfig({
        type: "error",
        title: "Transaction Failed",
        message:
          error.response?.data?.error ||
          "Failed to record savings transaction.",
      });
      setNotificationModalOpen(true);
      setErrors({
        submit: error.response?.data?.error || "Failed to record savings",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl transform transition-all">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-red-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-red-500" />
          </button>

          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-extrabold text-primary-600 text-center">
              Record New Savings
            </h1>
            <p className="mt-1 text-gray-500 font-semibold text-center">
              Select transaction type below
            </p>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setMode("individual")}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${
                  mode === "individual"
                    ? "bg-primary-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <UserIcon className="w-5 h-5" />
                Individual Savings
              </button>
              <button
                onClick={() => setMode("group")}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${
                  mode === "group"
                    ? "bg-primary-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <UserGroupIcon className="w-5 h-5" />
                Group Monthly Contribution
              </button>
            </div>

            {mode === "individual" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600">
                    Select Member
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-14 w-full font-semibold text-primary-600 rounded-lg border ${
                        errors.memberId
                          ? "border-2 border-red-500"
                          : "border-gray-300"
                      } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                      placeholder="Search member by name"
                    />
                  </div>
                  {showSuggestions && filteredMembers.length > 0 && (
                    <div className="absolute z-10 w-[94%] mt-1 font-nunito-sans text-primary-600 bg-white rounded-lg shadow-lg border border-gray-200">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => selectMember(member)}
                          className="px-10 py-2 hover:bg-gray-200 cursor-pointer"
                        >
                          <div className="font-bold">{member.name}</div>
                          <div className="text-sm font-semibold text-gray-500">
                            ID: {member.id}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.memberId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.memberId}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600">
                      Amount
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                          errors.amount
                            ? "border-2 border-red-500"
                            : "border-gray-300"
                        } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                        placeholder="Enter amount"
                      />
                    </div>
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600">
                      Transaction Type
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full font-semibold text-gray-600 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11 px-4"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Check">Check</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600">
                    Transaction Date
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="pl-12 w-full font-semibold text-gray-600 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600">
                    Additional Notes
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full font-semibold text-gray-600 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent p-4"
                      placeholder="Add any additional notes for the transaction"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-amber-100 rounded-lg p-4">
                  <div className="flex">
                    <InformationCircleIcon className="w-8 text-red-500 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold font-nunito-sans text-amber-800">
                        Monthly Contribution Notice
                      </h3>
                      <p className="mt-1 text-sm text-amber-700">
                        This will record the monthly contribution for all active
                        members. Each member's savings balance will be updated
                        automatically.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600">
                      Contribution Amount
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        // disabled
                        type="number"
                        name="amount"
                        value={groupData.amount}
                        onChange={(e) => handleInputChange(e, "group")}
                        className={`pl-12 w-full font-semibold text-gray-400 hover:cursor-not-allowed rounded-lg border ${
                          errors.groupAmount
                            ? "border-2 border-red-500"
                            : "border-gray-300"
                        } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                        placeholder="Enter amount per member"
                      />
                    </div>
                    {errors.groupAmount && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.groupAmount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600">
                      Contribution Date
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={groupData.date}
                        onChange={(e) => handleInputChange(e, "group")}
                        className="pl-12 w-full font-semibold text-gray-600 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600">
                      Month
                    </label>
                    <select
                      name="month"
                      value={groupData.month}
                      onChange={(e) => handleInputChange(e, "group")}
                      className="mt-1 w-full font-semibold text-gray-600 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11 px-4"
                    >
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                    {errors.month && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.month}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600">
                      Year
                    </label>
                    <select
                      name="year"
                      value={groupData.year}
                      onChange={(e) => handleInputChange(e, "group")}
                      className="mt-1 w-full font-semibold text-gray-600 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11 px-4"
                    >
                      {Array.from(
                        { length: 5 },
                        (_, i) => new Date().getFullYear() - 2 + i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.year && (
                      <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600">
                    Notes
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <textarea
                      name="notes"
                      value={groupData.notes}
                      onChange={(e) => handleInputChange(e, "group")}
                      rows={3}
                      className="w-full font-semibold text-gray-600 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent p-4"
                      placeholder="Add any additional notes about this monthly contribution"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold transition-colors flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Save Transaction"}
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {errors.submit && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSavingsButton;
