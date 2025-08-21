import React, { useState } from "react";
import { X, Search } from "lucide-react";

interface LanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguages: string[];
  onSave: (languages: string[]) => void;
}

const AVAILABLE_LANGUAGES = [
  "English 🇺🇸",
  "Chinese 🇨🇳",
  "Hindi 🇮🇳",
  "Arabic 🇸🇦",
  "Bengali 🇧🇩",
  "Spanish 🇪🇸",
  "Portuguese 🇵🇹",
  "Russian 🇷🇺",
  "Japanese 🇯🇵",
  "French 🇫🇷",
  "Punjabi 🇮🇳",
  "German 🇩🇪",
  "Malay 🇲🇾",
  "Telugu 🇮🇳",
  "Urdu 🇵🇰",
  "Turkish 🇹🇷",
  "Marathi 🇮🇳",
  "Tamil 🇮🇳",
  "Korean 🇰🇷",
  "Vietnamese 🇻🇳",
  "Italian 🇮🇹",
  "Thai 🇹🇭",
  "Filipino (Tagalog) 🇵🇭",
  "Swahili 🇰🇪",
  "Dutch 🇳🇱",
  "Polish 🇵🇱",
  "Ukrainian 🇺🇦",
  "Romanian 🇷🇴",
  "Greek 🇬🇷",
  "Nepali 🇳🇵",
  "Hungarian 🇭🇺",
  "Czech 🇨🇿",
  "Danish 🇩🇰",
  "Hebrew 🇮🇱",
  "Swedish 🇸🇪",
  "Finnish 🇫🇮",
  "Norwegian 🇳🇴",
  "Slovak 🇸🇰",
  "Bulgarian 🇧🇬",
];

export default function LanguagesModal({
  isOpen,
  onClose,
  selectedLanguages,
  onSave,
}: LanguagesModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>(selectedLanguages);

  if (!isOpen) return null;

  const filteredLanguages = AVAILABLE_LANGUAGES.filter((language) =>
    language.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleLanguage = (language: string) => {
    setTempSelected((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language],
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
          <h1 className="text-xl font-bold">Languages I Know</h1>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search language"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Languages Grid */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="flex flex-wrap gap-3 pb-6">
            {filteredLanguages.map((language) => (
              <button
                key={language}
                onClick={() => toggleLanguage(language)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  tempSelected.includes(language)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900 border border-gray-200"
                }`}
              >
                {language}
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
