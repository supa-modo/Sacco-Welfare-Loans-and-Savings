import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="text-lg mb-6 text-center">
        Sorry, you don’t have permission to access this page.
      </p>
      <button
        onClick={handleGoBack}
        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        Go Back
      </button>
    </div>
  );
};

export default UnauthorizedPage;
