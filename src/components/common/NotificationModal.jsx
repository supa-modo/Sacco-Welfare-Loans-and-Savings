import React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const NotificationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "confirm", // 'confirm', 'success', 'error', 'info'
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  const icons = {
    confirm: <AlertCircle className="w-12 h-12 text-primary-600" />,
    success: <CheckCircle className="w-12 h-12 text-primary-600" />,
    error: <AlertTriangle className="w-12 h-12 text-red-500" />,
    info: <Info className="w-12 h-12 text-primary-600" />,
  };

  const backgrounds = {
    confirm: "bg-primary-50",
    success: "bg-green-50",
    error: "bg-red-50",
    info: "bg-primary-50",
  };

  const confirmButtonColors = {
    confirm: "bg-primary-700 hover:bg-primary-600",
    success: "bg-primary-700 hover:bg-primary-600",
    error: "bg-red-600 hover:bg-red-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg p-6 mx-4 rounded-2xl shadow-xl transform transition-all ${backgrounds[type]} border border-opacity-10`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-black hover:bg-opacity-5 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {icons[type]}

          <h3 className="mt-2 sm:text-lg font-semibold text-gray-500">
            {title}
          </h3>

          <p className="mt-2 text-sm sm:text-base text-gray-600">{message}</p>

          {/* Buttons */}
          <div className="mt-6 flex gap-3 w-full">
            {type === "confirm" && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 sm:py-2 text-sm sm:text-base text-gray-600 font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
            )}

            <button
              onClick={type === "confirm" ? onConfirm : onClose}
              className={`flex-1 px-4 py-2.5 sm:py-2 text-sm sm:text-base font-semibold text-white rounded-lg transition-colors ${confirmButtonColors[type]}`}
            >
              {type === "confirm" ? confirmText : "OK"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
