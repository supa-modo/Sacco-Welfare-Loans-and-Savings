import React, { useState, useEffect } from "react";
import { memberService } from "../../services/api";
import {
  PlusIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { SiOnlyoffice } from "react-icons/si";
import NotificationModal from "../../components/common/NotificationModal";

const AddMemberButton = ({ onMemberAdded }) => {
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
    if (onMemberAdded) {
      onMemberAdded();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
        <span className="font-semibold text-[0.9rem]">Add New Member</span>
      </button>

      {isOpen && (
        <AddMemberModal
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

const AddMemberModal = ({
  onClose,
  setNotificationConfig,
  setNotificationModalOpen,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pfNo: "",
    jobTitle: "",
    monthlySavingsAmt: "5000", // Default monthly savings amount
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email address is required";
    if (!formData.phone || formData.phone.length < 10)
      newErrors.phone = "Valid phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.pfNo) newErrors.pfNo = "Staff PF Number is required";
    if (!formData.jobTitle)
      newErrors.jobTitle = "Official Job Title is required";
    if (!formData.monthlySavingsAmt || formData.monthlySavingsAmt <= 0)
      newErrors.monthlySavingsAmt = "Monthly savings amount is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const memberId = `M${Date.now().toString().slice(3, 9)}`;
      const memberData = {
        ...formData,
        id: memberId,
        joinDate: new Date(),
        status: "Active",
        savingsBalance: 0,
        loansBalance: 0,
      };

      await memberService.createMember(memberData);
      setNotificationConfig({
        type: "success",
        title: "Member Added Successfully",
        message: "The new member has been registered in the system.",
      });
      setNotificationModalOpen(true);
      onClose();
    } catch (error) {
      setNotificationConfig({
        type: "error",
        title: "Failed to Add Member. Please try again.",
        message:
          error.response?.data?.error ||
          "An error occurred while adding the member.",
      });
      setNotificationModalOpen(true);
      setErrors({
        submit: error.response?.data?.error || "Failed to create member",
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

          <div className="p-6 border-b border-gray-200 text-center">
            <h1 className="text-2xl font-extrabold text-primary-600">
              New Member Registration
            </h1>
            <p className="mt-1 text-gray-500 font-semibold font-nunito-sans">
              Please fill in the member details below
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-600">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                      errors.name
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                      errors.email
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                      errors.phone
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-600">
                  Residential Address
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                      errors.address
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                    placeholder="Enter full address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600">
                  Official Job Title
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                    <SiOnlyoffice className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={`pl-14 w-full font-semibold text-gray-600 rounded-lg border ${
                      errors.jobTitle
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                    placeholder="New Member's Job Title"
                  />
                  {errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.jobTitle}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600">
                  Staff PF Number
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                    <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="pfNo"
                    value={formData.pfNo}
                    onChange={handleInputChange}
                    className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                      errors.pfNo
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                    placeholder="Member's Staff PF No"
                  />
                  {errors.pfNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.pfNo}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-amber-100 rounded-lg p-4 mt-6">
              <div className="flex">
                <InformationCircleIcon className="w-12 text-red-500 mr-2" />
                <div>
                  <h3 className="text-sm font-bold font-nunito-sans text-amber-800">
                    Important Notice
                  </h3>
                  <p className="mt-1 text-sm text-amber-700">
                    By submitting this form, you confirm that all provided
                    information is accurate and complete. A mandatory initial
                    deposit of KES 1000 will be recorded for the new member's
                    savings account.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-600">
                Monthly Savings Amount
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="monthlySavingsAmt"
                  value={formData.monthlySavingsAmt}
                  onChange={handleInputChange}
                  className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                    errors.monthlySavingsAmt
                      ? "border-2 border-red-500"
                      : "border-gray-300"
                  } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                  placeholder="Enter default monthly savings amount"
                />
              </div>
              {errors.monthlySavingsAmt && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.monthlySavingsAmt}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                This amount will be used for monthly group contributions
                deducted from the member's salary.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Register Member"}
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
    </div>
  );
};

export default AddMemberButton;
