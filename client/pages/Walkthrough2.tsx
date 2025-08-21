import { useState } from "react";

// Mobile status bar component (reused)
const MobileStatusBar = () => (
  <div className="w-full h-11 flex items-center justify-between px-6 text-white text-base font-semibold">
    <div className="flex items-center">
      <span>9:41</span>
    </div>
    <div className="flex items-center gap-1">
      {/* Signal bars */}
      <div className="flex items-end gap-1">
        <div className="w-1 h-2 bg-white rounded-sm"></div>
        <div className="w-1 h-3 bg-white rounded-sm"></div>
        <div className="w-1 h-4 bg-white rounded-sm"></div>
        <div className="w-1 h-5 bg-white rounded-sm"></div>
      </div>
      {/* WiFi icon */}
      <svg className="w-4 h-3 ml-2" viewBox="0 0 16 11" fill="white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
        />
      </svg>
      {/* Battery */}
      <div className="ml-2 w-7 h-3 border border-white border-opacity-35 rounded-sm relative">
        <div className="absolute inset-0.5 bg-white rounded-sm"></div>
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-white bg-opacity-40 rounded-r"></div>
      </div>
    </div>
  </div>
);

// Phone mockup component showing the profile interface
const ProfilePhoneMockup = () => (
  <div className="relative w-full max-w-sm mx-auto">
    {/* Phone Frame */}
    <div className="relative w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
      {/* Phone Screen */}
      <div className="bg-white">
        {/* Status Bar (inside phone) */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-black text-sm font-semibold">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex items-end gap-1">
              <div className="w-1 h-2 bg-black rounded-sm"></div>
              <div className="w-1 h-3 bg-black rounded-sm"></div>
              <div className="w-1 h-4 bg-black rounded-sm"></div>
              <div className="w-1 h-5 bg-black rounded-sm"></div>
            </div>
            <svg className="w-4 h-3 ml-2" viewBox="0 0 16 11" fill="black">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
              />
            </svg>
            <div className="ml-2 w-7 h-3 border border-black border-opacity-35 rounded-sm relative">
              <div className="absolute inset-0.5 bg-black rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-black rounded-full"></div>

        {/* App Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="w-8 h-8 bg-[#9610FF] rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <div className="flex items-center gap-3">
            <div className="bg-[#9610FF] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              UPGRADE
            </div>
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Profile Completion Banner */}
        <div className="mx-6 mb-6 bg-[#9610FF] rounded-2xl p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            {/* Progress Circle */}
            <div className="relative w-12 h-12">
              <svg
                className="w-12 h-12 transform -rotate-90"
                viewBox="0 0 48 48"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="white"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="125.6"
                  strokeDashoffset="106.76"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                15%
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg">Complete your profile</h3>
              <p className="text-sm opacity-90">
                Complete your profile to experience the best dating experience
                and better matches!
              </p>
            </div>
          </div>
          <button className="text-white hover:text-gray-200">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Profile Photo */}
        <div className="px-6 pb-8">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {/* Photo overlay controls */}
            <div className="absolute top-4 left-4">
              <div className="bg-[#9610FF] w-3 h-3 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Progress indicators component (step 2 of 3)
const ProgressIndicators = () => (
  <div className="flex justify-center items-center gap-2">
    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
    <div className="w-8 h-2 bg-[#9610FF] rounded-full"></div>
    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
  </div>
);

export default function Walkthrough2() {
  const [currentStep] = useState(2);

  return (
    <div className="min-h-screen bg-[#9610FF] relative overflow-hidden flex flex-col">
      {/* Mobile Status Bar */}
      <MobileStatusBar />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Phone Mockup Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <ProfilePhoneMockup />
      </div>

      {/* Bottom Content Overlay */}
      <div className="bg-white rounded-t-[2rem] shadow-lg">
        <div className="px-6 py-8 pb-12 space-y-6">
          {/* Title and Description */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Be Yourself, Stand Out from the Crowd.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Tell your story. Share your interests, hobbies, and what you're
              looking for. Be authentic and make a lasting impression.
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="py-4">
            <ProgressIndicators />
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="border-t border-gray-100 bg-white px-6 py-6 pb-12">
          <div className="flex gap-4">
            <button className="flex-1 bg-[#F7ECFF] text-[#9610FF] font-bold py-4 px-6 rounded-full text-center text-lg hover:bg-purple-100 transition-colors">
              Skip
            </button>
            <button className="flex-1 bg-[#9610FF] text-white font-bold py-4 px-6 rounded-full text-center text-lg hover:bg-purple-700 transition-colors">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
