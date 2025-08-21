import React, { useState } from "react";
import { X } from "lucide-react";

interface RelationshipGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGoal: string;
  onSave: (goal: string) => void;
}

const RELATIONSHIP_GOALS = [
  {
    id: "dating",
    title: "Dating 👩‍❤️‍👨",
    description:
      "Seeking love and meaningful connections? Choose dating for genuine relationships.",
  },
  {
    id: "friendship",
    title: "Friendship 🙌",
    description:
      "Expand your social circle and make new friends. Opt for friendship today.",
  },
  {
    id: "casual",
    title: "Casual 😄",
    description:
      "Looking for fun and relaxed encounters? Select casual for carefree connections.",
  },
  {
    id: "serious",
    title: "Serious Relationship 💍",
    description:
      "Ready for commitment and a lasting partnership? Pick serious relationship.",
  },
  {
    id: "open",
    title: "Open to Options 🌟",
    description:
      "Explore various connections and keep your options open with this choice.",
  },
  {
    id: "networking",
    title: "Networking 🤝",
    description:
      "Connect professionally and expand your network. Choose networking now.",
  },
  {
    id: "exploration",
    title: "Exploration 🌍",
    description:
      "Embark on a journey of discovery. Select exploration for new experiences.",
  },
];

export default function RelationshipGoalsModal({
  isOpen,
  onClose,
  selectedGoal,
  onSave,
}: RelationshipGoalsModalProps) {
  const [tempSelected, setTempSelected] = useState<string>(selectedGoal);

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
          <h1 className="text-xl font-bold">Relationship Goals</h1>
          <div className="w-10" />
        </div>

        {/* Goals List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {RELATIONSHIP_GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setTempSelected(goal.id)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  tempSelected === goal.id
                    ? "border-2 border-purple-600 bg-white"
                    : "border border-gray-200 bg-white"
                }`}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {goal.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {goal.description}
                </p>
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
