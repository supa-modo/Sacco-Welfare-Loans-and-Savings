import React, { useState, useEffect } from "react";
import { loanService, memberService } from "../../services/api";
import {
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import NotificationModal from "../common/NotificationModal";

const LoanApplicationButton = ({ onLoanAdded }) => {
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
    if (onLoanAdded) {
      onLoanAdded();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
        <span className="font-semibold text-[0.9rem]">
          New Loan Application
        </span>
      </button>

      {isOpen && (
        <Modal
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

const Modal = ({
  onClose,
  setNotificationConfig,
  setNotificationModalOpen,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    loanAmount: "",
    loanTerm: "12",
    interestRate: "5",
    purpose: "",
    employmentContract: null,
    bankStatements: null,
    idDocument: null,
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
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

  const steps = [
    { number: 1, title: "Loan Details" },
    { number: 2, title: "Documents" },
    { number: 3, title: "Review" },
  ];

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.memberId) {
        newErrors.memberId = "Please select a member";
      }
      if (!formData.loanAmount) {
        newErrors.loanAmount = "Loan amount is required";
      } else if (formData.loanAmount < 200) {
        newErrors.loanAmount = "Minimum loan amount is $ 500";
      } else if (formData.loanAmount > 10000) {
        newErrors.loanAmount = "Maximum loan amount is $ 20,000";
      }

      if (!formData.interestRate) {
        newErrors.interestRate = "Interest rate is required";
      } else if (formData.interestRate < 1) {
        newErrors.interestRate = "Minimum interest rate is 1%";
      } else if (formData.interestRate > 100) {
        newErrors.interestRate = "Maximum interest rate is 100%";
      }

      if (!formData.purpose) {
        newErrors.purpose = "Loan purpose is required";
      }
    }

    if (step === 2) {
      if (!formData.employmentContract) {
        newErrors.employmentContract = "Pay slip is required";
      }
      if (!formData.bankStatements) {
        newErrors.bankStatements = "Bank statements are required";
      }
      if (!formData.idDocument) {
        newErrors.idDocument = "ID document is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep(step + 1);
    }
  };

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(formData.loanAmount) || 0;
    const numberOfPayments = parseInt(formData.loanTerm) || 12;
    const annualInterestRate = parseFloat(formData.interestRate) || 15;
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const monthlyPayment =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    return isNaN(monthlyPayment) ? 0 : monthlyPayment.toFixed(2);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append("memberId", formData.memberId);
      formDataObj.append("amount", formData.loanAmount);
      formDataObj.append("purpose", formData.purpose);
      formDataObj.append("loanTerm", formData.loanTerm);
      formDataObj.append("employmentContract", formData.employmentContract);
      formDataObj.append("bankStatements", formData.bankStatements);
      formDataObj.append("idDocument", formData.idDocument);

      await loanService.createLoan(formDataObj);
      setNotificationConfig({
        type: "success",
        title: "Loan Application Submitted",
        message:
          "The loan application has been successfully submitted for processing.",
      });
      setNotificationModalOpen(true);
      onClose();
    } catch (error) {
      setNotificationConfig({
        type: "error",
        title: "Submission Failed",
        message:
          error.response?.data?.error || "Failed to submit loan application.",
      });
      setNotificationModalOpen(true);
      setErrors({
        submit:
          error.response?.data?.error || "Failed to submit loan application",
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
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl transform transition-all">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-red-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-red-500" />
          </button>

          <div className="p-6 border-b border-gray-200 text-center">
            <h1 className="text-2xl font-extrabold text-primary-600">
              New Loan Application
            </h1>

            <p className="mt-1 text-gray-500 font-semibold font-nunito-sans">
              Complete the form and steps below to apply for a loan
            </p>
          </div>

          <div className="py-8 px-10 font-nunito-sans">
            <div className="mb-8 relative">
              <div className="flex justify-between">
                {steps.map((s, idx) => (
                  <div
                    key={s.number}
                    className="flex flex-col items-center relative z-10 "
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors duration-300 ${
                        step >= s.number
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {s.number}
                    </div>
                    <span className="mt-2 text-sm font-semibold text-gray-600">
                      {s.title}
                    </span>
                  </div>
                ))}
                <div className="absolute top-5 left-0 h-0.5 bg-gray-200 w-full -z-10">
                  <div
                    className="h-full bg-primary-500 transition-all duration-1000"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center space-x-8">
                    {/* Member Selection */}
                    <div className="relative w-[60%]">
                      <label className="block text-sm font-bold text-gray-600">
                        Enter Loan Applicant from Welfare's Members
                      </label>
                      <div className="mt-1 relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`pl-14 w-full font-bold text-primary-600 rounded-lg border ${
                            errors.memberId
                              ? "border-2 border-red-500"
                              : "border-gray-300"
                          } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                          placeholder="Search member by name"
                        />
                      </div>
                      {showSuggestions && filteredMembers.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 font-nunito-sans text-primary-600 bg-white rounded-lg shadow-lg border border-gray-200">
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

                    {/* Loan Interest Rate */}
                    <div className="w-[40%]">
                      <label className="block text-sm font-bold text-gray-600">
                        Interest Rate (% p.a.)
                      </label>
                      <div className="mt-1 relative rounded-lg shadow-sm">
                        <input
                          type="number"
                          name="interestRate"
                          value={formData.interestRate}
                          onChange={handleInputChange}
                          min="1"
                          max="100"
                          step="0.1"
                          className={`pl-4 w-full font-semibold font-sans text-gray-500 rounded-lg border ${
                            errors.interestRate
                              ? "border-2 border-red-500"
                              : "border-gray-300"
                          } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                          placeholder="Enter interest rate"
                        />
                      </div>
                      {errors.interestRate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.interestRate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Loan Amount */}
                  <div className="flex justify-between items-center space-x-8">
                    <div className="w-[60%]">
                      <label className="block text-sm font-bold text-gray-600">
                        Loan Amount
                      </label>
                      <div className="mt-1 relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                          <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                          type="number"
                          name="loanAmount"
                          value={formData.loanAmount}
                          onChange={handleInputChange}
                          className={`pl-14 w-full font-semibold font-sans text-gray-500 rounded-lg border ${
                            errors.loanAmount
                              ? "border-2 border-red-500"
                              : "border-gray-300"
                          } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                          placeholder="Enter loan amount"
                        />
                      </div>
                      {errors.loanAmount && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.loanAmount}
                        </p>
                      )}
                    </div>

                    {/* Loan Repayment Term */}
                    <div className="w-[40%]">
                      <label className="block text-sm font-bold text-gray-600">
                        Loan Repayment Term
                      </label>
                      <div className="mt-1 relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          name="loanTerm"
                          value={formData.loanTerm}
                          onChange={handleInputChange}
                          className="pl-14 w-full font-semibold font-sans text-gray-500 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11"
                        >
                          {[6, 12, 24, 36, 48, 60].map((months) => (
                            <option key={months} value={months}>
                              {months} months
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600">
                      Purpose of Loan
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      rows={4}
                      className={`mt-1 font-sans font-semibold text-gray-500 w-full rounded-lg border ${
                        errors.purpose
                          ? "border-2 border-red-500"
                          : "border-gray-300"
                      } focus:border-amber-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent p-2`}
                      placeholder="Describe the purpose of your loan"
                    />
                    {errors.purpose && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg px-24">
                    <h3 className=" font-bold text-amber-700 mb-3 text-center">
                      Loan Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-500">
                          Monthly Payment:
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          $ {calculateMonthlyPayment()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-500">
                          Interest Rate:
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {formData.interestRate}% p.a.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-500">
                          Total Repayment:
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          ${" "}
                          {(
                            calculateMonthlyPayment() * formData.loanTerm
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className=" font-bold text-center text-primary-700 mb-4">
                    Supporting Documents Upload
                  </h3>
                  <div>
                    <label className="block text-[0.94rem] font-bold text-amber-700">
                      Upload your Employment Contract / Letter
                    </label>
                    <input
                      type="file"
                      name="employmentContract"
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-lg border ${
                        errors.employmentContract
                          ? "border-2 border-red-500"
                          : "border-gray-300"
                      } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans font-semibold text-gray-600 text-[0.92rem] p-2`}
                      accept=".pdf,.doc,.docx"
                    />
                    {errors.employmentContract && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.employmentContract}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[0.94rem] font-bold text-amber-700">
                      Bank Statements (Last 6 months)
                    </label>
                    <input
                      type="file"
                      name="bankStatements"
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-lg border ${
                        errors.bankStatements
                          ? "border-2 border-red-500"
                          : "border-gray-300"
                      } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans font-semibold text-gray-600 text-[0.92rem] p-2`}
                      accept=".pdf"
                      multiple
                    />
                    {errors.bankStatements && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bankStatements}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[0.94rem] font-bold text-amber-700">
                      ID / Passport Document
                    </label>
                    <input
                      type="file"
                      name="idDocument"
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-lg border ${
                        errors.idDocument
                          ? "border-2 border-red-500"
                          : "border-gray-300"
                      } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans font-semibold text-gray-600 text-[0.92rem] p-2`}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    {errors.idDocument && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.idDocument}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg px-4">
                    <h3 className="font-bold text-center text-primary-700 border-b pb-2 mx-[10%] mb-4">
                      Loan Application Summary
                    </h3>
                    <div className="space-y-4">
                      {/* Member Information */}
                      <div>
                        <h4 className="text-xs font-bold text-amber-700 uppercase">
                          Loan Applicant Information
                        </h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Applicant Full Name:
                            </span>
                            <span className="text-sm font-bold text-gray-600">
                              {formData.memberName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Welfare Member ID Number:
                            </span>
                            <span className="text-sm font-bold text-gray-600">
                              {formData.memberId}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-700 uppercase">
                          Loan Details
                        </h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Amount:
                            </span>
                            <span className="text-sm font-bold text-gray-600">
                              $ {formData.loanAmount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Repayment Term:
                            </span>
                            <span className="text-sm font-bold text-primary-600">
                              {formData.loanTerm} months
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Monthly Payment:
                            </span>
                            <span className="text-sm font-bold text-gray-600">
                              $ {calculateMonthlyPayment()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Total Amount to be Repaid:
                            </span>
                            <span className="text-sm font-bold text-red-600">
                              ${" "}
                              {(
                                calculateMonthlyPayment() * formData.loanTerm
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-amber-700 uppercase">
                          Documents Provided
                        </h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            Employment Letter / Contract -{" "}
                            {formData.employmentContract.name}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            Bank Statements - {formData.bankStatements.name}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            ID Document - {formData.idDocument.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-100 rounded-lg p-4">
                    <div className="flex">
                      <InformationCircleIcon className="w-9 text-red-500 mr-2" />
                      <div>
                        <h3 className="text-sm font-semibold text-yellow-800">
                          Important Notice
                        </h3>
                        <p className="mt-2 text-sm font-sans text-yellow-700">
                          By submitting this application, you confirm that all
                          provided information is true and accurate. False
                          information may lead to automatic rejection.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 ">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center font-semibold gap-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center font-semibold gap-2 ml-auto px-8 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 font-semibold ml-auto px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Submit Application
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationButton;
