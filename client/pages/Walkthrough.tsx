import { useState } from "react";

// Mobile status bar component (reused from Index)
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

// Phone mockup component showing the matches interface
const PhoneMockup = () => (
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
          <h1 className="text-xl font-bold text-gray-900">Matches</h1>
          <div className="flex items-center gap-3">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mx-6 mb-6">
          <button className="flex-1 bg-[#9610FF] text-white font-semibold py-3 px-6 rounded-l-full">
            Likes (85)
          </button>
          <button className="flex-1 bg-gray-100 text-gray-600 font-semibold py-3 px-6 rounded-r-full">
            Super Likes (24)
          </button>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-2 gap-4 px-6 pb-8">
          {/* Profile 1 */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-t from-black/60 to-transparent aspect-[3/4]">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face"
              alt="Monica"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-semibold text-lg">Monica (24)</h3>
              <p className="text-sm opacity-80">5 km away</p>
            </div>
          </div>

          {/* Profile 2 */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-t from-black/60 to-transparent aspect-[3/4]">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face"
              alt="Elizabeth"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-semibold text-lg">Elizabeth (25)</h3>
              <p className="text-sm opacity-80">7 km away</p>
            </div>
          </div>

          {/* Profile 3 */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-t from-black/60 to-transparent aspect-[3/4]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face"
              alt="Sarah"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-semibold text-lg">Sarah (23)</h3>
              <p className="text-sm opacity-80">3 km away</p>
            </div>
          </div>

          {/* Profile 4 */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-t from-black/60 to-transparent aspect-[3/4]">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face"
              alt="Jessica"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-semibold text-lg">Jessica (26)</h3>
              <p className="text-sm opacity-80">4 km away</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Progress indicators component
const ProgressIndicators = () => (
  <div className="flex justify-center items-center gap-2">
    <div className="w-8 h-2 bg-[#9610FF] rounded-full"></div>
    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
  </div>
);

export default function Walkthrough() {
  const [currentStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#9610FF] relative overflow-hidden flex flex-col">
      {/* Mobile Status Bar */}
      <MobileStatusBar />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Phone Mockup Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <PhoneMockup />
      </div>

      {/* Bottom Content Overlay */}
      <div className="bg-white rounded-t-[2rem] shadow-lg">
        <div className="px-6 py-8 pb-12 space-y-6">
          {/* Title and Description */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Discover Meaningful Connections
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Join Datify today and explore a world of meaningful connections.
              Swipe, match, and meet like-minded people.
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
