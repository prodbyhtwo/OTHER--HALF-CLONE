import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Star,
  Compass,
  User,
  Bell,
  Shield,
  CreditCard,
  Eye,
  RotateCcw,
  BarChart3,
  HelpCircle,
  LogOut,
  ChevronRight,
  Heart,
  Church,
} from "lucide-react";
import LogoutModal from "../components/LogoutModal";
import { FaithBackground, FaithCard, ThemeToggle, useFaithTheme } from "../components/FaithElements";

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

export default function Settings() {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { isFaithMode } = useFaithTheme();

  const settingsOptions = [
    {
      icon: Compass,
      title: "Discovery Preferences",
      path: "/settings/discovery-preferences",
    },
    {
      icon: User,
      title: "Profile & Privacy",
      path: "/settings/profile-privacy",
    },
    {
      icon: Bell,
      title: "Notification",
      path: "/settings/notification",
    },
    {
      icon: Shield,
      title: "Account & Security",
      path: "/settings/account-security",
    },
    {
      icon: Star,
      title: "Subscription",
      path: "/settings/subscription",
    },
    {
      icon: Eye,
      title: "App Appearance",
      path: "/settings/app-appearance",
    },
    {
      icon: RotateCcw,
      title: "Third Party Integrations",
      path: "/third-party-integrations",
    },
    {
      icon: BarChart3,
      title: "Data & Analytics",
      path: "/settings/data-analytics",
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      path: "/help-support",
    },
  ];

  return (
    <FaithBackground className="min-h-screen">
      <MobileStatusBar />

      {/* Header */}
      <FaithCard className="flex items-center justify-between px-6 py-3 rounded-none border-x-0 border-t-0">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className={`w-6 h-6 ${isFaithMode() ? 'text-amber-800' : 'text-black'}`} />
        </button>
        <div className="flex items-center space-x-2">
          {isFaithMode() && <Church className="w-5 h-5 text-amber-600" />}
          <h1 className={`text-2xl font-bold ${isFaithMode() ? 'text-amber-800' : 'text-black'}`}>
            Settings
          </h1>
        </div>
        <div className="w-10" />
      </FaithCard>

      <div className="px-6 pb-20">
        {/* Upgrade Membership Banner */}
        <div className="mb-6 p-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl text-white relative overflow-hidden">
          <button
            onClick={() => navigate("/upgrade-membership")}
            className="w-full flex items-center gap-4"
          >
            {/* Decorative elements */}
            <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-4 left-8 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-3 left-6 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>

            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center relative">
              <Star className="w-8 h-8 text-orange-500" fill="currentColor" />
              {/* More decorative dots around the star */}
              <div className="absolute -top-1 -left-1 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute -top-2 right-2 w-0.5 h-0.5 bg-white rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-white rounded-full"></div>
            </div>

            <div className="flex-1 text-left">
              <h2 className="text-lg font-bold mb-1">
                Upgrade Membership Now!
              </h2>
              <p className="text-sm opacity-90">
                Enjoy all the benefits and explore more possibilities
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Faith Theme Toggle */}
        <FaithCard className="mb-6 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className={`w-6 h-6 ${isFaithMode() ? 'text-amber-600' : 'text-purple-600'}`} />
            <h2 className={`text-lg font-semibold ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
              App Experience
            </h2>
          </div>
          <ThemeToggle />
        </FaithCard>

        {/* Settings Options */}
        <div className="space-y-6">
          {settingsOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => navigate(option.path)}
              className="w-full flex items-center gap-5 py-0"
            >
              <option.icon className="w-6 h-6 text-gray-700" />
              <span className="flex-1 text-left text-lg font-semibold text-gray-900">
                {option.title}
              </span>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-5 py-0"
          >
            <LogOut className="w-6 h-6 text-red-500" />
            <span className="flex-1 text-left text-lg font-semibold text-red-500">
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </FaithBackground>
  );
}
