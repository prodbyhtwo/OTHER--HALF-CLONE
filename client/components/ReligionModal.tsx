import React, { useState } from "react";
import { X } from "lucide-react";

interface ReligionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReligion: string;
  onSave: (religion: string) => void;
}

const RELIGIONS = [
  "Christianity",
  "Islam",
  "Hinduism",
  "Buddhism",
  "Secular/Atheist/Agnostic",
  "Chinese Traditional Religion",
  "Sikhism",
  "Diasporic Religions",
  "Spiritism",
  "Judaism",
  "Bahá'í",
  "Jainism",
  "Shinto",
  "Cao Dai",
  "Other",
];

export default function ReligionModal({
  isOpen,
  onClose,
  selectedReligion,
  onSave,
}: ReligionModalProps) {
  const [tempSelected, setTempSelected] = useState<string>(selectedReligion);

  if (!isOpen) return null;

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
          <h1 className="text-xl font-bold">Religion</h1>
          <div className="w-10" />
        </div>

        {/* Religions Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-wrap gap-3">
            {RELIGIONS.map((religion) => (
              <button
                key={religion}
                onClick={() => setTempSelected(religion)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  tempSelected === religion
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900 border border-gray-200"
                }`}
              >
                {religion}
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
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
