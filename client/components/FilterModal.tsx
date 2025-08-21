import React, { useState, useRef } from "react";
import { X, ChevronRight } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

interface FilterState {
  distanceRange: number;
  ageRange: [number, number];
  minPhotos: number;
  showMe: "men" | "women";
  relationshipGoals: string[];
  hasBio: boolean;
  interests: string[];
  basics: {
    zodiac: string;
    education: string;
    familyPlans: string;
    covidVaccine: string;
    personalityType: string;
    communicationStyle: string;
    loveStyle: string;
    bloodType: string;
  };
  lifestyle: {
    pets: string;
    drinkingHabits: string;
    smokingHabits: string;
    workout: string;
    dietaryPreferences: string;
    socialMediaPresence: string;
    sleepingHabits: string;
  };
}

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

const RangeSlider: React.FC<{
  value: number;
  max: number;
  onChange: (value: number) => void;
}> = ({ value, max, onChange }) => {
  return (
    <div className="relative w-full h-6 flex items-center">
      <div className="w-full h-1.5 bg-gray-200 rounded-full relative">
        <div
          className="h-1.5 bg-[#9610FF] rounded-full"
          style={{ width: `${(value / max) * 100}%` }}
        />
        <div
          className="absolute w-6 h-6 bg-white border-[5px] border-[#9610FF] rounded-full cursor-pointer"
          style={{ left: `calc(${(value / max) * 100}% - 12px)`, top: "-9px" }}
          onPointerDown={(e) => {
            e.preventDefault();
            const track = e.currentTarget.parentElement;
            if (!track) return;

            const handlePointerMove = (e: PointerEvent) => {
              const rect = track.getBoundingClientRect();
              const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
              const newValue = Math.round((x / rect.width) * max);
              onChange(newValue);
            };

            const handlePointerUp = () => {
              document.removeEventListener("pointermove", handlePointerMove);
              document.removeEventListener("pointerup", handlePointerUp);
            };

            document.addEventListener("pointermove", handlePointerMove);
            document.addEventListener("pointerup", handlePointerUp);

            // Handle initial click
            handlePointerMove(e.nativeEvent);
          }}
        />
      </div>
    </div>
  );
};

const DualRangeSlider: React.FC<{
  value: [number, number];
  min: number;
  max: number;
  onChange: (value: [number, number]) => void;
}> = ({ value, min, max, onChange }) => {
  const [dragHandle, setDragHandle] = useState<"min" | "max" | null>(null);

  const handleMouseDown = (handle: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragHandle(handle);

    const slider = e.currentTarget.parentElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (slider) {
        const rect = slider.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const newValue = Math.round((x / rect.width) * (max - min) + min);

        if (handle === "min" && newValue <= value[1]) {
          onChange([newValue, value[1]]);
        } else if (handle === "max" && newValue >= value[0]) {
          onChange([value[0], newValue]);
        }
      }
    };

    const handleMouseUp = () => {
      setDragHandle(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative w-full h-6 flex items-center">
      <div className="w-full h-1.5 bg-gray-200 rounded-full relative">
        <div
          className="h-1.5 bg-[#9610FF] rounded-full absolute"
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            width: `${((value[1] - value[0]) / (max - min)) * 100}%`,
          }}
        />
        {/* Min handle */}
        <div
          className="absolute w-6 h-6 bg-white border-[5px] border-[#9610FF] rounded-full cursor-pointer z-10"
          style={{
            left: `calc(${((value[0] - min) / (max - min)) * 100}% - 12px)`,
            top: "-9px",
          }}
          onMouseDown={handleMouseDown("min")}
        />
        {/* Max handle */}
        <div
          className="absolute w-6 h-6 bg-white border-[5px] border-[#9610FF] rounded-full cursor-pointer z-10"
          style={{
            left: `calc(${((value[1] - min) / (max - min)) * 100}% - 12px)`,
            top: "-9px",
          }}
          onMouseDown={handleMouseDown("max")}
        />
      </div>
    </div>
  );
};

const Chip: React.FC<{
  label: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-base font-bold transition-colors ${
      isSelected
        ? "bg-[#9610FF] text-white"
        : "bg-white border border-gray-300 text-gray-900"
    }`}
  >
    {label}
  </button>
);

const RadioButton: React.FC<{
  label: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ label, isSelected, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-4">
    <div
      className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center ${
        isSelected ? "border-[#9610FF]" : "border-gray-300"
      }`}
    >
      {isSelected && <div className="w-3 h-3 bg-[#9610FF] rounded-full" />}
    </div>
    <span className="text-lg font-bold text-gray-900">{label}</span>
  </button>
);

