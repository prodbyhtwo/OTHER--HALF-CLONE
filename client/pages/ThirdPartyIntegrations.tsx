import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThirdPartyIntegrations: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"accounts" | "payments">(
    "payments",
  );

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      icon: "/placeholder.svg",
      status: "Connected",
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: "/placeholder.svg",
      status: "Connected",
    },
    {
      id: "applepay",
      name: "Apple Pay",
      icon: "/placeholder.svg",
      status: "Connected",
    },
    {
      id: "mastercard",
      name: "•••• •••• •••• •••• 4679",
      icon: "/placeholder.svg",
      status: "Connected",
    },
    {
      id: "visa",
      name: "•••• •••• •••• •••• 5567",
      icon: "/placeholder.svg",
      status: "Connected",
    },
    {
      id: "amex",
      name: "•••• •••• •••• •••• 8456",
      icon: "/placeholder.svg",
      status: "Connected",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto">
      {/* Status Bar */}
      <div className="w-full h-11 flex items-center justify-between px-6 text-black text-base font-semibold">
        <div className="flex items-center">
          <span>9:41</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-end gap-1">
            <div className="w-1 h-2 bg-black rounded-sm"></div>
            <div className="w-1 h-3 bg-black rounded-sm"></div>
            <div className="w-1 h-4 bg-black rounded-sm"></div>
            <div className="w-1 h-5 bg-black rounded-sm"></div>
          </div>
          <svg className="w-4 h-3 ml-2" viewBox="0 0 16 11" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
              fill="black"
            />
          </svg>
          <div className="ml-2 w-7 h-3 border border-black border-opacity-35 rounded-sm relative">
            <div className="absolute inset-0.5 bg-black rounded-sm"></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-black bg-opacity-40 rounded-r"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 h-18">
        <button
          onClick={() => navigate(-1)}
          className="w-7 h-7 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-1 text-center text-gray-900 text-2xl font-bold">
          Third Party Integrations
        </h1>
        <div className="w-7 h-7"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {/* Tabs */}
        <div className="flex rounded-md bg-gray-100 p-1 mb-7">
          <button
            onClick={() => setActiveTab("accounts")}
            className={`flex-1 px-3 py-2 text-sm font-bold rounded-md transition-colors ${
              activeTab === "accounts"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-900"
            }`}
          >
            Linked Accounts
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex-1 px-3 py-2 text-sm font-bold rounded-md transition-colors ${
              activeTab === "payments"
                ? "bg-[#9610FF] text-white shadow-sm"
                : "text-gray-900"
            }`}
          >
            Linked Payments
          </button>
        </div>

        {/* Payment Methods */}
        <div className="space-y-5 mb-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="w-15 h-15 rounded-full bg-gray-100 flex items-center justify-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {method.name}
                </h3>
              </div>
              <span className="text-lg font-bold text-gray-500">
                {method.status}
              </span>
            </div>
          ))}
        </div>

        {/* Add New Payment Button */}
        <button
          onClick={() => navigate("/add-new-payment")}
          className="w-full flex items-center justify-center gap-5 py-4 border-2 border-[#9610FF] rounded-full text-[#9610FF] font-bold transition-colors hover:bg-[#9610FF] hover:text-white"
        >
          <Plus className="w-5 h-5" />
          Add New Payment
        </button>
      </div>
    </div>
  );
};

export default ThirdPartyIntegrations;
