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

// Birthday Cake SVG Component
const BirthdayCake = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    className="mx-auto"
  >
    <g clipPath="url(#clip0_6731_3958)">
      <path
        d="M60 120C93.1371 120 120 105.076 120 86.6666C120 68.2572 93.1371 53.3333 60 53.3333C26.8629 53.3333 0 68.2572 0 86.6666C0 105.076 26.8629 120 60 120Z"
        fill="#8899A6"
      />
      <path
        d="M60 114.167C93.1371 114.167 120 99.2428 120 80.8333C120 62.4238 93.1371 47.5 60 47.5C26.8629 47.5 0 62.4238 0 80.8333C0 99.2428 26.8629 114.167 60 114.167Z"
        fill="#CCD6DD"
      />
      <path
        d="M108.919 78.95C108.919 93.15 87.0193 104.657 60.0026 104.657C32.9859 104.657 11.0859 93.15 11.0859 78.95C11.0859 64.7566 32.9859 53.2466 60.0026 53.2466C87.0159 53.2466 108.919 64.7566 108.919 78.95Z"
        fill="#DD2E44"
      />
      <path
        d="M107.441 75.1433C107.441 107.99 12.5547 107.99 12.5547 75.1433V45.9467H107.441V75.1433Z"
        fill="#F4ABBA"
      />
      <path
        d="M59.9467 60.5534C30 60.5534 12.5533 46.78 12.5533 46.78C12.5533 46.78 12.5 49.86 12.5 52.3967C12.5 52.3967 12.6067 68.7234 21.0733 68.7234C29.27 68.7234 28.6733 76.55 33.8533 77.36C38.99 78.1634 39.56 74.2334 45.9367 74.2334C52.3133 74.2334 53.4367 81.2534 59.9467 81.2534C67.5767 81.2534 68.2033 74.2334 74.5767 74.2334C80.95 74.2334 81.6833 78.3134 85.8633 77.1834C90.8867 75.8234 88.5767 68.7267 98.82 68.7267C107.287 68.7267 107.497 53.2334 107.497 53.2334C107.497 50.7 107.44 46.7834 107.44 46.7834C107.44 46.7834 89.8967 60.5534 59.9467 60.5534Z"
        fill="#DD2E44"
      />
      <path
        d="M108.919 42.4567C108.919 56.6533 87.0193 68.1633 60.0026 68.1633C32.9859 68.1633 11.0859 56.6533 11.0859 42.4567C11.0859 28.26 32.9859 16.75 60.0026 16.75C87.0159 16.75 108.919 28.26 108.919 42.4567Z"
        fill="#EA596E"
      />
      <path
        d="M60.0016 56.8933C57.9849 56.8933 56.3516 55.26 56.3516 53.2433V27.7C56.3516 27.2207 56.446 26.746 56.6294 26.3032C56.8128 25.8604 57.0817 25.458 57.4206 25.119C57.7596 24.7801 58.1619 24.5113 58.6048 24.3278C59.0476 24.1444 59.5222 24.05 60.0016 24.05C60.4809 24.05 60.9555 24.1444 61.3984 24.3278C61.8412 24.5113 62.2436 24.7801 62.5825 25.119C62.9214 25.458 63.1903 25.8604 63.3737 26.3032C63.5572 26.746 63.6516 27.2207 63.6516 27.7V53.2467C63.6516 55.26 62.0182 56.8933 60.0016 56.8933Z"
        fill="#FFF8E8"
      />
      <path
        d="M85.5484 45.9466C83.5318 45.9466 81.8984 44.3133 81.8984 42.2966V16.75C81.8984 15.7819 82.283 14.8535 82.9675 14.169C83.652 13.4845 84.5804 13.1 85.5484 13.1C86.5165 13.1 87.4449 13.4845 88.1294 14.169C88.8139 14.8535 89.1984 15.7819 89.1984 16.75V42.2966C89.1984 44.3133 87.5651 45.9466 85.5484 45.9466Z"
        fill="#FFF8E8"
      />
      <path
        d="M34.4547 45.9466C32.438 45.9466 30.8047 44.3133 30.8047 42.2966V16.75C30.8047 16.2707 30.8991 15.796 31.0825 15.3532C31.266 14.9103 31.5348 14.508 31.8737 14.169C32.2127 13.8301 32.6151 13.5612 33.0579 13.3778C33.5007 13.1944 33.9754 13.1 34.4547 13.1C34.934 13.1 35.4086 13.1944 35.8515 13.3778C36.2943 13.5612 36.6967 13.8301 37.0356 14.169C37.3746 14.508 37.6434 14.9103 37.8268 15.3532C38.0103 15.796 38.1047 16.2707 38.1047 16.75V42.2966C38.1047 44.3133 36.4714 45.9466 34.4547 45.9466Z"
        fill="#FFF8E8"
      />
      <path
        d="M59.9963 33.1734C56.123 33.1734 53.0763 31.4 51.8463 28.43C50.7763 25.8534 50.2496 20.2634 58.7063 11.81C58.8756 11.6405 59.0767 11.506 59.2981 11.4143C59.5194 11.3225 59.7567 11.2753 59.9963 11.2753C60.2359 11.2753 60.4732 11.3225 60.6945 11.4143C60.9159 11.506 61.1169 11.6405 61.2863 11.81C69.743 20.2667 69.213 25.8534 68.1463 28.43C66.9163 31.4 63.8696 33.1734 59.9963 33.1734Z"
        fill="#FAAA35"
      />
      <path
        d="M85.5495 22.2233C81.6762 22.2233 78.6295 20.45 77.3995 17.48C76.3328 14.9033 75.8028 9.31334 84.2595 0.860007C84.4289 0.690483 84.6299 0.555998 84.8513 0.464241C85.0726 0.372485 85.3099 0.325256 85.5495 0.325256C85.7891 0.325256 86.0264 0.372485 86.2477 0.464241C86.4691 0.555998 86.6702 0.690483 86.8395 0.860007C95.2962 9.31667 94.7662 14.9033 93.6995 17.48C92.4695 20.45 89.4228 22.2233 85.5495 22.2233Z"
        fill="#FAAA35"
      />
      <path
        d="M34.4572 22.2233C30.5839 22.2233 27.5372 20.45 26.3072 17.48C25.2372 14.9033 24.7106 9.31334 33.1672 0.860007C33.3366 0.690483 33.5377 0.555998 33.759 0.464241C33.9804 0.372485 34.2176 0.325256 34.4572 0.325256C34.6968 0.325256 34.9341 0.372485 35.1555 0.464241C35.3768 0.555998 35.5779 0.690483 35.7472 0.860007C44.2039 9.31667 43.6739 14.9033 42.6072 17.48C41.3772 20.45 38.3306 22.2233 34.4572 22.2233Z"
        fill="#FAAA35"
      />
    </g>
    <defs>
      <clipPath id="clip0_6731_3958">
        <rect width="120" height="120" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function OnboardingBirthdate() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const isFormValid = month && day && year && year.length === 4;

  const handleContinue = () => {
    if (isFormValid) {
      navigate("/onboarding/gender");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      if (parseInt(value) > 12) value = "12";
      if (parseInt(value) < 1 && value.length === 2) value = "01";
      setMonth(value);
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      if (parseInt(value) > 31) value = "31";
      if (parseInt(value) < 1 && value.length === 2) value = "01";
      setDay(value);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setYear(value);
    }
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
          <div className="w-1/3 h-full bg-[#9610FF] rounded-full"></div>
        </div>

        <div className="w-7 h-7"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-3">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 text-[32px] font-bold leading-[51px] mb-3">
            Let's celebrate you 🎂
          </h1>
          <p className="text-gray-500 text-lg leading-[29px] tracking-wide">
            Tell us your birthdate. Your profile does not display your
            birthdate, only your age.
          </p>
        </div>

        {/* Birthday Section */}
        <div className="flex flex-col items-center gap-8 mb-6">
          {/* Birthday Cake Icon */}
          <BirthdayCake />

          {/* Date Input Fields */}
          <div className="flex items-center gap-3 w-full">
            {/* Month */}
            <div className="flex-1">
              <input
                type="text"
                value={month}
                onChange={handleMonthChange}
                placeholder="MM"
                className="w-full text-center text-[32px] font-bold text-gray-900 bg-transparent outline-none placeholder-gray-400"
                maxLength={2}
              />
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-gray-200"></div>

            {/* Day */}
            <div className="flex-1">
              <input
                type="text"
                value={day}
                onChange={handleDayChange}
                placeholder="DD"
                className="w-full text-center text-[32px] font-bold text-gray-900 bg-transparent outline-none placeholder-gray-400"
                maxLength={2}
              />
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-gray-200"></div>

            {/* Year */}
            <div className="flex-1">
              <input
                type="text"
                value={year}
                onChange={handleYearChange}
                placeholder="YYYY"
                className="w-full text-center text-[32px] font-bold text-gray-900 bg-transparent outline-none placeholder-gray-400"
                maxLength={4}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6 pt-6 pb-9 border-t border-gray-100 bg-white">
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-full text-white text-base font-bold transition-colors ${
            isFormValid
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
