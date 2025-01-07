import React, { useState, useEffect } from "react";
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
} from "@heroicons/react/24/outline";
import { GiOfficeChair } from "react-icons/gi";
import { SiOnlyfans, SiOnlyoffice } from "react-icons/si";
import { TbNumber } from "react-icons/tb";
import { GoNumber } from "react-icons/go";

const AddMemberButton = () => {
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
        <span className="font-semibold text-[0.9rem]">Add New Member</span>
      </button>

      {isOpen && <AddMemberModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

const AddMemberModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    identificationNumber: "",
    jobTitle: "",
    emergencyContact: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email address is required";
    if (!formData.phone || formData.phone.length < 10)
      newErrors.phone = "Valid phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.identificationNumber)
      newErrors.identificationNumber = "Passport/ID Number is required";
    if (!formData.jobTitle)
      newErrors.jobTitle = "Official Job Title is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Member details submitted:", formData);
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
              <div>
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

              <div>
                <label className="block text-sm font-bold text-gray-600">
                  Date of Birth
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                      errors.dateOfBirth
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dateOfBirth}
                    </p>
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
                    name="identificationNumber"
                    value={formData.identificationNumber}
                    onChange={handleInputChange}
                    className={`pl-12 w-full font-semibold text-gray-600 rounded-lg border ${
                      errors.identificationNumber
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                    } shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-11`}
                    placeholder="Member's Staff PF No"
                  />
                  {errors.identificationNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.identificationNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-amber-100 rounded-lg p-4 mt-6">
              <div className="flex">
                <InformationCircleIcon className=" w-12 text-red-500 mr-2" />
                <div>
                  <h3 className="text-sm font-bold font-nunito-sans text-amber-800">
                    Important Notice
                  </h3>
                  <p className="mt-1 text-sm text-amber-700">
                    By submitting this form, you confirm that all provided
                    information is accurate and complete. This information will
                    be used for member identification and communication
                    purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                Register Member
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberButton;
