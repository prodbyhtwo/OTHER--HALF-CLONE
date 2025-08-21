import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Wine,
  Cigarette,
  Dumbbell,
  Utensils,
  Instagram,
  Moon,
} from "lucide-react";

const OnboardingLifestyle: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedDrinking, setSelectedDrinking] = useState<string>("");
  const [selectedSmoking, setSelectedSmoking] = useState<string>("");
  const [selectedWorkout, setSelectedWorkout] = useState<string>("");
  const [selectedDiet, setSelectedDiet] = useState<string>("");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<string>("");
  const [selectedSleeping, setSelectedSleeping] = useState<string>("");

  const petOptions = [
    "None",
    "Dog",
    "Cat",
    "Fish",
    "Bird",
    "Rabbit",
    "Hamster",
    "Reptile",
    "Exotic Pet",
    "Other",
  ];
  const drinkingOptions = [
    "Social Drinker",
    "Occasional Drinker",
    "Non-Drinker",
    "Wine Enthusiast",
    "Craft Beer Lover",
    "Cocktail Connoisseur",
  ];
  const smokingOptions = [
    "Smoker",
    "Non-Smoker",
    "Quitter",
    "Occasional Smoker",
    "Vape Enthusiast",
  ];
  const workoutOptions = ["Everyday", "Often", "Sometimes", "Never"];
  const dietOptions = [
    "Vegetarian",
    "Vegan",
    "Omnivore",
    "Pescatarian",
    "Halal",
    "Gluten-Free",
    "Dairy-Free",
    "Plant-Based",
    "Keto",
    "Raw Food",
    "Kosher",
    "Other",
  ];
  const socialMediaOptions = [
    "Active on All",
    "Active on Some",
    "Minimal Social Media Presence",
    "Social Media Influencer",
  ];
  const sleepingOptions = [
    "Early Bird",
    "Night Owl",
    "Regular Sleeper",
    "Insomniac",
  ];

  const handleNext = () => {
    navigate("/onboarding/music-preferences");
  };

  const handleBack = () => {
    navigate("/onboarding/basics");
  };

  const OptionButton: React.FC<{
    text: string;
    isSelected: boolean;
    onClick: () => void;
  }> = ({ text, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isSelected
          ? "bg-purple-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {text}
    </button>
  );

  const Section: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }> = ({ icon, title, children }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
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
        <h1 className="text-xl font-bold text-black">Lifestyle</h1>
        <div className="w-8"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        <Section
          icon={<Heart size={20} className="text-gray-600" />}
          title="Pets"
        >
          {petOptions.map((option) => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedPet === option}
              onClick={() => setSelectedPet(option)}
            />
          ))}
        </Section>

        <Section
          icon={<Wine size={20} className="text-gray-600" />}
          title="Drinking Habits"
        >
          {drinkingOptions.map((option) => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedDrinking === option}
              onClick={() => setSelectedDrinking(option)}
            />
          ))}
        </Section>

        <Section
          icon={<Cigarette size={20} className="text-gray-600" />}
          title="Smoking Habits"
        >
          {smokingOptions.map((option) => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedSmoking === option}
              onClick={() => setSelectedSmoking(option)}
            />
          ))}
        </Section>

        <Section
          icon={<Dumbbell size={20} className="text-gray-600" />}
          title="Workout"
        >
          {workoutOptions.map((option) => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedWorkout === option}
              onClick={() => setSelectedWorkout(option)}
            />
          ))}
        </Section>

        <Section
          icon={<Utensils size={20} className="text-gray-600" />}
          title="Dietary Preferences"
        >
          {dietOptions.map((option) => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedDiet === option}
              onClick={() => setSelectedDiet(option)}
            />
          ))}
        </Section>

        <Section
          icon={<Instagram size={20} className="text-gray-600" />}
          title="Social Media Presence"
        >
          {socialMediaOptions.map((option) => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedSocialMedia === option}
              onClick={() => setSelectedSocialMedia(option)}
            />
          ))}
        </Section>

        <Section
          icon={<Moon size={20} className="text-gray-600" />}
          title="Sleeping Habits"
        >
          {sleepingOptions.map((option) => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedSleeping === option}
              onClick={() => setSelectedSleeping(option)}
            />
          ))}
        </Section>
      </div>

      {/* OK Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6">
        <button
          onClick={handleNext}
          className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default OnboardingLifestyle;
