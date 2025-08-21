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

// Floating hearts for background animation
const FloatingHeart = ({
  size = "w-4 h-4",
  opacity = "opacity-30",
  delay = "0s",
  duration = "3s",
  x = "50%",
  y = "50%",
}) => (
  <div
    className={`absolute ${size} ${opacity} animate-bounce`}
    style={{
      left: x,
      top: y,
      animationDelay: delay,
      animationDuration: duration,
    }}
  >
    <svg viewBox="0 0 24 24" fill="#9610FF" className="w-full h-full">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </div>
);

// Phone mockup component showing the match success screen
const MatchPhoneMockup = () => (
  <div className="relative w-full max-w-sm mx-auto">
    {/* Phone Frame */}
    <div className="relative w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
      {/* Phone Screen Content */}
      <div className="bg-gray-100 relative">
        {/* Status Bar (inside phone) - blurred background */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-black text-sm font-semibold bg-gray-200 backdrop-blur-sm">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex items-end gap-1">
              <div className="w-1 h-2 bg-gray-600 rounded-sm"></div>
              <div className="w-1 h-3 bg-gray-600 rounded-sm"></div>
              <div className="w-1 h-4 bg-gray-600 rounded-sm"></div>
              <div className="w-1 h-5 bg-gray-600 rounded-sm"></div>
            </div>
            <svg className="w-4 h-3 ml-2" viewBox="0 0 16 11" fill="gray">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
              />
            </svg>
            <div className="ml-2 w-7 h-3 border border-gray-600 border-opacity-35 rounded-sm relative">
              <div className="absolute inset-0.5 bg-gray-600 rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-black rounded-full"></div>

        {/* Blurred App Header */}
        <div className="bg-gray-200 backdrop-blur-sm p-4 text-center">
          <div className="text-gray-600 font-medium">Dating</div>
        </div>

        {/* Match Success Content */}
        <div className="bg-white relative px-6 py-8 min-h-[400px] flex flex-col items-center justify-center">
          {/* Floating Hearts Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <FloatingHeart
              x="15%"
              y="20%"
              size="w-6 h-6"
              opacity="opacity-20"
              delay="0s"
              duration="2s"
            />
            <FloatingHeart
              x="85%"
              y="30%"
              size="w-4 h-4"
              opacity="opacity-30"
              delay="0.5s"
              duration="2.5s"
            />
            <FloatingHeart
              x="25%"
              y="70%"
              size="w-3 h-3"
              opacity="opacity-25"
              delay="1s"
              duration="3s"
            />
            <FloatingHeart
              x="75%"
              y="15%"
              size="w-5 h-5"
              opacity="opacity-20"
              delay="1.5s"
              duration="2.2s"
            />
            <FloatingHeart
              x="10%"
              y="60%"
              size="w-4 h-4"
              opacity="opacity-15"
              delay="2s"
              duration="2.8s"
            />
            <FloatingHeart
              x="90%"
              y="80%"
              size="w-3 h-3"
              opacity="opacity-25"
              delay="0.3s"
              duration="2.6s"
            />
            <FloatingHeart
              x="50%"
              y="10%"
              size="w-4 h-4"
              opacity="opacity-20"
              delay="1.2s"
              duration="2.4s"
            />
            <FloatingHeart
              x="60%"
              y="90%"
              size="w-5 h-5"
              opacity="opacity-15"
              delay="1.8s"
              duration="3.2s"
            />
          </div>

          {/* Heart-shaped photos */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="relative">
              {/* Left heart */}
              <div className="w-24 h-24 relative">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <clipPath id="heartClip1">
                      <path d="M50 85c-7-7-25-20-25-35 0-15 10-25 25-25s25 10 25 25c0 15-18 28-25 35z" />
                    </clipPath>
                  </defs>
                  <image
                    href="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                    width="100"
                    height="100"
                    clipPath="url(#heartClip1)"
                  />
                  <path
                    d="M50 85c-7-7-25-20-25-35 0-15 10-25 25-25s25 10 25 25c0 15-18 28-25 35z"
                    fill="none"
                    stroke="#9610FF"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* Right heart - overlapping */}
              <div className="w-24 h-24 absolute top-0 left-12">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <clipPath id="heartClip2">
                      <path d="M50 85c-7-7-25-20-25-35 0-15 10-25 25-25s25 10 25 25c0 15-18 28-25 35z" />
                    </clipPath>
                  </defs>
                  <image
                    href="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
                    width="100"
                    height="100"
                    clipPath="url(#heartClip2)"
                  />
                  <path
                    d="M50 85c-7-7-25-20-25-35 0-15 10-25 25-25s25 10 25 25c0 15-18 28-25 35z"
                    fill="none"
                    stroke="#9610FF"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Match Text */}
          <div className="text-center relative z-10">
            <h2 className="text-2xl font-bold text-[#9610FF] mb-3">
              You Got the Match!
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              You both liked each other. Take charge and start a meaningful
              conversation.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Progress indicators component (step 3 of 3)
const ProgressIndicators = () => (
  <div className="flex justify-center items-center gap-2">
    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
    <div className="w-8 h-2 bg-[#9610FF] rounded-full"></div>
  </div>
);

export default function Walkthrough3() {
  const [currentStep] = useState(3);

  return (
    <div className="min-h-screen bg-[#9610FF] relative overflow-hidden flex flex-col">
      {/* Mobile Status Bar */}
      <MobileStatusBar />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Phone Mockup Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <MatchPhoneMockup />
      </div>

      {/* Bottom Content Overlay */}
      <div className="bg-white rounded-t-[2rem] shadow-lg">
        <div className="px-6 py-8 pb-12 space-y-6">
          {/* Title and Description */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Find Your Perfect Match Today
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover real connections with Datify's intelligent matchmaking.
              Start swiping to find your perfect match today.
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="py-4">
            <ProgressIndicators />
          </div>
        </div>

        {/* Bottom Button */}
        <div className="border-t border-gray-100 bg-white px-6 py-6 pb-12">
          <button className="w-full bg-[#9610FF] text-white font-bold py-4 px-6 rounded-full text-center text-lg hover:bg-purple-700 transition-colors">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
