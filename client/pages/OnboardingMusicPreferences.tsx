import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

const OnboardingMusicPreferences: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const musicGenres = [
    { name: "Pop", emoji: "🎵" },
    { name: "Rock", emoji: "🎸" },
    { name: "R&B", emoji: "🎶" },
    { name: "Country", emoji: "🤠" },
    { name: "Jazz", emoji: "🎺" },
    { name: "Hip-Hop", emoji: "🎤" },
    { name: "Classical", emoji: "🎻" },
    { name: "Electronic", emoji: "🎧" },
    { name: "Indie", emoji: "🎸" },
    { name: "Reggae", emoji: "🌴" },
    { name: "Blues", emoji: "🎸" },
    { name: "Metal", emoji: "🤘" },
    { name: "Latin", emoji: "����" },
    { name: "K-Pop", emoji: "💗" },
    { name: "Punk", emoji: "🤘" },
    { name: "Alternative", emoji: "🎶" },
    { name: "Folk", emoji: "🎸" },
    { name: "Funk", emoji: "🕺" },
    { name: "World", emoji: "🌍" },
    { name: "EDM", emoji: "🎛️" },
    { name: "Rap", emoji: "🎤" },
    { name: "Soul", emoji: "🎵" },
    { name: "Opera", emoji: "🎭" },
    { name: "Disco", emoji: "🪩" },
    { name: "Ambient", emoji: "🌊" },
    { name: "Ska", emoji: "🎺" },
    { name: "J-Pop", emoji: "💫" },
    { name: "Bollywood", emoji: "🎬" },
    { name: "Gospel", emoji: "🙏" },
    { name: "House", emoji: "🏠" },
    { name: "New Age", emoji: "🧘" },
    { name: "Trance", emoji: "🌀" },
    { name: "Techno", emoji: "🎶" },
    { name: "Salsa", emoji: "💃" },
    { name: "Flamenco", emoji: "💃" },
    { name: "Swing", emoji: "🎷" },
    { name: "Acoustic", emoji: "🎸" },
    { name: "Synth-Pop", emoji: "🎹" },
    { name: "Choir", emoji: "🎶" },
    { name: "Grunge", emoji: "🎸" },
    { name: "Chiptune", emoji: "🎮" },
    { name: "Barbershop", emoji: "✂️" },
    { name: "Chamber", emoji: "🎻" },
    { name: "Downtempo", emoji: "📻" },
    { name: "Psychedelic", emoji: "🌈" },
    { name: "Progressive", emoji: "🎶" },
    { name: "Experimental", emoji: "🎵" },
    { name: "Industrial", emoji: "🏭" },
    { name: "World Fusion", emoji: "🌍" },
    { name: "Trip-Hop", emoji: "🚶🎶" },
  ];

  const filteredGenres = musicGenres.filter((genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleNext = () => {
    navigate("/onboarding/movie-preferences");
  };

  const handleBack = () => {
    navigate("/onboarding/lifestyle");
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
        <h1 className="text-xl font-bold text-black">Music Preferences</h1>
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
            placeholder="Search music preferences"
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

export default OnboardingMusicPreferences;
