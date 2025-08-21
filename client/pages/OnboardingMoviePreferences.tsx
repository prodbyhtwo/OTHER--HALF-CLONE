import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

const OnboardingMoviePreferences: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const movieGenres = [
    { name: "Action", emoji: "🎬" },
    { name: "Comedy", emoji: "😂" },
    { name: "Thriller", emoji: "🔪" },
    { name: "Drama", emoji: "🎭" },
    { name: "Sci-Fi", emoji: "🚀" },
    { name: "Romance", emoji: "💕" },
    { name: "Horror", emoji: "👻" },
    { name: "Animated", emoji: "❤️" },
    { name: "Spy", emoji: "🕵️" },
    { name: "Adventure", emoji: "✅" },
    { name: "Documentary", emoji: "🎥" },
    { name: "Musical", emoji: "🎵" },
    { name: "Fantasy", emoji: "⭐" },
    { name: "Anime", emoji: "🅰️" },
    { name: "Historical", emoji: "🏛️" },
    { name: "War", emoji: "⚔️" },
    { name: "Mystery", emoji: "🔍" },
    { name: "Crime", emoji: "👮" },
    { name: "Family", emoji: "👨‍👩‍👧‍👦" },
    { name: "Western", emoji: "🤠" },
    { name: "Biographical", emoji: "📖" },
    { name: "Courtroom", emoji: "⚖️" },
    { name: "Sports", emoji: "🏀" },
    { name: "Epic", emoji: "⚡" },
    { name: "Martial Arts", emoji: "🥋" },
    { name: "K-Drama", emoji: "💗🎭" },
    { name: "Silent Films", emoji: "🤐" },
    { name: "Film Noir", emoji: "🖤" },
    { name: "Political", emoji: "🏛️" },
    { name: "Satire", emoji: "😊" },
    { name: "Coming of Age", emoji: "🌅" },
    { name: "Superhero", emoji: "🦸" },
    { name: "Disaster", emoji: "🌪️" },
    { name: "Noir", emoji: "🖤" },
    { name: "Cyberpunk", emoji: "🤖" },
    { name: "Steampunk", emoji: "⚙️" },
    { name: "Time Travel", emoji: "⏰" },
    { name: "Found Footage", emoji: "📹" },
    { name: "Buddy Cop", emoji: "👮‍♂️👮‍♀️" },
    { name: "Fantasy Adventure", emoji: "🗡️🏰" },
    { name: "Bollywood", emoji: "🇮🇳🎬" },
    { name: "Cult Classics", emoji: "🎭💀" },
    { name: "Mockumentary", emoji: "🎥" },
    { name: "Slice of Life", emoji: "🍰🏡" },
    { name: "Foreign Films", emoji: "🌍🎬" },
    { name: "Nollywood", emoji: "🇳🇬🎬" },
  ];

  const filteredGenres = movieGenres.filter((genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleNext = () => {
    navigate("/onboarding/book-preferences");
  };

  const handleBack = () => {
    navigate("/onboarding/music-preferences");
  };

  const GenreButton: React.FC<{
    genre: { name: string; emoji: string };
    isSelected: boolean;
    onClick: () => void;
  }> = ({ genre, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
        isSelected
          ? "bg-purple-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <span>{genre.emoji}</span>
      <span>{genre.name}</span>
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
        <h1 className="text-xl font-bold text-black">Movies Preferences</h1>
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
            placeholder="Search movies preferences"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Genre Grid */}
        <div className="flex flex-wrap gap-3">
          {filteredGenres.map((genre) => (
            <GenreButton
              key={genre.name}
              genre={genre}
              isSelected={selectedGenres.includes(genre.name)}
              onClick={() => handleGenreToggle(genre.name)}
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
          OK ({selectedGenres.length}/5)
        </button>
      </div>
    </div>
  );
};

export default OnboardingMoviePreferences;
