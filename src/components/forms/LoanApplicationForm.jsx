import React, { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const LoanApplicationButton = () => {
  const [isOpen, setIsOpen] = useState(false);

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

      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </>
  );
};

const Modal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    loanAmount: "",
    loanTerm: "12",
    purpose: "",
    paySlip: null,
    bankStatements: null,
    idDocument: null,
  });
  const [errors, setErrors] = useState({});

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
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.loanAmount) {
        newErrors.loanAmount = "Loan amount is required";
      } else if (formData.loanAmount < 10000) {
        newErrors.loanAmount = "Minimum loan amount is KES 10,000";
      } else if (formData.loanAmount > 1000000) {
        newErrors.loanAmount = "Maximum loan amount is KES 1,000,000";
      }

      if (!formData.purpose) {
        newErrors.purpose = "Loan purpose is required";
      }
    }

    if (step === 2) {
      if (!formData.paySlip) {
        newErrors.paySlip = "Pay slip is required";
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
    const annualInterestRate = 0.15;
    const monthlyInterestRate = annualInterestRate / 12;
    const monthlyPayment =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    return isNaN(monthlyPayment) ? 0 : monthlyPayment.toFixed(2);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      onClose();
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
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl transform transition-all">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-red-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-red-500" />
          </button>

          <div className="p-6 border-b border-gray-200 text-center">
            <h1 className="text-2xl font-extrabold text-primary-600">
              New Loan Application
            </h1>

            <p className="mt-1 text-gray-500 font-semibold font-nunito-sans">
              Complete the form and steps below to apply for a loan
            </p>
          </div>

          <div className="p-6 font-nunito-sans">
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
                  <div>
                    <label className="block text-sm font-bold text-gray-600">
                      Loan Amount
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="number"
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleInputChange}
                        className={`pl-10 w-full rounded-lg border ${
                          errors.loanAmount
                            ? "border-red-500"
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

                  <div>
                    <label className="block text-sm font-bold text-gray-600">
                      Loan Repayment Term
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="loanTerm"
                        value={formData.loanTerm}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11"
                      >
                        {[12, 24, 36, 48, 60].map((months) => (
                          <option key={months} value={months}>
                            {months} months
                          </option>
                        ))}
                      </select>
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
                      className={`mt-1 w-full rounded-lg border ${
                        errors.purpose ? "border-red-500" : "border-gray-300"
                      } focus:border-amber-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent p-2`}
                      placeholder="Describe the purpose of your loan"
                    />
                    {errors.purpose && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Loan Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Monthly Payment:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          KES {calculateMonthlyPayment()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Interest Rate:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          15% p.a.
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Total Repayment:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          KES{" "}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pay Slip
                    </label>
                    <input
                      type="file"
                      name="paySlip"
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-lg border ${
                        errors.paySlip ? "border-red-500" : "border-gray-300"
                      } focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 p-2`}
                      accept=".pdf,.doc,.docx"
                    />
                    {errors.paySlip && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.paySlip}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Statements (Last 6 months)
                    </label>
                    <input
                      type="file"
                      name="bankStatements"
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-lg border ${
                        errors.bankStatements
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 p-2`}
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
                    <label className="block text-sm font-medium text-gray-700">
                      ID Document
                    </label>
                    <input
                      type="file"
                      name="idDocument"
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-lg border ${
                        errors.idDocument ? "border-red-500" : "border-gray-300"
                      } focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 p-2`}
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
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Application Summary
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase">
                          Loan Details
                        </h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Amount:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              KES {formData.loanAmount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Term:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {formData.loanTerm} months
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Monthly Payment:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              KES {calculateMonthlyPayment()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Total Repayment:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              KES{" "}
                              {(
                                calculateMonthlyPayment() * formData.loanTerm
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase">
                          Documents Provided
                        </h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            Pay Slip
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            Bank Statements
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            ID Document
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex">
                      <InformationCircleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                          Important Notice
                        </h3>
                        <p className="mt-2 text-sm text-yellow-700">
                          By submitting this application, you confirm that all
                          provided information is true and accurate. False
                          information may lead to automatic disqualification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 ml-auto px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 ml-auto px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
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
