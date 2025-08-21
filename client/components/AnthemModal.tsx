import React, { useState } from "react";
import { X, Search, Check } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
}

interface AnthemModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSong: Song | null;
  onSave: (song: Song | null) => void;
}

const MOCK_SONGS: Song[] = [
  {
    id: "1",
    title: "Shape of You",
    artist: "Ed Sheeran",
    albumArt:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop",
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    albumArt:
      "https://images.unsplash.com/photo-1514533212735-5df27d970db9?w=60&h=60&fit=crop",
  },
  {
    id: "3",
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    albumArt:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop",
  },
  {
    id: "4",
    title: "Girls Like You ft. Cardi B",
    artist: "Maroon 5",
    albumArt:
      "https://images.unsplash.com/photo-1514533212735-5df27d970db9?w=60&h=60&fit=crop",
  },
  {
    id: "5",
    title: "Despacito",
    artist: "Luis Fonsi & Daddy Yankee",
    albumArt:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop",
  },
  {
    id: "6",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth",
    albumArt:
      "https://images.unsplash.com/photo-1514533212735-5df27d970db9?w=60&h=60&fit=crop",
  },
];

export default function AnthemModal({
  isOpen,
  onClose,
  selectedSong,
  onSave,
}: AnthemModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<Song | null>(selectedSong);

  if (!isOpen) return null;

  const filteredSongs = MOCK_SONGS.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectSong = (song: Song) => {
    setTempSelected(song);
  };

  const selectNoAnthem = () => {
    setTempSelected(null);
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
          <h1 className="text-xl font-bold">My Anthem</h1>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Spotify songs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Songs List */}
        <div className="flex-1 px-4 overflow-y-auto">
          {/* No Anthem Option */}
          <button
            onClick={selectNoAnthem}
            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 mb-4"
          >
            <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-400 rounded"></div>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              I don't want an anthem
            </span>
            {tempSelected === null && (
              <Check className="w-6 h-6 text-purple-600 ml-auto" />
            )}
          </button>

          {/* Section Header */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-semibold text-gray-400">
              Most Popular Songs
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Songs */}
          <div className="space-y-3">
            {filteredSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => selectSong(song)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 relative"
              >
                <img
                  src={song.albumArt}
                  alt={song.title}
                  className="w-15 h-15 rounded-lg object-cover"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {song.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-600">{song.artist}</span>
                  </div>
                </div>
                {tempSelected?.id === song.id && (
                  <Check className="w-6 h-6 text-purple-600" />
                )}
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
