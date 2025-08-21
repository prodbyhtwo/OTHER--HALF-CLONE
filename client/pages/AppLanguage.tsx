import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

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

interface Language {
  id: string;
  name: string;
  flag: React.ReactNode;
}

const LanguageOption: React.FC<{
  language: Language;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ language, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(language.id)}
    className={`flex items-center gap-4 p-4 w-full rounded-lg border transition-colors ${
      isSelected
        ? "border-purple-600 border-2 bg-white"
        : "border-gray-200 bg-white"
    }`}
  >
    <div className="w-15 h-11.25 flex items-center justify-center">
      {language.flag}
    </div>
    <span className="flex-1 text-lg font-semibold text-gray-900 text-left">
      {language.name}
    </span>
    {isSelected && <Check className="w-8 h-8 text-purple-600" />}
  </button>
);

const AppLanguage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("english-us");

  const languages: Language[] = [
    {
      id: "english-us",
      name: "English (US)",
      flag: (
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_us)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H85.5V3.46294H0V0ZM0 6.92578H85.5V10.3887H0V6.92578ZM0 13.8428H85.5V17.3144H0V13.8428ZM0 20.7685H85.5V24.2315H0V20.7685ZM0 27.6943H85.5V31.1572H0V27.6943ZM0 34.6113H85.5V38.0742H0V34.6113ZM0 41.5371H85.5V45H0V41.5371Z"
              fill="#BD3D44"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 3.46289H85.5V6.92573H0V3.46289ZM0 10.3886H85.5V13.8427H0V10.3886ZM0 17.3056H85.5V20.7685H0V17.3056ZM0 24.2314H85.5V27.6943H0V24.2314ZM0 31.1572H85.5V34.62H0V31.1572ZM0 38.0742H85.5V41.5371H0V38.0742Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H34.1982V24.2315H0V0Z"
              fill="#192F5D"
            />
          </g>
          <defs>
            <clipPath id="clip0_us">
              <rect width="60" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: "english-uk",
      name: "English (UK)",
      flag: (
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_uk)">
            <path d="M0 0H60V45H0V0Z" fill="#012169" />
            <path
              d="M7.03125 0L29.9062 16.9688L52.6875 0H60V5.8125L37.5 22.5938L60 39.2812V45H52.5L30 28.2188L7.59375 45H0V39.375L22.4062 22.6875L0 6V0H7.03125Z"
              fill="white"
            />
            <path
              d="M39.75 26.3438L60 41.25V45L34.5938 26.3438H39.75ZM22.5 28.2188L23.0625 31.5L5.0625 45H0L22.5 28.2188ZM60 0V0.28125L36.6562 17.9062L36.8438 13.7812L55.3125 0H60ZM0 0L22.4062 16.5H16.7812L0 3.9375V0Z"
              fill="#C8102E"
            />
            <path
              d="M22.5938 0V45H37.5938V0H22.5938ZM0 15V30H60V15H0Z"
              fill="white"
            />
            <path
              d="M0 18.0938V27.0938H60V18.0938H0ZM25.5938 0V45H34.5938V0H25.5938Z"
              fill="#C8102E"
            />
          </g>
          <defs>
            <clipPath id="clip0_uk">
              <rect width="60" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: "mandarin",
      name: "Mandarin",
      flag: (
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_china)">
            <path d="M0 0H60V45H0V0Z" fill="#DE2910" />
            <path
              d="M7.19997 16.65L11.2499 4.5L15.2999 16.65L4.5 9.225H17.9998L7.19997 16.65Z"
              fill="#FFDE00"
            />
          </g>
          <defs>
            <clipPath id="clip0_china">
              <rect width="60" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: "spanish",
      name: "Spanish",
      flag: (
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0H60V45H0V0Z" fill="#AA151B" />
          <path d="M0 11.25H60V33.75H0V11.25Z" fill="#F1BF00" />
        </svg>
      ),
    },
    {
      id: "hindi",
      name: "Hindi",
      flag: (
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_india)">
            <path d="M0 30H60V45H0V30Z" fill="#128807" />
            <path d="M0 15H60V30H0V15Z" fill="white" />
            <path d="M0 0H60V15H0V0Z" fill="#FF9933" />
            <path
              d="M30 28.5C33.3137 28.5 36 25.8137 36 22.5C36 19.1863 33.3137 16.5 30 16.5C26.6863 16.5 24 19.1863 24 22.5C24 25.8137 26.6863 28.5 30 28.5Z"
              fill="#000088"
            />
          </g>
          <defs>
            <clipPath id="clip0_india">
              <rect width="60" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: "french",
      name: "French",
      flag: (
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_france)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H60V45H0V0Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M40 0H59.9969V45H40V0Z"
              fill="#CE1126"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H19.9969V45H0V0Z"
              fill="#002654"
            />
          </g>
          <defs>
            <clipPath id="clip0_france">
              <rect width="60" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: "arabic",
      name: "Arabic",
      flag: (
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_uae)">
            <path d="M0 30H60V45H0V30Z" fill="black" />
            <path d="M0 15H60V30H0V15Z" fill="white" />
            <path d="M0 0H60V15H0V0Z" fill="#00732F" />
            <path d="M0 0H20.625V45H0V0Z" fill="#FF0000" />
          </g>
          <defs>
            <clipPath id="clip0_uae">
              <rect width="60" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: "russian",
      name: "Russian",
      flag: (
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_russia)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H60V45H0V0Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 15H60V45H0V15Z"
              fill="#0039A6"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 30H60V45H0V30Z"
              fill="#D52B1E"
            />
          </g>
          <defs>
            <clipPath id="clip0_russia">
              <rect width="60" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: "japanese",
      name: "Japanese",
      flag: (
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_japan)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M-3.75 0H63.75V45H-3.75V0Z"
              fill="white"
            />
            <path
              d="M30.0035 36.4894C37.7287 36.4894 43.9913 30.2268 43.9913 22.5015C43.9913 14.7762 37.7287 8.51367 30.0035 8.51367C22.2782 8.51367 16.0156 14.7762 16.0156 22.5015C16.0156 30.2268 22.2782 36.4894 30.0035 36.4894Z"
              fill="#D30000"
            />
          </g>
          <rect x="0.5" y="0.5" width="59" height="44" stroke="#EEEEEE" />
          <defs>
            <clipPath id="clip0_japan">
              <rect width="60" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];

  const handleBack = () => {
    navigate("/settings/app-appearance");
  };

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
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
          App Language
        </h1>
        <div className="w-7 h-7"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        <div className="space-y-4">
          {languages.map((language) => (
            <LanguageOption
              key={language.id}
              language={language}
              isSelected={selectedLanguage === language.id}
              onSelect={handleLanguageSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppLanguage;
