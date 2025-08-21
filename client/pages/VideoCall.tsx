import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Volume2,
  VideoOff,
  Mic,
  PhoneOff,
  Camera,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function VideoCall() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  // Mock user data
  const caller = {
    name: "Charlotte",
    photo:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=800&fit=crop&crop=face",
  };

  const currentUser = {
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")} minutes`;
  };

  const handleEndCall = () => {
    navigate("/chats");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <img
          src={caller.photo}
          alt={caller.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Call Info */}
      <div className="absolute bottom-40 left-4 right-4 z-10 text-center">
        <h1 className="text-4xl font-light text-white mb-2">{caller.name}</h1>
        <p className="text-white/80 text-lg">{formatDuration(callDuration)}</p>
      </div>

      {/* Small Video Preview */}
      <div className="absolute bottom-32 right-4 z-10">
        <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-white/30">
          {isVideoOff ? (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          ) : (
            <img
              src={currentUser.photo}
              alt="You"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-1 right-1">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-8 left-4 right-4 z-10">
        <div className="flex justify-center items-center space-x-6">
          {/* Speaker Toggle */}
          <button
            onClick={toggleSpeaker}
            className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md ${
              isSpeakerOn ? "bg-white/30" : "bg-black/30"
            }`}
          >
            <Volume2 className="w-7 h-7 text-white" />
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md ${
              isVideoOff ? "bg-white/30" : "bg-black/30"
            }`}
          >
            <VideoOff className="w-7 h-7 text-white" />
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md ${
              isMuted ? "bg-white/30" : "bg-black/30"
            }`}
          >
            <Mic className="w-7 h-7 text-white" />
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
