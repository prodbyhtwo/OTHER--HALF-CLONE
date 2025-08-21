import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Users,
  Shield,
  Brain,
  MessageCircle,
  Heart,
  Droplet,
} from "lucide-react";

const OnboardingBasics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedZodiac, setSelectedZodiac] = useState<string>("");
  const [selectedEducation, setSelectedEducation] = useState<string>("");
  const [selectedFamilyPlans, setSelectedFamilyPlans] = useState<string>("");
  const [selectedCovidVaccine, setSelectedCovidVaccine] = useState<string>("");
  const [selectedPersonalityType, setSelectedPersonalityType] =
    useState<string>("");
  const [selectedCommunicationStyle, setSelectedCommunicationStyle] =
    useState<string>("");
  const [selectedLoveStyle, setSelectedLoveStyle] = useState<string>("");
  const [selectedBloodType, setSelectedBloodType] = useState<string>("");

  const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  const educationLevels = [
    "High School",
    "Bachelors",
    "Masters",
    "PhD",
    "Trade School",
    "Other",
  ];
  const familyPlanOptions = ["Want Kids", "Don't Want Kids", "Not Sure Yet"];
  const covidVaccineOptions = [
    "Vaccinated",
    "Unvaccinated",
    "Prefer Not to Say",
  ];
  const personalityTypes = [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
  ];
  const communicationStyles = [
    "Chatty Cathy",
    "Listener",
    "Joker",
    "Deep Thinker",
    "Sarcastic Wit",
    "Easygoing",
    "Straight Shooter",
    "Storyteller",
  ];
  const loveStyles = [
    "Hopeless Romantic",
    "Adventure Seeker",
    "Best Friend",
    "Independent Spirit",
    "Caregiver",
    "Spontaneous Adventurer",
    "Classic Lover",
    "Analytical Lover",
  ];
  const bloodTypes = ["A", "B", "AB", "O"];

  const handleNext = () => {
    navigate("/onboarding/lifestyle");
  };

  const handleBack = () => {
    navigate("/onboarding/location");
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
        <h1 className="text-xl font-bold text-black">Basics</h1>
        <div className="w-8"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        <Section
          icon={<Clock size={20} className="text-gray-600" />}
          title="Zodiac"
        >
          {zodiacSigns.map((sign) => (
            <OptionButton
              key={sign}
              text={sign}
              isSelected={selectedZodiac === sign}
              onClick={() => setSelectedZodiac(sign)}
            />
          ))}
        </Section>

        <Section
          icon={<GraduationCap size={20} className="text-gray-600" />}
          title="Education"
        >
          {educationLevels.map((level) => (
            <OptionButton
              key={level}
              text={level}
              isSelected={selectedEducation === level}
              onClick={() => setSelectedEducation(level)}
            />
          ))}
        </Section>

        <Section
          icon={<Users size={20} className="text-gray-600" />}
          title="Family Plans"
        >
          {familyPlanOptions.map((option) => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedFamilyPlans === option}
              onClick={() => setSelectedFamilyPlans(option)}
            />
          ))}
        </Section>

        <Section
          icon={<Shield size={20} className="text-gray-600" />}
          title="COVID Vaccine"
        >
          {covidVaccineOptions.map((option) => (
            <OptionButton
              key={option}
              text={option}
              isSelected={selectedCovidVaccine === option}
              onClick={() => setSelectedCovidVaccine(option)}
            />
          ))}
        </Section>

        <Section
          icon={<Brain size={20} className="text-gray-600" />}
          title="Personality Type"
        >
          <div className="grid grid-cols-4 gap-2 w-full">
            {personalityTypes.map((type) => (
              <OptionButton
                key={type}
                text={type}
                isSelected={selectedPersonalityType === type}
                onClick={() => setSelectedPersonalityType(type)}
              />
            ))}
          </div>
        </Section>

        <Section
          icon={<MessageCircle size={20} className="text-gray-600" />}
          title="Communication Style"
        >
          {communicationStyles.map((style) => (
            <OptionButton
              key={style}
              text={style}
              isSelected={selectedCommunicationStyle === style}
              onClick={() => setSelectedCommunicationStyle(style)}
            />
          ))}
        </Section>

        <Section
          icon={<Heart size={20} className="text-gray-600" />}
          title="Love Style"
        >
          {loveStyles.map((style) => (
            <OptionButton
              key={style}
              text={style}
              isSelected={selectedLoveStyle === style}
              onClick={() => setSelectedLoveStyle(style)}
            />
          ))}
        </Section>

        <Section
          icon={<Droplet size={20} className="text-gray-600" />}
          title="Blood Type"
        >
          <div className="flex gap-2">
            {bloodTypes.map((type) => (
              <OptionButton
                key={type}
                text={type}
                isSelected={selectedBloodType === type}
                onClick={() => setSelectedBloodType(type)}
              />
            ))}
          </div>
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

export default OnboardingBasics;
