import React, { useState } from "react";
import { Play, Pause } from "lucide-react";

interface VoiceMessageProps {
  duration: string;
  timestamp: string;
  isSent: boolean;
  isDelivered?: boolean;
}

const VoiceMessage = ({
  duration,
  timestamp,
  isSent,
  isDelivered,
}: VoiceMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);

    if (!isPlaying) {
      // Simulate audio playback progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[300px] ${isSent ? "order-1" : "order-2"}`}>
        <div
          className={`rounded-full px-4 py-3 flex items-center gap-3 ${
            isSent ? "bg-purple-500 text-white" : "bg-gray-100 text-black"
          }`}
        >
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isSent ? "bg-white/20" : "bg-gray-200"
            }`}
          >
            {isPlaying ? (
              <Pause
                className={`w-3 h-3 ${isSent ? "text-white" : "text-gray-600"}`}
              />
            ) : (
              <Play
                className={`w-3 h-3 ${isSent ? "text-white" : "text-gray-600"}`}
              />
            )}
          </button>

          {/* Waveform/Progress */}
          <div className="flex-1 flex flex-col justify-center">
            <div
              className={`h-1 rounded-full ${isSent ? "bg-white/30" : "bg-gray-300"} relative`}
            >
              <div
                className={`h-full rounded-full ${isSent ? "bg-white" : "bg-purple-500"} transition-all duration-100`}
                style={{ width: `${progress}%` }}
              />
              {/* Progress indicator circle */}
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${isSent ? "bg-white" : "bg-purple-500"} transition-all duration-100`}
                style={{ left: `${progress}%`, marginLeft: "-4px" }}
              />
            </div>
          </div>

          {/* Duration */}
          <span
            className={`text-xs ${isSent ? "text-white" : "text-gray-600"}`}
          >
            {duration}
          </span>
        </div>

        {/* Timestamp and delivery status */}
        <div
          className={`flex items-center mt-2 ${isSent ? "justify-end" : "justify-start"}`}
        >
          <span className="text-xs text-gray-500">{timestamp}</span>
          {isSent && isDelivered && (
            <div className="ml-2 flex">
              <div className="w-3 h-3 text-purple-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
              <div className="w-3 h-3 text-purple-500 -ml-1">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;
