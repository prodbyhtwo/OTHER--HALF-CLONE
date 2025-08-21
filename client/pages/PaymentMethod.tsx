import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "lucide-react";

// Mobile status bar component
const MobileStatusBar = () => (
  <div className="w-full h-11 flex items-center justify-between px-6 text-black text-base font-semibold">
    <div className="flex items-center">
      <span>9:41</span>
    </div>
    <div className="flex items-center gap-1">
      {/* Signal bars */}
      <div className="flex items-end gap-1">
        <div className="w-1 h-2 bg-black rounded-sm"></div>
        <div className="w-1 h-3 bg-black rounded-sm"></div>
        <div className="w-1 h-4 bg-black rounded-sm"></div>
        <div className="w-1 h-5 bg-black rounded-sm"></div>
      </div>
      {/* WiFi icon */}
      <svg className="w-4 h-3 ml-2" viewBox="0 0 16 11" fill="black">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
        />
      </svg>
      {/* Battery */}
      <div className="ml-2 w-7 h-3 border border-black border-opacity-35 rounded-sm relative">
        <div className="absolute inset-0.5 bg-black rounded-sm"></div>
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-black bg-opacity-40 rounded-r"></div>
      </div>
    </div>
  </div>
);

export default function PaymentMethod() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("mastercard");
  const [showProcessing, setShowProcessing] = useState(false);

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      icon: (
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
      ),
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: (
        <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
          <div className="w-8 h-8 relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-0 left-0"></div>
            <div className="w-4 h-4 bg-red-500 rounded-full absolute top-0 right-0"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full absolute bottom-0 left-0"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full absolute bottom-0 right-0"></div>
          </div>
        </div>
      ),
    },
    {
      id: "applepay",
      name: "Apple Pay",
      icon: (
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        </div>
      ),
    },
    {
      id: "mastercard",
      name: "•••• •••• •••• 4679",
      icon: (
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
          <div className="flex">
            <div className="w-4 h-6 bg-red-600 rounded-sm"></div>
            <div className="w-4 h-6 bg-orange-400 rounded-sm -ml-2"></div>
          </div>
        </div>
      ),
      isSelected: true,
    },
    {
      id: "visa",
      name: "•••• •••• •••• 5567",
      icon: (
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">VISA</span>
        </div>
      ),
    },
    {
      id: "amex",
      name: "•••• •••• •••• 8456",
      icon: (
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">AMEX</span>
        </div>
      ),
    },
  ];

  const handleContinue = () => {
    setShowProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setShowProcessing(false);
      // Navigate to success or next page
      navigate("/home");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <MobileStatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Select Payment Method</h1>
        <button className="p-2">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 pb-20">
        {/* Payment Methods List */}
        <div className="space-y-4 mb-8">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center gap-4">
                {method.icon}
                <span className="text-lg font-medium">{method.name}</span>
              </div>
              {selectedMethod === method.id && (
                <Check className="w-6 h-6 text-purple-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleContinue}
          className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold text-lg"
        >
          Continue
        </button>
      </div>

      {/* Processing Payment Modal */}
      {showProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto">
                <svg className="w-16 h-16 animate-spin" viewBox="0 0 50 50">
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="80"
                    strokeDashoffset="60"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Processing payment...
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
