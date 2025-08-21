import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

export default function OnboardingNickname() {
  const [nickname, setNickname] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (nickname.trim()) {
      navigate("/onboarding/birthdate");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto">
      {/* Status Bar */}
      <MobileStatusBar />

      {/* Navigation Header */}
      <div className="flex items-center justify-between px-6 py-3 h-18">
        <button
          onClick={handleBack}
          className="w-7 h-7 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 mx-4 h-3 bg-gray-200 rounded-full">
          <div className="w-1/4 h-full bg-[#9610FF] rounded-full"></div>
        </div>

        <div className="w-7 h-7"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-3">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 text-[32px] font-bold leading-[51px] mb-3">
            Your datify identity 😎
          </h1>
          <p className="text-gray-500 text-lg leading-[29px] tracking-wide">
            Create a unique nickname that represents you. It's how others will
            know and remember you.
          </p>
        </div>

        {/* Nickname Input */}
        <div className="mb-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[80px] flex items-center">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onFocus={() => setIsKeyboardVisible(true)}
              onBlur={() => setIsKeyboardVisible(false)}
              placeholder="Nickname"
              className="w-full text-center text-[32px] font-bold text-gray-900 bg-transparent outline-none placeholder-gray-400"
              maxLength={20}
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6 pt-6 pb-9 border-t border-gray-100 bg-white">
        <button
          onClick={handleContinue}
          disabled={!nickname.trim()}
          className={`w-full py-4 rounded-full text-white text-base font-bold transition-colors ${
            nickname.trim()
              ? "bg-[#9610FF] hover:bg-[#8510E6]"
              : "bg-[#780DCC] cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
