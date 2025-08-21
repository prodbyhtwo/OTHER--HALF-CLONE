import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";

// Mobile Status Bar Component
const MobileStatusBar: React.FC = () => (
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
);

const ProfilePrivacy: React.FC = () => {
  const navigate = useNavigate();
  const [privacyMode, setPrivacyMode] = useState(false);

  const handleBack = () => {
    navigate("/settings");
  };

  const handleUsername = () => {
    navigate("/settings/username");
  };

  const handleVisibility = () => {
    navigate("/settings/visibility");
  };

  const handleBlockedUsers = () => {
    navigate("/settings/blocked-users");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto">
      <MobileStatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 h-18">
        <button
          onClick={handleBack}
          className="w-7 h-7 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center">
          Profile & Privacy
        </h1>
        <div className="w-7 h-7"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {/* Your Public Profile Section */}
        <div className="mb-9">
          <div className="flex items-center mb-5">
            <h2 className="text-sm font-semibold text-gray-400 tracking-wide">
              Your Public Profile
            </h2>
            <div className="flex-1 h-px bg-gray-200 ml-4"></div>
          </div>

          <div className="space-y-6">
            {/* Username */}
            <button
              onClick={handleUsername}
              className="flex items-center justify-between w-full"
            >
              <span className="text-xl font-semibold text-gray-900">
                Username
              </span>
              <div className="flex items-center">
                <span className="text-base font-semibold text-gray-900 mr-5">
                  andrew49
                </span>
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </div>
            </button>

            {/* View Web Profile */}
            <button className="flex items-center justify-between w-full">
              <span className="text-xl font-semibold text-gray-900">
                View Web Profile
              </span>
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>

            {/* Share My Profile */}
            <button className="flex items-center justify-between w-full">
              <span className="text-xl font-semibold text-gray-900">
                Share My Profile
              </span>
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>

        {/* Privacy & Visibility Section */}
        <div className="mb-9">
          <div className="flex items-center mb-5">
            <h2 className="text-sm font-semibold text-gray-400 tracking-wide">
              Privacy & Visibility
            </h2>
            <div className="flex-1 h-px bg-gray-200 ml-4"></div>
          </div>

          <div className="space-y-6">
            {/* Visibility */}
            <button
              onClick={handleVisibility}
              className="flex items-start justify-between w-full"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 text-left mb-1.5">
                  Visibility
                </h3>
                <p className="text-base text-gray-600 text-left">
                  Choose who can see your profile.
                </p>
              </div>
              <div className="pt-1">
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </div>
            </button>

            {/* Privacy Mode */}
            <div className="flex items-start justify-between w-full">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1.5">
                  Privacy Mode
                </h3>
                <p className="text-base text-gray-600">
                  Enable or disable private mode for incognito browsing.
                </p>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => setPrivacyMode(!privacyMode)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    privacyMode ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      privacyMode ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Profile Verification */}
            <button className="flex items-start justify-between w-full">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 text-left mb-1.5">
                  Profile Verification
                </h3>
                <p className="text-base text-gray-600 text-left">
                  Verify your profile to gain more trust.
                </p>
              </div>
              <div className="pt-1">
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </div>
            </button>

            {/* Blocked Users */}
            <button
              onClick={handleBlockedUsers}
              className="flex items-start justify-between w-full"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 text-left mb-1.5">
                  Blocked Users (24)
                </h3>
                <p className="text-base text-gray-600 text-left">
                  The people you blocked are displayed here.
                </p>
              </div>
              <div className="pt-1">
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </div>
            </button>
          </div>
        </div>

        {/* Messages & Active Status Section */}
        <div>
          <div className="flex items-center mb-5">
            <h2 className="text-sm font-semibold text-gray-400 tracking-wide">
              Messages & Active Status
            </h2>
            <div className="flex-1 h-px bg-gray-200 ml-4"></div>
          </div>

          <div className="space-y-6">
            {/* Manage Active Status */}
            <button
              onClick={() => navigate("/settings/manage-active-status")}
              className="flex items-center justify-between w-full"
            >
              <span className="text-xl font-semibold text-gray-900">
                Manage Active Status
              </span>
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>

            {/* Manage Messages */}
            <button
              onClick={() => navigate("/settings/manage-messages")}
              className="flex items-center justify-between w-full"
            >
              <span className="text-xl font-semibold text-gray-900">
                Manage Messages
              </span>
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePrivacy;
