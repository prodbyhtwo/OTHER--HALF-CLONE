import React from "react";
import { useNavigate } from "react-router-dom";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    onClose();
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[430px] mx-auto bg-white rounded-t-3xl border border-gray-200 p-6 pb-9">
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-red-500 text-center mb-6">
          Logout
        </h2>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-6"></div>

        {/* Content */}
        <p className="text-xl font-bold text-gray-900 text-center mb-6">
          Are you sure you want to log out?
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-purple-50 text-[#9610FF] font-bold text-lg rounded-full transition-colors hover:bg-purple-100"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-4 bg-[#9610FF] text-white font-bold text-lg rounded-full transition-colors hover:bg-purple-700"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
