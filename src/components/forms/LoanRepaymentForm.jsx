import React, { useState, useEffect } from "react";
import { loanService, memberService } from "../../services/api";
import {
  PlusIcon,
  XMarkIcon,
  UserIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import NotificationModal from "../common/NotificationModal";
import formatDate from "../../utils/dateFormatter";

const LoanRepaymentButton = ({ onRepaymentAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onRepaymentAdded) {
      onRepaymentAdded();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <CurrencyDollarIcon className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
        <span className="font-semibold text-[0.9rem]">
          Record Loan Repayment
        </span>
      </button>

      {isOpen && (
        <RepaymentModal
          onClose={handleClose}
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

const RepaymentModal = ({
  onClose,
  setNotificationConfig,
  setNotificationModalOpen,
}) => {
  const [mode, setMode] = useState("individual");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberLoans, setMemberLoans] = useState([]);
  const [formData, setFormData] = useState({
    memberId: "",
    loanId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [groupData, setGroupData] = useState({
    date: new Date().toISOString().split("T")[0],
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear().toString(),
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

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

  useEffect(() => {
    const fetchMemberLoans = async () => {
      if (selectedMember) {
        try {
          const loans = await loanService.getMemberLoans(selectedMember.id);
          setMemberLoans(loans.filter((loan) => loan.status === "Active"));
        } catch (error) {
          console.error("Failed to fetch member loans:", error);
        }
      }
    };
    fetchMemberLoans();
  }, [selectedMember]);

  const selectMember = async (member) => {
    setSelectedMember(member);
    setFormData({
      ...formData,
      memberId: member.id,
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

  const calculateRepaymentBreakdown = (amount, loan) => {
    const monthlyInterest = (loan.amount * loan.interestRate) / (12 * 100);
    const monthlyPrincipal = Math.min(
      parseFloat(amount) - monthlyInterest,
      loan.remainingBalance
    );
    return {
      principalPaid: monthlyPrincipal,
      interestPaid: monthlyInterest,
    };
  };

  const calculatePaymentDetails = (loan) => {
    const amount = parseFloat(loan.amount);
    const interestRate = parseFloat(loan.interestRate);
    const loanTerm = parseInt(loan.loanTerm);
    const monthlyInterest = interestRate / 100 / 12;

    const monthlyPayment =
      (amount * monthlyInterest * Math.pow(1 + monthlyInterest, loanTerm)) /
      (Math.pow(1 + monthlyInterest, loanTerm) - 1);

    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - amount;

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      remainingPayments: Math.ceil(loan.remainingBalance / monthlyPayment),
    };
  };

  useEffect(() => {
    if (formData.loanId) {
      const selectedLoan = memberLoans.find(
        (loan) => loan.id === formData.loanId
      );
      if (selectedLoan) {
        const details = calculatePaymentDetails(selectedLoan);
        setPaymentDetails(details);
      }
    }
  }, [formData.loanId]);

  const validateForm = () => {
    const newErrors = {};

    if (mode === "individual") {
      if (!formData.memberId) newErrors.memberId = "Please select a member";
      if (!formData.loanId) newErrors.loanId = "Please select a loan";

      const selectedLoan = memberLoans.find(
        (loan) => loan.id === formData.loanId
      );
      const amount = parseFloat(formData.amount);

      if (!amount || amount <= 0) {
        newErrors.amount = "Please enter a valid amount";
      } else if (
        selectedLoan &&
        amount > parseFloat(selectedLoan.remainingBalance)
      ) {
        newErrors.amount = `Amount cannot exceed the remaining balance of $ ${selectedLoan.remainingBalance}`;
      }
    } else {
      if (!groupData.date) newErrors.date = "Please select a date";
      if (!groupData.month) newErrors.month = "Please select a month";
      if (!groupData.year) newErrors.year = "Please select a year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getMaxAmount = () => {
    if (!formData.loanId) return 0;
    const selectedLoan = memberLoans.find(
      (loan) => loan.id === formData.loanId
    );
    return selectedLoan ? parseFloat(selectedLoan.remainingBalance) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (mode === "individual") {
        const selectedLoan = memberLoans.find(
          (loan) => loan.id === formData.loanId
        );
        const { principalPaid, interestPaid } = calculateRepaymentBreakdown(
          formData.amount,
          selectedLoan
        );

        await loanService.recordRepayment({
          loanId: formData.loanId,
          amount: formData.amount,
          principalPaid,
          interestPaid,
          date: formData.date,
          notes: formData.notes,
        });

        setNotificationConfig({
          type: "success",
          title: "Repayment Recorded",
          message: "The loan repayment has been successfully recorded.",
        });
      } else {
        await loanService.recordGroupRepayment(groupData);
        setNotificationConfig({
          type: "success",
          title: "Group Repayment Recorded",
          message:
            "Monthly deductions have been successfully processed for all active loans.",
        });
      }
      setNotificationModalOpen(true);
      onClose();
    } catch (error) {
      setNotificationConfig({
        type: "error",
        title: "Repayment Failed",
        message: error.response?.data?.error || "Failed to record repayment",
      });
      setNotificationModalOpen(true);
      setErrors({
        submit: error.response?.data?.error || "Failed to record repayment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div className="flex min-h-screen items-center justify-center p-4 ">
          <div className="relative w-full px-6 max-w-4xl bg-white rounded-xl shadow-2xl transform transition-all">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-red-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-red-500" />
            </button>

            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-extrabold text-primary-600 text-center">
                Record Loan Repayment
              </h1>
              <p className="mt-1 text-gray-500 font-semibold text-center">
                Select repayment type below
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
                  Individual Repayment
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
                  Group Monthly Deduction
                </button>
              </div>

              <div className="space-y-6">
                {mode === "individual" ? (
                  <>
                    {/* Member Selection */}
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
                          className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                            errors.memberId
                              ? "border-2 border-red-500"
                              : "border-gray-300"
                          } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                          placeholder="Search member by name"
                        />
                      </div>
                      {showSuggestions && filteredMembers.length > 0 && (
                        <div className="absolute z-10 w-[90%] mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                          {filteredMembers.map((member) => (
                            <div
                              key={member.id}
                              onClick={() => selectMember(member)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <div className="font-bold text-primary-600">
                                {member.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {member.id}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center space-x-8">
                      {/* Loan Selection */}
                      {selectedMember && (
                        <div className="w-[60%]">
                          <label className="block text-sm font-bold text-gray-600">
                            Select Loan
                          </label>
                          <select
                            name="loanId"
                            value={formData.loanId}
                            onChange={handleInputChange}
                            className={`mt-1 w-full font-semibold text-gray-600 rounded-lg border ${
                              errors.loanId
                                ? "border-2 border-red-500"
                                : "border-gray-300"
                            } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11 px-4`}
                          >
                            <option value="">Select a loan</option>
                            {memberLoans.map((loan) => (
                              <option
                                key={loan.id}
                                value={loan.id}
                                className="font-semibold text-[15px"
                              >
                                Loan #{loan.id} - Balance: $
                                {loan.remainingBalance}
                              </option>
                            ))}
                          </select>
                          {formData.loanId && (
                            <p className="mt-1 text-sm text-gray-500">
                              Due Date:{" "}
                              {formatDate(
                                memberLoans.find(
                                  (loan) => loan.id === formData.loanId
                                ).dueDate
                              )}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Amount */}
                      {selectedMember && (
                        <div className="w-[40%]">
                          <label className="block text-sm font-bold text-gray-600">
                            Repayment Amount
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
                              max={getMaxAmount()}
                              className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                                errors.amount
                                  ? "border-2 border-red-500"
                                  : "border-gray-300"
                              } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                              placeholder="Enter repayment amount"
                            />
                          </div>
                          {errors.amount && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.amount}
                            </p>
                          )}
                          {formData.loanId && (
                            <p className="mt-1 text-sm text-gray-500">
                              Maximum payment allowed: $ {getMaxAmount()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-bold text-gray-600">
                        Repayment Date
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

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-bold text-gray-600">
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 w-full font-semibold text-gray-600 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent p-4"
                        placeholder="Add any additional notes"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-amber-100 rounded-lg p-4">
                      <div className="flex">
                        <InformationCircleIcon className="w-8 text-red-500 mr-2 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-bold font-nunito-sans text-amber-800">
                            Monthly Deduction Notice
                          </h3>
                          <p className="mt-1 text-sm text-amber-700">
                            This will process the monthly loan repayment for all
                            active loans. Each member's loan balance will be
                            updated automatically based on their loan terms and
                            interest rates.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-600">
                          Deduction Date
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
                          {[
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                          ].map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
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
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-600">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={groupData.notes}
                        onChange={(e) => handleInputChange(e, "group")}
                        rows={3}
                        className="mt-1 w-full font-semibold text-gray-600 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent p-4"
                        placeholder="Add any additional notes about this monthly deduction"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {paymentDetails && (
              <div className="px-8 pb-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-sm text-red-600 mb-2">
                  Payment Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-bold font-nunito-sans ml-2">
                      ${paymentDetails.monthlyPayment}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Payment:</span>
                    <span className="font-bold font-nunito-sans ml-2">
                      ${paymentDetails.totalPayment}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-bold font-nunito-sans ml-2">
                      ${paymentDetails.totalInterest}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining Payments:</span>
                    <span className="font-bold font-nunito-sans ml-2">
                      {paymentDetails.remainingPayments}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold transition-colors flex items-center gap-2"
              >
                {isSubmitting ? "Processing..." : "Save Repayment"}
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
    </>
  );
};

export default LoanRepaymentButton;
