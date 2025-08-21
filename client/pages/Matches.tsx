import React, { useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, X, Heart, Church } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  FaithBackground,
  FaithCard,
  FaithButton,
  BiblicalVerse,
  FaithFeatures,
  DivineGlow,
  useFaithTheme
} from "../components/FaithElements";

interface Profile {
  id: string;
  name: string;
  age: number;
  distance: string;
  image: string;
}

const mockLikes: Profile[] = [
  {
    id: "1",
    name: "Monica",
    age: 24,
    distance: "5 km away",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Elizabeth",
    age: 25,
    distance: "7 km away",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Sophia",
    age: 23,
    distance: "6 km away",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Isabella",
    age: 22,
    distance: "4 km away",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Emma",
    age: 26,
    distance: "3 km away",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "Olivia",
    age: 24,
    distance: "8 km away",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop&crop=face",
  },
];

const mockSuperLikes: Profile[] = [
  {
    id: "7",
    name: "Anna",
    age: 24,
    distance: "6 km away",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "8",
    name: "Alice",
    age: 22,
    distance: "5 km away",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "9",
    name: "Charlotte",
    age: 24,
    distance: "9 km away",
    image:
      "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "10",
    name: "Olivia",
    age: 21,
    distance: "4 km away",
    image:
      "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=300&h=400&fit=crop&crop=face",
  },
];

const searchResults: Profile[] = [
  {
    id: "11",
    name: "Sarah",
    age: 23,
    distance: "6 km away",
    image:
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "12",
    name: "Sarah",
    age: 35,
    distance: "9 km away",
    image:
      "https://images.unsplash.com/photo-1495462911434-be47104d70fa?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: "13",
    name: "Sarah",
    age: 27,
    distance: "5 km away",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face",
  },
];

const recentSearches = [
  "Francene Vandyne",
  "Cyndy Lillibridge",
  "Marci Senter",
  "Chantal Shelburne",
  "Tyra Dhillon",
  "Roselle Ehrman",
  "Phyllis Godley",
];

const MobileStatusBar = () => (
  <div className="flex justify-between items-center px-6 py-2 bg-white">
    <span className="text-black font-medium">9:41</span>
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <div className="w-1 h-3 bg-black rounded-full"></div>
        <div className="w-1 h-3 bg-black rounded-full"></div>
        <div className="w-1 h-3 bg-black rounded-full"></div>
        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
      </div>
      <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none">
        <path
          d="M2 4C2 2.89543 2.89543 2 4 2H20C21.1046 2 22 2.89543 22 4V12C22 13.1046 21.1046 14 20 14H4C2.89543 14 2 13.1046 2 12V4Z"
          stroke="black"
          strokeWidth="1"
          fill="none"
        />
        <path d="M6 6V10M10 6V10M14 6V10" stroke="black" strokeWidth="1" />
        <path d="M18 8H20" stroke="black" strokeWidth="1" />
      </svg>
    </div>
  </div>
);

const ProfileCard = ({ profile }: { profile: Profile }) => (
  <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-gray-200">
    <img
      src={profile.image}
      alt={profile.name}
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
      <h3 className="text-white font-semibold text-lg">
        {profile.name} ({profile.age})
      </h3>
      <p className="text-white/80 text-sm">{profile.distance}</p>
    </div>
  </div>
);

