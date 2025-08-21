import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  Facebook,
  Instagram,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import InterestsModal from "../components/InterestsModal";
import RelationshipGoalsModal from "../components/RelationshipGoalsModal";
import LanguagesModal from "../components/LanguagesModal";
import AnthemModal from "../components/AnthemModal";
import ReligionModal from "../components/ReligionModal";

export default function EditProfile() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1516832970803-325be7a92aa5?w=300&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=300&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?w=300&h=400&fit=crop&crop=face",
    null,
  ]);

  const [formData, setFormData] = useState({
    nickname: "Andrew",
    birthday: "21/11/1999",
    gender: "Male",
    height: "5ft 6in",
    weight: "75 kg",
    jobTitle: "Product Designer",
    company: "Google LLC",
    school: "Columbia University",
    livingIn: "New York City",
    aboutMe:
      "I'm an adventurous soul who loves exploring new places, trying exotic foods, and meeting fascinating people. My passion for travel matched only by my love for a good book. I'm currently looking for my partner in crime.",
    interests: [
      "Travel ✈️",
      "Movies 🎬",
      "Art 🎨",
      "Technology 📱",
      "Science 🧪",
    ],
    relationshipGoals: "dating",
    languagesIKnow: ["English 🇺🇸", "Spanish 🇪🇸", "French 🇫🇷"],
    anthem: { title: "Can't Like You", artist: "Ruel" },
    religion: "Christianity",
    zodiac: "Capricorn",
    education: "Bachelor",
    familyPlans: "",
    politics: "",
    covidVaccine: "Vaccinated",
    personalityType: "",
    communicationStyle: "",
    receivingLove: "",
    loveLanguage: "",
    lifestyle: "",
    drinkingHabits: "Non-Drinker",
    smokingHabits: "Non-Smoker",
    workoutFrequency: "",
    dietaryPreferences: "Vegetarian",
    petOwner: "",
    sleepingHabits: "Regular Sleeper",
    musicPreferences: ["Pop ❤️", "Thriller 🔥", "Sci-Fi 🚀"],
    moviePreferences: ["Action 💥", "Thriller 🔥", "Sci-Fi 🚀"],
    bookPreferences: ["Adventure 🗻", "Fantasy ⚗️", "Romance 💝"],
    travelPreferences: [
      "Adventure Travel 🎒",
      "Road Trips 🚗",
      "Beach Trips 🏖️",
      "Food Tours 🍴",
    ],
    facebookUrl: "",
    instagramUrl: "",
    tikTokUrl: "",
    twitterUrl: "",
    linkedInUrl: "",
    datingStyle: "",
  });

  // Modal states
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showRelationshipGoalsModal, setShowRelationshipGoalsModal] =
    useState(false);
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const [showAnthemModal, setShowAnthemModal] = useState(false);
  const [showReligionModal, setShowReligionModal] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const addPhoto = (index: number) => {
    // Mock adding a photo
    const newPhotos = [...photos];
    newPhotos[index] =
      `https://images.unsplash.com/photo-${Date.now()}?w=300&h=400&fit=crop&crop=face`;
    setPhotos(newPhotos);
  };

  const handleSave = () => {
    // Mock save functionality
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
        <div className="w-10" />
      </div>

      <div className="pb-20">
        {/* Photo Grid */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div key={index} className="aspect-[3/4] relative">
                {photo ? (
                  <div className="relative w-full h-full">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addPhoto(index)}
                    className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                  >
                    <Plus className="w-8 h-8 text-gray-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-4 space-y-4">
          {/* Basic Info Section */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nickname
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birthday
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.birthday}
                  onChange={(e) =>
                    handleInputChange("birthday", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg pr-10"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg appearance-none pr-10"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg pr-10"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg pr-10"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Designer
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => handleInputChange("school", e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg pr-10"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Living in
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.livingIn}
                  onChange={(e) =>
                    handleInputChange("livingIn", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg pr-10"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* About Me */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Me
            </label>
            <textarea
              value={formData.aboutMe}
              onChange={(e) => handleInputChange("aboutMe", e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg h-20 resize-none text-sm"
            />
          </div>

          {/* Interests */}
          <div>
            <button
              type="button"
              onClick={() => setShowInterestsModal(true)}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg text-left"
            >
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Interests
                </label>
                <div className="flex flex-wrap gap-1">
                  {formData.interests.slice(0, 3).map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                  {formData.interests.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{formData.interests.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Social Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Social Media
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Facebook className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  value={formData.facebookUrl}
                  onChange={(e) =>
                    handleInputChange("facebookUrl", e.target.value)
                  }
                  placeholder="https://facebook.com/username"
                  className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  value={formData.instagramUrl}
                  onChange={(e) =>
                    handleInputChange("instagramUrl", e.target.value)
                  }
                  placeholder="https://instagram.com/username"
                  className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  value={formData.tikTokUrl}
                  onChange={(e) =>
                    handleInputChange("tikTokUrl", e.target.value)
                  }
                  placeholder="https://tiktok.com/@username"
                  className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">𝕏</span>
                </div>
                <input
                  type="text"
                  value={formData.twitterUrl}
                  onChange={(e) =>
                    handleInputChange("twitterUrl", e.target.value)
                  }
                  placeholder="https://x.com/username"
                  className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <input
                  type="text"
                  value={formData.linkedInUrl}
                  onChange={(e) =>
                    handleInputChange("linkedInUrl", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Languages I Know */}
          <button
            type="button"
            onClick={() => setShowLanguagesModal(true)}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div>
              <span className="text-sm font-medium text-gray-700">
                Languages I Know
              </span>
              {formData.languagesIKnow.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.languagesIKnow.slice(0, 2).map((lang, index) => (
                    <span key={index} className="text-xs text-gray-500">
                      {lang}
                    </span>
                  ))}
                  {formData.languagesIKnow.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{formData.languagesIKnow.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>

          {/* Relationship Goals */}
          <button
            type="button"
            onClick={() => setShowRelationshipGoalsModal(true)}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div>
              <span className="text-sm font-medium text-gray-700">
                Relationship Goals
              </span>
              {formData.relationshipGoals && (
                <span className="text-xs text-gray-500 block mt-1 capitalize">
                  {formData.relationshipGoals}
                </span>
              )}
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>

          {/* Religion */}
          <button
            type="button"
            onClick={() => setShowReligionModal(true)}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div>
              <span className="text-sm font-medium text-gray-700">
                Religion
              </span>
              {formData.religion && (
                <span className="text-xs text-gray-500 block mt-1">
                  {formData.religion}
                </span>
              )}
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>

          {/* My Anthem */}
          <button
            type="button"
            onClick={() => setShowAnthemModal(true)}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=48&h=48&fit=crop&crop=center"
                  alt="Album cover"
                  className="w-10 h-10 rounded object-cover"
                />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 block">
                  My Anthem
                </span>
                {formData.anthem && (
                  <span className="text-xs text-gray-500">
                    {formData.anthem.title} - {formData.anthem.artist}
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>

          {/* Job & Education */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Job & Education
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                Product Designer
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Zodiac */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">Zodiac</span>
              <span className="text-xs text-gray-500 block mt-1">
                {formData.zodiac}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Education */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Education
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                {formData.education}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Family Plans */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Family Plans
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Politics */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Politics
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* COVID Vaccine */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                COVID Vaccine
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                {formData.covidVaccine}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Personality Type */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Personality Type
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Communication Style */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Communication Style
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Receiving Love */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Receiving Love
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Blood Type */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Blood Type
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Lifestyle Header */}
          <div className="pt-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Lifestyle
            </h3>
          </div>

          {/* Drinking Habits */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Drinking Habits
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                {formData.drinkingHabits}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Smoking Habits */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Smoking Habits
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                {formData.smokingHabits}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Workout */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">Workout</span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Dietary Preferences */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Dietary Preferences
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                {formData.dietaryPreferences}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Social Media Presence */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Social Media Presence
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Sleeping Habits */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Sleeping Habits
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                {formData.sleepingHabits}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Music Preferences */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Music Preferences
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.musicPreferences.slice(0, 2).map((pref, index) => (
                  <span key={index} className="text-xs text-gray-500">
                    {pref}
                  </span>
                ))}
                {formData.musicPreferences.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{formData.musicPreferences.length - 2} more
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Movies Preferences */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Movies Preferences
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.moviePreferences.slice(0, 2).map((pref, index) => (
                  <span key={index} className="text-xs text-gray-500">
                    {pref}
                  </span>
                ))}
                {formData.moviePreferences.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{formData.moviePreferences.length - 2} more
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Book Preferences */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Book Preferences
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.bookPreferences.slice(0, 2).map((pref, index) => (
                  <span key={index} className="text-xs text-gray-500">
                    {pref}
                  </span>
                ))}
                {formData.bookPreferences.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{formData.bookPreferences.length - 2} more
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {/* Travel Preferences */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Travel Preferences
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.travelPreferences.slice(0, 2).map((pref, index) => (
                  <span key={index} className="text-xs text-gray-500">
                    {pref}
                  </span>
                ))}
                {formData.travelPreferences.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{formData.travelPreferences.length - 2} more
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleSave}
          className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold"
        >
          Save
        </button>
      </div>

      {/* Modals */}
      <InterestsModal
        isOpen={showInterestsModal}
        onClose={() => setShowInterestsModal(false)}
        selectedInterests={formData.interests}
        onSave={(interests) => setFormData((prev) => ({ ...prev, interests }))}
      />

      <RelationshipGoalsModal
        isOpen={showRelationshipGoalsModal}
        onClose={() => setShowRelationshipGoalsModal(false)}
        selectedGoal={formData.relationshipGoals}
        onSave={(goal) =>
          setFormData((prev) => ({ ...prev, relationshipGoals: goal }))
        }
      />

      <LanguagesModal
        isOpen={showLanguagesModal}
        onClose={() => setShowLanguagesModal(false)}
        selectedLanguages={formData.languagesIKnow}
        onSave={(languages) =>
          setFormData((prev) => ({ ...prev, languagesIKnow: languages }))
        }
      />

      <AnthemModal
        isOpen={showAnthemModal}
        onClose={() => setShowAnthemModal(false)}
        selectedSong={formData.anthem}
        onSave={(anthem) => setFormData((prev) => ({ ...prev, anthem }))}
      />

      <ReligionModal
        isOpen={showReligionModal}
        onClose={() => setShowReligionModal(false)}
        selectedReligion={formData.religion}
        onSave={(religion) => setFormData((prev) => ({ ...prev, religion }))}
      />
    </div>
  );
}
