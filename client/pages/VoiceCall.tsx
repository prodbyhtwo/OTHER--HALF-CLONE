import React, { useState, useEffect } from "react";
import { ArrowLeft, Volume2, Mic, PhoneOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const MobileStatusBar = () => (
  <div className="flex justify-between items-center px-6 py-2">
    <span className="text-white font-medium">9:41</span>
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <div className="w-1 h-3 bg-white rounded-full"></div>
        <div className="w-1 h-3 bg-white rounded-full"></div>
        <div className="w-1 h-3 bg-white rounded-full"></div>
        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
      </div>
      <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none">
        <path
          d="M2 4C2 2.89543 2.89543 2 4 2H20C21.1046 2 22 2.89543 22 4V12C22 13.1046 21.1046 14 20 14H4C2.89543 14 2 13.1046 2 12V4Z"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
        <path d="M6 6V10M10 6V10M14 6V10" stroke="white" strokeWidth="1" />
        <path d="M18 8H20" stroke="white" strokeWidth="1" />
      </svg>
    </div>
  </div>
);

const VoiceCall = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [duration, setDuration] = useState(385); // 6:25 in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  // Get user name from ID (in real app, this would come from an API)
  const userName = userId === "charlotte" ? "Charlotte" : "Unknown";
  const userAvatar =
    "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=200&h=200&fit=crop&crop=face";

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")} minutes`;
  };

  const handleEndCall = () => {
    navigate(`/chat/${userId}`);
  };

  const handleGoBack = () => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600">
        {/* Additional gradient shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-orange-400/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-cyan-400/50 rounded-full blur-2xl"></div>
      </div>

      {/* Status Bar */}
      <MobileStatusBar />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-[calc(100vh-44px)] justify-between p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={handleGoBack}>
            <ArrowLeft className="w-7 h-7 text-white" />
          </button>
          <div className="w-7 h-7"></div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-6 flex-1 justify-center">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={userAvatar}
              alt={userName}
              className="w-48 h-48 rounded-full object-cover border-4 border-white/20"
            />
            {/* Pulse animation for active call */}
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
          </div>

          {/* User Info */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white">{userName}</h1>
            <p className="text-lg text-white/90">{formatDuration(duration)}</p>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center space-x-5 pb-8">
          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isSpeakerOn
                ? "bg-white/40 backdrop-blur-sm"
                : "bg-white/20 backdrop-blur-sm"
            } shadow-lg`}
          >
            <Volume2 className="w-7 h-7 text-white" />
          </button>

          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? "bg-white/40 backdrop-blur-sm"
                : "bg-white/20 backdrop-blur-sm"
            } shadow-lg`}
          >
            <Mic
              className={`w-7 h-7 ${isMuted ? "text-red-400" : "text-white"}`}
            />
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCall;