const SearchInterface = ({
  onClose,
  searchQuery,
  setSearchQuery,
  showRecent,
  setShowRecent,
}: {
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showRecent: boolean;
  setShowRecent: (show: boolean) => void;
}) => {
  const navigate = useNavigate();

  const handleSearchFocus = () => {
    setShowRecent(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowRecent(value === "");
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    setShowRecent(false);
  };

  const removeRecentSearch = (searchToRemove: string) => {
    // In a real app, this would update the recent searches list
    console.log("Remove recent search:", searchToRemove);
  };

  const clearAllRecent = () => {
    // In a real app, this would clear all recent searches
    console.log("Clear all recent searches");
  };

  const displayProfiles = searchQuery.toLowerCase().includes("sarah")
    ? searchResults
    : [];

  return (
    <div className="fixed inset-0 bg-white z-50">
      <MobileStatusBar />

      {/* Search Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <button onClick={onClose} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-full text-black placeholder-gray-500 focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowRecent(true);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
        <button onClick={onClose} className="ml-4">
          <X className="w-6 h-6 text-black" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showRecent ? (
          /* Recent Searches */
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-black">
                Recent Searches
              </h2>
              <button onClick={clearAllRecent}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {recentSearches.map((search, index) => (
                <div key={index} className="flex justify-between items-center">
                  <button
                    onClick={() => handleRecentSearchClick(search)}
                    className="text-gray-600 text-left flex-1"
                  >
                    {search}
                  </button>
                  <button onClick={() => removeRecentSearch(search)}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {displayProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard (only show when recent searches are visible) */}
      {showRecent && (
        <div className="bg-gray-100 p-4">
          <div className="grid grid-cols-10 gap-2 mb-3">
            {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(
              (letter) => (
                <button
                  key={letter}
                  className="bg-white p-3 rounded text-black font-medium"
                >
                  {letter}
                </button>
              ),
            )}
          </div>
          <div className="grid grid-cols-10 gap-2 mb-3">
            {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => (
              <button
                key={letter}
                className="bg-white p-3 rounded text-black font-medium"
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-10 gap-2 mb-4">
            <button className="bg-white p-3 rounded text-black">⬆</button>
            {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => (
              <button
                key={letter}
                className="bg-white p-3 rounded text-black font-medium"
              >
                {letter}
              </button>
            ))}
            <button className="bg-gray-500 p-3 rounded text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-500 px-6 py-3 rounded text-white font-medium">
              123
            </button>
            <button className="flex-1 bg-white py-3 rounded text-black font-medium">
              space
            </button>
            <button className="bg-blue-500 px-8 py-3 rounded text-white font-medium">
              Go
            </button>
          </div>
          <div className="flex justify-center mt-4 space-x-8">
            <button className="text-2xl">😊</button>
            <button className="text-2xl">🎤</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Matches = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"likes" | "superlikes">("likes");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecent, setShowRecent] = useState(false);

  const currentProfiles = activeTab === "likes" ? mockLikes : mockSuperLikes;

  if (showSearch) {
    return (
      <SearchInterface
        onClose={() => setShowSearch(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showRecent={showRecent}
        setShowRecent={setShowRecent}
      />
    );
  }

  const { isFaithMode, shouldShowFaithFeatures } = useFaithTheme();

  return (
    <FaithBackground className="min-h-screen">
      <MobileStatusBar />

      {/* Header */}
      <FaithCard className="flex items-center justify-between px-6 py-4 rounded-none border-x-0 border-t-0">
        <DivineGlow>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isFaithMode() ? 'bg-amber-500' : 'bg-purple-500'
          }`}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              {isFaithMode() ? (
                <Heart className="w-5 h-5 text-amber-500" />
              ) : (
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              )}
            </div>
          </div>
        </DivineGlow>
        <div className="flex items-center space-x-2">
          {isFaithMode() && <Church className="w-5 h-5 text-amber-600" />}
          <h1 className={`text-2xl font-bold ${isFaithMode() ? 'text-amber-800' : 'text-black'}`}>
            {isFaithMode() ? 'Blessed Connections' : 'Matches'}
          </h1>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setShowSearch(true)}>
            <Search className={`w-6 h-6 ${isFaithMode() ? 'text-amber-800' : 'text-black'}`} />
          </button>
          <button>
            <SlidersHorizontal className={`w-6 h-6 ${isFaithMode() ? 'text-amber-800' : 'text-black'}`} />
          </button>
        </div>
      </FaithCard>

      {/* Faith Features - Biblical Verse */}
      <FaithFeatures>
        <div className="px-6 py-4">
          <BiblicalVerse context="relationships" className="mb-4" />
        </div>
      </FaithFeatures>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <FaithCard className="p-1 rounded-full">
          <div className="flex rounded-full overflow-hidden">
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex-1 py-3 text-center font-semibold transition-colors rounded-full ${
                activeTab === "likes"
                  ? isFaithMode()
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-purple-500 text-white"
                  : isFaithMode()
                    ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {isFaithMode() ? '💛 Likes (85)' : 'Likes (85)'}
            </button>
            <button
              onClick={() => setActiveTab("superlikes")}
              className={`flex-1 py-3 text-center font-semibold transition-colors rounded-full ${
                activeTab === "superlikes"
                  ? isFaithMode()
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-purple-500 text-white"
                  : isFaithMode()
                    ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {isFaithMode() ? '✨ Blessed (24)' : 'Super Likes (24)'}
            </button>
          </div>
        </FaithCard>
      </div>

      {/* Profile Grid */}
      <div className="px-6 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {currentProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => navigate("/home")}
            className="flex flex-col items-center py-2"
          >
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 mb-1"></div>
            <span className="text-xs text-gray-400">Home</span>
          </button>
          <button className="flex flex-col items-center py-2">
            <div className="w-6 h-6 flex items-center justify-center mb-1">
              <div className="w-4 h-4 bg-purple-500"></div>
            </div>
            <span className="text-xs text-purple-500 font-medium">Matches</span>
          </button>
          <button
            onClick={() => navigate("/chats")}
            className="flex flex-col items-center py-2"
          >
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 mb-1"></div>
            <span className="text-xs text-gray-400">Chats</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center py-2"
          >
            <div className="w-6 h-6 rounded-full bg-gray-200 mb-1"></div>
            <span className="text-xs text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </FaithBackground>
  );
};

export default Matches;
