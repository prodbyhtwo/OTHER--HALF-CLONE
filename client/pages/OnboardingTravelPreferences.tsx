import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

const OnboardingTravelPreferences: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const travelPreferences = [
    { name: "Adventure Travel", emoji: "🏞️" },
    { name: "City Breaks", emoji: "🌆" },
    { name: "Cultural Exploration", emoji: "🏛️" },
    { name: "Glamping", emoji: "⛺" },
    { name: "Beach Vacations", emoji: "🏖️" },
    { name: "Nature Escapes", emoji: "🌿" },
    { name: "Relaxing Getaways", emoji: "🏨" },
    { name: "Road Trips", emoji: "🚗" },
    { name: "Food Tourism", emoji: "🍔" },
    { name: "Backpacking", emoji: "���" },
    { name: "Cruise Vacations", emoji: "🚢" },
    { name: "Staycations", emoji: "🏡" },
    { name: "Skiing/Snowboarding", emoji: "⛷️" },
    { name: "Wine Tours", emoji: "🍷" },
    { name: "Wildlife Safaris", emoji: "🦁" },
    { name: "Art Galleries", emoji: "🎨" },
    { name: "Historical Sites", emoji: "🏰" },
    { name: "Eco-Tourism", emoji: "🌿" },
    { name: "Music Festivals", emoji: "🎵" },
    { name: "Culinary Tours", emoji: "🍴" },
    { name: "Yoga Retreats", emoji: "🧘‍♀️" },
    { name: "Group Tours", emoji: "🚌" },
    { name: "Remote Destinations", emoji: "🏞️" },
    { name: "Island Hopping", emoji: "🏝️" },
    { name: "Train Journeys", emoji: "🚆" },
    { name: "Volunteering Abroad", emoji: "🌍" },
    { name: "Solo Travel", emoji: "🚶‍♀️" },
    { name: "Spa Getaways", emoji: "💆‍♀️" },
    { name: "Desert Adventures", emoji: "🌵" },
    { name: "Mountain Retreats", emoji: "🏔️" },
  ];

  const filteredPreferences = travelPreferences.filter((preference) =>
    preference.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference],
    );
  };

  const handleNext = () => {
    navigate("/home");
  };

  const handleBack = () => {
    navigate("/onboarding/book-preferences");
  };

  const PreferenceButton: React.FC<{
    preference: { name: string; emoji: string };
    isSelected: boolean;
    onClick: () => void;
  }> = ({ preference, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
        isSelected
          ? "bg-purple-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <span>{preference.emoji}</span>
      <span>{preference.name}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 pt-2 pb-1">
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
          <div className="w-6 h-3 border border-black rounded-sm">
            <div className="w-full h-full bg-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={handleBack} className="p-2 -ml-2">
          <ArrowLeft size={24} className="text-black" />
        </button>
        <h1 className="text-xl font-bold text-black">Travel Preferences</h1>
        <div className="w-8"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search travel preferences"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Preference Grid */}
        <div className="flex flex-wrap gap-3">
          {filteredPreferences.map((preference) => (
            <PreferenceButton
              key={preference.name}
              preference={preference}
              isSelected={selectedPreferences.includes(preference.name)}
              onClick={() => handlePreferenceToggle(preference.name)}
            />
          ))}
        </div>
      </div>

      {/* OK Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6">
        <button
          onClick={handleNext}
          className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-colors"
        >
          OK ({selectedPreferences.length}/5)
        </button>
      </div>
    </div>
  );
};

export default OnboardingTravelPreferences;
