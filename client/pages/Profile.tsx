import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Settings,
  X,
  MapPin,
  Users,
  GraduationCap,
  Briefcase,
  Home as HomeIcon,
  Facebook,
  Instagram,
  Music,
} from "lucide-react";

// Mobile status bar component
const MobileStatusBar = () => (
  <div className="w-full h-11 flex items-center justify-between px-6 text-black text-base font-semibold">
    <div className="flex items-center">
      <span>9:41</span>
    </div>
    <div className="flex items-center gap-1">
      {/* Signal bars */}
      <div className="flex items-end gap-1">
        <div className="w-1 h-2 bg-black rounded-sm"></div>
        <div className="w-1 h-3 bg-black rounded-sm"></div>
        <div className="w-1 h-4 bg-black rounded-sm"></div>
        <div className="w-1 h-5 bg-black rounded-sm"></div>
      </div>
      {/* WiFi icon */}
      <svg className="w-4 h-3 ml-2" viewBox="0 0 16 11" fill="black">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
        />
      </svg>
      {/* Battery */}
      <div className="ml-2 w-7 h-3 border border-black border-opacity-35 rounded-sm relative">
        <div className="absolute inset-0.5 bg-black rounded-sm"></div>
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-black bg-opacity-40 rounded-r"></div>
      </div>
    </div>
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const [completionPercentage] = useState(100);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleUpgrade = () => {
    navigate("/upgrade-membership");
  };

  return (
    <div className="min-h-screen bg-white">
      <MobileStatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-purple-600" />
          </div>
        </button>
        <h1 className="text-xl font-bold">Profile</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpgrade}
            className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1"
          >
            <Star className="w-4 h-4" />
            UPGRADE
          </button>
          <button onClick={() => navigate("/settings")} className="p-2">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Complete Profile Banner */}
      <div className="mx-4 mb-6 p-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl text-white relative">
        <button className="absolute top-3 right-3">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeDasharray={`${completionPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{completionPercentage}%</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1">
              Your profile is complete!
            </h2>
            <p className="text-sm opacity-90">
              Amazing! You're ready to experience the full dating app potential!
            </p>
          </div>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="px-4 mb-4">
        <div className="w-full h-96 rounded-2xl overflow-hidden bg-gray-200 relative">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
            alt="Profile"
            className="w-full h-full object-cover"
          />
          {/* Purple progress bar at top */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-purple-600 rounded-full"></div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">Andrew (27)</h1>

        {/* Basic Info Icons Row */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700">
            <Users className="w-5 h-5 mr-3 text-gray-500" />
            <span className="text-sm">Man (he/him/his)</span>
          </div>

          <div className="flex items-center text-gray-700">
            <div className="w-5 h-5 mr-3 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-gray-500"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-sm">185 cm, 76 kg</span>
          </div>

          <div className="flex items-center text-gray-700">
            <Briefcase className="w-5 h-5 mr-3 text-gray-500" />
            <span className="text-sm">Product Designer at Google LLC</span>
          </div>

          <div className="flex items-center text-gray-700">
            <GraduationCap className="w-5 h-5 mr-3 text-gray-500" />
            <span className="text-sm">Columbia University</span>
          </div>

          <div className="flex items-center text-gray-700">
            <HomeIcon className="w-5 h-5 mr-3 text-gray-500" />
            <span className="text-sm">Lives in New York City</span>
          </div>

          <div className="flex items-center text-gray-700">
            <MapPin className="w-5 h-5 mr-3 text-gray-500" />
            <span className="text-sm">Less than a kilometer away</span>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">About Me</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          I'm an adventurous soul who loves exploring new places, trying exotic
          cuisines, and meeting fascinating people. My passion for travel
          matched only by my love for a good book. I'm currently looking for my
          partner in crime.
        </p>
      </div>

      {/* Interests */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Interests</h2>
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            Travel ✈️
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            Movies 🎬
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            Art 🎨
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            Technology 📱
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            Science 🧪
          </span>
        </div>
      </div>

      {/* Social Media */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Social Media</h2>
        <div className="flex space-x-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Facebook className="w-5 h-5 text-white" />
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">𝕏</span>
          </div>
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">in</span>
          </div>
        </div>
      </div>

      {/* Languages I Know */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Languages I Know</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">🇺🇸 English</span>
            <span className="text-xs text-gray-500">Native</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">🇪🇸 Spanish</span>
            <span className="text-xs text-gray-500">Fluent</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">🇫🇷 French</span>
            <span className="text-xs text-gray-500">Advanced</span>
          </div>
        </div>
      </div>

      {/* Relationship Goals */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Relationship Goals</h2>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
          Dating 💕
        </span>
      </div>

      {/* Religion */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Religion</h2>
        <span className="text-sm text-gray-700">Christianity</span>
      </div>

      {/* My Anthem */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">My Anthem</h2>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=48&h=48&fit=crop&crop=center"
              alt="Album cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-900">
              Can't Like You
            </span>
            <span className="text-sm text-gray-500 block">Ruel</span>
          </div>
        </div>
      </div>

      {/* Basics Section */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Basics</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">🔯 Capricorn</span>
            <span className="text-xs text-gray-500">Zodiac</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">🎓 Not Sure Yet</span>
            <span className="text-xs text-gray-500">Education</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">💉 Vaccinated</span>
            <span className="text-xs text-gray-500">COVID</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">🧬 INTP</span>
            <span className="text-xs text-gray-500">Personality</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">📞 Listener</span>
            <span className="text-xs text-gray-500">Communication</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">💝 Adventure Seeker</span>
            <span className="text-xs text-gray-500">Love Language</span>
          </div>
        </div>
      </div>

      {/* Lifestyle Section */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Lifestyle</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">🚫 Non-Drinker</span>
            <span className="text-xs text-gray-500">Drinking</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">🚭 Non-smoker</span>
            <span className="text-xs text-gray-500">Smoking</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">🥗 Vegetarian</span>
            <span className="text-xs text-gray-500">Diet</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">😴 Regular Sleeper</span>
            <span className="text-xs text-gray-500">Sleep</span>
          </div>
        </div>
      </div>

      {/* Preferences Sections */}
      <div className="px-4 mb-20">
        <div className="space-y-6">
          {/* Music Preferences */}
          <div>
            <h2 className="text-lg font-bold mb-3">Music Preferences</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Pop ❤️
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Rock 🎸
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Hip-Hop 🎤
              </span>
            </div>
          </div>

          {/* Movies Preferences */}
          <div>
            <h2 className="text-lg font-bold mb-3">Movies Preferences</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Action 💥
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Thriller 🔥
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Sci-Fi 🚀
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Adventure 🗻
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Fantasy ⚗️
              </span>
            </div>
          </div>

          {/* Book Preferences */}
          <div>
            <h2 className="text-lg font-bold mb-3">Book Preferences</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Fiction 📖
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Comedy 🎭
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Science 🧪
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Fantasy ⚗️
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Mystery/Thriller 🔍
              </span>
            </div>
          </div>

          {/* Travel Preferences */}
          <div>
            <h2 className="text-lg font-bold mb-3">Travel Preferences</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Adventure Travel 🎒
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Beach Vacations 🏖️
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Road Trips 🚗
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                Food Tourism 🍴
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-3">
          <button
            onClick={() => navigate("/home")}
            className="flex flex-col items-center py-2"
          >
            <HomeIcon className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Home</span>
          </button>
          <button
            onClick={() => navigate("/matches")}
            className="flex flex-col items-center py-2"
          >
            <Star className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Matches</span>
          </button>
          <button
            onClick={() => navigate("/chats")}
            className="flex flex-col items-center py-2"
          >
            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center mb-1">
              <div className="w-4 h-3 border-2 border-gray-400 rounded-sm"></div>
            </div>
            <span className="text-xs text-gray-400">Chats</span>
          </button>
          <button className="flex flex-col items-center py-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mb-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xs text-purple-600 font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Button */}
      <div className="fixed bottom-20 right-4">
        <button
          onClick={handleEditProfile}
          className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <div className="w-6 h-6 text-white">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