const Checkbox: React.FC<{
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ isChecked, onChange }) => (
  <button
    onClick={() => onChange(!isChecked)}
    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
      isChecked ? "bg-[#9610FF]" : "border-2 border-gray-300 bg-white"
    }`}
  >
    {isChecked && (
      <svg
        className="w-3 h-2.5 text-white"
        fill="currentColor"
        viewBox="0 0 12 10"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0607 0.93934C12.6464 1.52513 12.6464 2.47487 12.0607 3.06066L6.06066 9.06066C5.47487 9.64645 4.52513 9.64645 3.93934 9.06066L0.93934 6.06066C0.353553 5.47487 0.353553 4.52513 0.93934 3.93934C1.52513 3.35355 2.47487 3.35355 3.06066 3.93934L5 5.87868L9.93934 0.93934C10.5251 0.353553 11.4749 0.353553 12.0607 0.93934Z"
        />
      </svg>
    )}
  </button>
);

const ExpandableSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between"
      >
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <ChevronRight
          className={`w-6 h-6 text-gray-900 transition-transform ${isExpanded ? "rotate-90" : ""}`}
        />
      </button>
      {isExpanded && (
        <>
          <div className="px-4">
            <div className="w-full h-px bg-gray-200" />
          </div>
          <div className="p-4 space-y-6">{children}</div>
        </>
      )}
    </div>
  );
};

const BasicOption: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}> = ({ icon, label, value, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-6 w-full">
    <div className="flex items-center gap-3 flex-1">
      {icon}
      <span className="text-lg font-bold text-gray-900">{label}</span>
    </div>
    <div className="flex items-center gap-2.5">
      <span className="text-base font-bold text-gray-400">{value}</span>
      <ChevronRight className="w-6 h-6 text-gray-900" />
    </div>
  </button>
);

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    distanceRange: 200,
    ageRange: [20, 25],
    minPhotos: 4,
    showMe: "women",
    relationshipGoals: ["Dating 👩‍❤️‍👨"],
    hasBio: true,
    interests: ["Travel ✈️", "Movies 🎥"],
    basics: {
      zodiac: "",
      education: "",
      familyPlans: "",
      covidVaccine: "",
      personalityType: "",
      communicationStyle: "",
      loveStyle: "",
      bloodType: "",
    },
    lifestyle: {
      pets: "",
      drinkingHabits: "",
      smokingHabits: "",
      workout: "",
      dietaryPreferences: "",
      socialMediaPresence: "",
      sleepingHabits: "",
    },
  });

  const relationshipGoalOptions = [
    "Dating 👩‍❤️‍👨",
    "Friendship 🙌",
    "Casual 😄",
    "Serious Relationship 💍",
    "Networking 🤝",
    "Open to Options 🌟",
    "Exploration 🌍",
  ];

  const interestOptions = [
    "Travel ✈️",
    "Sports 🏀",
    "Music 🎵",
    "Reading 📚",
    "Movies 🎥",
    "Cooking 🍳",
  ];

  const toggleRelationshipGoal = (goal: string) => {
    setFilters((prev) => ({
      ...prev,
      relationshipGoals: prev.relationshipGoals.includes(goal)
        ? prev.relationshipGoals.filter((g) => g !== goal)
        : [...prev.relationshipGoals, goal],
    }));
  };

  const toggleInterest = (interest: string) => {
    setFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const resetFilters = () => {
    setFilters({
      distanceRange: 200,
      ageRange: [18, 35],
      minPhotos: 1,
      showMe: "women",
      relationshipGoals: [],
      hasBio: false,
      interests: [],
      basics: {
        zodiac: "",
        education: "",
        familyPlans: "",
        covidVaccine: "",
        personalityType: "",
        communicationStyle: "",
        loveStyle: "",
        bloodType: "",
      },
      lifestyle: {
        pets: "",
        drinkingHabits: "",
        smokingHabits: "",
        workout: "",
        dietaryPreferences: "",
        socialMediaPresence: "",
        sleepingHabits: "",
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-[430px] mx-auto h-full bg-white rounded-t-[28px] flex flex-col">
          <MobileStatusBar />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
            <div className="w-7" />
            <h1 className="text-2xl font-bold text-gray-900">Filter & Show</h1>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center"
            >
              <X className="w-7 h-7 text-gray-900" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Handle bar */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />

            {/* Distance Range */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Distance Range
                </h3>
                <span className="text-xl font-medium text-gray-600">
                  {filters.distanceRange} km
                </span>
              </div>
              <RangeSlider
                value={filters.distanceRange}
                max={300}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, distanceRange: value }))
                }
              />
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* Age Range */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Age Range</h3>
                <span className="text-xl font-medium text-gray-600">
                  {filters.ageRange[0]} - {filters.ageRange[1]}
                </span>
              </div>
              <DualRangeSlider
                value={filters.ageRange}
                min={18}
                max={65}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, ageRange: value }))
                }
              />
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* Minimum Number of Photos */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-gray-900">
                Minimum Number of Photos
              </h3>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <Chip
                    key={num}
                    label={num.toString()}
                    isSelected={filters.minPhotos === num}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, minPhotos: num }))
                    }
                  />
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* Show Me */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-gray-900">Show Me</h3>
              <div className="flex gap-7">
                <RadioButton
                  label="Men"
                  isSelected={filters.showMe === "men"}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, showMe: "men" }))
                  }
                />
                <RadioButton
                  label="Women"
                  isSelected={filters.showMe === "women"}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, showMe: "women" }))
                  }
                />
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* Relationship Goals */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Relationship Goals
              </h3>
              <div className="flex flex-wrap gap-3">
                {relationshipGoalOptions.map((goal) => (
                  <Chip
                    key={goal}
                    label={goal}
                    isSelected={filters.relationshipGoals.includes(goal)}
                    onClick={() => toggleRelationshipGoal(goal)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* Has a Bio */}
            <div className="flex items-center gap-4">
              <Checkbox
                isChecked={filters.hasBio}
                onChange={(checked) =>
                  setFilters((prev) => ({ ...prev, hasBio: checked }))
                }
              />
              <h3 className="text-xl font-bold text-gray-900 flex-1">
                Has a Bio
              </h3>
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* Interests */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-gray-900">Interests</h3>
              <div className="flex flex-wrap gap-3">
                {interestOptions.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    isSelected={filters.interests.includes(interest)}
                    onClick={() => toggleInterest(interest)}
                  />
                ))}
              </div>
              <button className="text-[#9610FF] text-lg font-bold">
                See all interests
              </button>
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* Basics */}
            <ExpandableSection title="Basics">
              <div className="space-y-6">
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">🌙</div>}
                  label="Zodiac"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">🎓</div>}
                  label="Education"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">👶</div>}
                  label="Family Plans"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">💊</div>}
                  label="COVID Vaccine"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">🧩</div>}
                  label="Personality Type"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">💬</div>}
                  label="Communication Style"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">❤️</div>}
                  label="Love Style"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">🩸</div>}
                  label="Blood Type"
                  value="Select"
                  onClick={() => {}}
                />
              </div>
            </ExpandableSection>

            {/* Lifestyle */}
            <ExpandableSection title="Lifestyle">
              <div className="space-y-6">
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">🐾</div>}
                  label="Pets"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">🍷</div>}
                  label="Drinking Habits"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">🚭</div>}
                  label="Smoking Habits"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">💪</div>}
                  label="Workout"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">🍔</div>}
                  label="Dietary Preferences"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">📱</div>}
                  label="Social Media Presence"
                  value="Select"
                  onClick={() => {}}
                />
                <BasicOption
                  icon={<div className="w-6 h-6 text-gray-900">🛏️</div>}
                  label="Sleeping Habits"
                  value="Select"
                  onClick={() => {}}
                />
              </div>
            </ExpandableSection>
          </div>

          {/* Bottom buttons */}
          <div className="px-6 py-6 pb-9 border-t border-gray-100 bg-white">
            <div className="flex gap-4">
              <button
                onClick={resetFilters}
                className="flex-1 py-4 rounded-full text-[#9610FF] text-base font-bold bg-[#F7ECFF] transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  onApply(filters);
                  onClose();
                }}
                className="flex-1 py-4 rounded-full text-white text-base font-bold bg-[#9610FF] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
