import React, { useState } from "react";
import { X, Search } from "lucide-react";

interface InterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInterests: string[];
  onSave: (interests: string[]) => void;
}

const AVAILABLE_INTERESTS = [
  "Travel ✈️",
  "Cooking 🍳",
  "Hiking 🏞️",
  "Yoga 🧘",
  "Gaming 🎮",
  "Movies 🎥",
  "Photography 📷",
  "Music 🎵",
  "Pets 🐱",
  "Painting 🎨",
  "Art 🎨",
  "Fitness 💪",
  "Reading 📖",
  "Dancing 💃",
  "Sports 🏀",
  "Board Games 🎲",
  "Technology 📱",
  "Fashion 👗",
  "Motorcycling 🏍️",
  "Science 🔬",
  "History 📜",
  "Nature 🌿",
  "Adventure 🌄",
  "Gardening 🌻",
  "Foodie 🍽️",
  "Writing ✍️",
  "Poetry 📝",
  "Astronomy 🔭",
  "Sustainable Living 🌱",
  "Film Production 🎬",
  "Meditation 🧘‍♂️",
  "Comedy 😄",
  "Volunteering 🤝",
  "DIY Projects 🛠️",
  "Art History 🏛️",
  "Philosophy 🧠",
  "Snowboarding 🏂",
  "Wine Tasting 🍷",
  "Collectibles 🎩",
  "Sailing ⛵",
  "Karaoke 🎤",
  "Surfing 🏄",
  "Scuba Diving 🌊",
  "Skydiving 🪂",
  "Pottery 🏺",
  "Wildlife Conservation 🦁",
  "Ghost Hunting 👻",
  "Geocaching 🌐",
  "Stand-up Comedy 🎙️",
  "Motor Racing 🏁",
  "Paranormal Investigation 🕵️‍♂️",
];

export default function InterestsModal({
  isOpen,
  onClose,
  selectedInterests,
  onSave,
}: InterestsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>(selectedInterests);

  if (!isOpen) return null;

  const filteredInterests = AVAILABLE_INTERESTS.filter((interest) =>
    interest.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleInterest = (interest: string) => {
    setTempSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleSave = () => {
    onSave(tempSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md h-full max-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Interests</h1>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search interest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Interests Grid */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="flex flex-wrap gap-3 pb-6">
            {filteredInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  tempSelected.includes(interest)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900 border border-gray-200"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold"
          >
            OK ({tempSelected.length}/5)
          </button>
        </div>
      </div>
    </div>
  );
}
