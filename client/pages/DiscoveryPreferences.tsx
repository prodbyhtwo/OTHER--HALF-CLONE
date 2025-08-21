import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";

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

export default function DiscoveryPreferences() {
  const navigate = useNavigate();
  const [goGlobal, setGoGlobal] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [maxDistance, setMaxDistance] = useState(200);
  const [ageRange, setAgeRange] = useState([20, 25]);

  return (
    <div className="min-h-screen bg-white">
      <MobileStatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Discovery Preferences</h1>
        <div className="w-10" />
      </div>

      <div className="px-6 pb-20 space-y-6">
        {/* Location */}
        <button className="w-full text-left">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Location
              </h3>
              <p className="text-base text-gray-600">
                Change your location to find datify members in other cities.
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 mt-1" />
          </div>
        </button>

        {/* Go Global */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Go Global
            </h3>
            <p className="text-base text-gray-600">
              Going global will allow you to see people from all over the world.
            </p>
          </div>
          <button
            onClick={() => setGoGlobal(!goGlobal)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              goGlobal ? "bg-purple-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`${
                goGlobal ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </button>
        </div>

        {/* Show Me */}
        <button className="w-full flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-900">Show Me</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">Women</span>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </button>

        {/* Show Distances in */}
        <div className="p-4 border border-gray-200 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Show Distances in
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setDistanceUnit("km")}
              className={`flex-1 py-2 px-5 rounded-full text-base font-semibold ${
                distanceUnit === "km"
                  ? "bg-purple-600 text-white"
                  : "border border-gray-300 text-gray-900"
              }`}
            >
              Km.
            </button>
            <button
              onClick={() => setDistanceUnit("mi")}
              className={`flex-1 py-2 px-5 rounded-full text-base font-semibold ${
                distanceUnit === "mi"
                  ? "bg-purple-600 text-white"
                  : "border border-gray-300 text-gray-900"
              }`}
            >
              Mi.
            </button>
          </div>
        </div>

        {/* Distance Range */}
        <div className="p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-900">
              Distance Range
            </h3>
            <span className="text-xl font-medium text-gray-700">
              {maxDistance} km
            </span>
          </div>

          <div className="relative mb-4">
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div
                className="h-1.5 bg-purple-600 rounded-full"
                style={{ width: `${(maxDistance / 500) * 100}%` }}
              ></div>
            </div>
            <div
              className="absolute w-6 h-6 bg-white border-4 border-purple-600 rounded-full top-1/2 transform -translate-y-1/2 cursor-pointer"
              style={{
                left: `${(maxDistance / 500) * 100}%`,
                marginLeft: "-12px",
              }}
            ></div>
          </div>

          <p className="text-base text-gray-600">
            Set the maximum distance for potential matches.
          </p>
        </div>

        {/* Age Range */}
        <div className="p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-900">Age Range</h3>
            <span className="text-xl font-medium text-gray-700">
              {ageRange[0]} - {ageRange[1]}
            </span>
          </div>

          <div className="relative mb-4">
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div
                className="h-1.5 bg-purple-600 rounded-full absolute"
                style={{
                  left: `${((ageRange[0] - 18) / (65 - 18)) * 100}%`,
                  width: `${((ageRange[1] - ageRange[0]) / (65 - 18)) * 100}%`,
                }}
              ></div>
            </div>
            <div
              className="absolute w-6 h-6 bg-white border-4 border-purple-600 rounded-full top-1/2 transform -translate-y-1/2 cursor-pointer"
              style={{
                left: `${((ageRange[0] - 18) / (65 - 18)) * 100}%`,
                marginLeft: "-12px",
              }}
            ></div>
            <div
              className="absolute w-6 h-6 bg-white border-4 border-purple-600 rounded-full top-1/2 transform -translate-y-1/2 cursor-pointer"
              style={{
                left: `${((ageRange[1] - 18) / (65 - 18)) * 100}%`,
                marginLeft: "-12px",
              }}
            ></div>
          </div>

          <p className="text-base text-gray-600">
            Define the preferred age range for potential matches.
          </p>
        </div>
      </div>
    </div>
  );
}
