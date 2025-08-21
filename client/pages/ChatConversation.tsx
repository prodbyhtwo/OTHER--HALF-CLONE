import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  Plus,
  Mic,
  Send,
  Camera,
  FileText,
  Image,
  Volume2,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import VoiceMessageModal from "../components/VoiceMessageModal";
import VoiceMessage from "../components/VoiceMessage";

interface Message {
  id: string;
  text?: string;
  timestamp: string;
  isSent: boolean;
  isDelivered?: boolean;
  images?: string[];
  type?: "text" | "voice";
  duration?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hi, good morning Charlotte... 😊😊",
    timestamp: "09:41",
    isSent: true,
    isDelivered: true,
  },
  {
    id: "2",
    text: "It seems we have a lot in common & have a lot of interest in each other 😊",
    timestamp: "09:41",
    isSent: true,
    isDelivered: true,
  },
  {
    id: "3",
    text: "Hello, good morning too Andrew ⚡",
    timestamp: "09:41",
    isSent: false,
  },
  {
    id: "4",
    text: "Haha, yes I've seen your profile and I'm a perfect match 😍😍",
    timestamp: "09:41",
    isSent: false,
  },
  {
    id: "5",
    text: "I want to invite you to dinner tomorrow night at 7 at Starbelly Restaurant 🍽️",
    timestamp: "09:41",
    isSent: true,
    isDelivered: true,
    images: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
    ],
  },
  {
    id: "6",
    text: "What do you think?",
    timestamp: "09:41",
    isSent: true,
    isDelivered: true,
  },
  {
    id: "7",
    type: "voice",
    duration: "09:41",
    timestamp: "09:41",
    isSent: true,
    isDelivered: true,
  },
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

const Message = ({ message }: { message: Message }) => {
  if (message.type === "voice") {
    return (
      <VoiceMessage
        duration={message.duration || "0:00"}
        timestamp={message.timestamp}
        isSent={message.isSent}
        isDelivered={message.isDelivered}
      />
    );
  }

  return (
    <div
      className={`flex ${message.isSent ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[280px] ${message.isSent ? "order-1" : "order-2"}`}
      >
        <div
          className={`rounded-3xl px-6 py-4 ${
            message.isSent
              ? "bg-purple-500 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <p className="text-base leading-relaxed">{message.text}</p>

          {message.images && (
            <div className="flex gap-2 mt-3">
              {message.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Shared image"
                  className="w-32 h-24 rounded-xl object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div
          className={`flex items-center mt-2 ${message.isSent ? "justify-end" : "justify-start"}`}
        >
          <span className="text-xs text-gray-500">{message.timestamp}</span>
          {message.isSent && message.isDelivered && (
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

const AttachmentOptions = ({ onClose }: { onClose: () => void }) => (
  <div className="absolute bottom-full left-0 right-0 bg-white rounded-t-3xl p-6 border-t border-gray-200">
    <div className="grid grid-cols-4 gap-6 mb-4">
      <button className="flex flex-col items-center">
        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-2">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <span className="text-sm text-black">Camera</span>
      </button>

      <button className="flex flex-col items-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <span className="text-sm text-black">Document</span>
      </button>

      <button className="flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
          <Image className="w-8 h-8 text-white" />
        </div>
        <span className="text-sm text-black">Gallery</span>
      </button>

      <button className="flex flex-col items-center">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-2">
          <Volume2 className="w-8 h-8 text-white" />
        </div>
        <span className="text-sm text-black">Audio</span>
      </button>
    </div>
  </div>
);

const Keyboard = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-gray-100 p-4">
    <div className="grid grid-cols-10 gap-2 mb-3">
      {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => (
        <button
          key={letter}
          className="bg-white p-3 rounded text-black font-medium"
        >
          {letter}
        </button>
      ))}
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
      <button onClick={onClose} className="bg-gray-500 p-3 rounded text-white">
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
);

const ChatConversation = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Get user name from ID (in real app, this would come from an API)
  const userName = userId === "charlotte" ? "Charlotte" : "Unknown";

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, send message to backend
      console.log("Sending message:", message);
      setMessage("");
      setShowKeyboard(false);
    }
  };

  const handleInputFocus = () => {
    setShowKeyboard(true);
    setShowAttachments(false);
  };

  const handleAttachmentClick = () => {
    setShowAttachments(!showAttachments);
    setShowKeyboard(false);
  };

  const handleVoiceMessage = () => {
    setShowVoiceModal(true);
    setShowAttachments(false);
    setShowKeyboard(false);
  };

  const handleVoiceMessageSend = (voiceText: string) => {
    // In real app, this would send the voice message to backend
    console.log("Sending voice message:", voiceText);
  };

  const handlePhoneCall = () => {
    navigate(`/voice-call/${userId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <MobileStatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button onClick={() => navigate("/chats")}>
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-xl font-semibold text-black">{userName}</h1>
        <div className="flex space-x-4">
          <button onClick={handlePhoneCall}>
            <Phone className="w-6 h-6 text-black" />
          </button>
          <button>
            <Video className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      {/* Date Header */}
      <div className="flex justify-center py-4">
        <div className="bg-gray-200 px-4 py-2 rounded-full">
          <span className="text-sm text-gray-600">Today</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {mockMessages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      {/* Attachment Options */}
      {showAttachments && (
        <AttachmentOptions onClose={() => setShowAttachments(false)} />
      )}

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAttachmentClick}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex items-center">
            <input
              type="text"
              placeholder="Send message ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={handleInputFocus}
              className="flex-1 bg-transparent text-black placeholder-gray-500 outline-none"
            />
            <button onClick={handleVoiceMessage}>
              <Mic className="w-5 h-5 text-gray-600 ml-3" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Keyboard */}
      {showKeyboard && <Keyboard onClose={() => setShowKeyboard(false)} />}

      {/* Voice Message Modal */}
      <VoiceMessageModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onSendMessage={handleVoiceMessageSend}
      />
    </div>
  );
};

export default ChatConversation;
