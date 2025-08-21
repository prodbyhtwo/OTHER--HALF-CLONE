import React from "react";
import { Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatar: string;
  isOnline: boolean;
}

const conversations: Conversation[] = [
  {
    id: "charlotte",
    name: "Charlotte",
    lastMessage: "Haha, yes I've seen your profil...",
    timestamp: "09:41",
    unreadCount: 1,
    avatar:
      "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=80&h=80&fit=crop&crop=face",
    isOnline: true,
  },
  {
    id: "aurora",
    name: "Aurora",
    lastMessage: "Wow, this is really epic 👍",
    timestamp: "08:54",
    unreadCount: 3,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=80&h=80&fit=crop&crop=face",
    isOnline: true,
  },
  {
    id: "victoria",
    name: "Victoria",
    lastMessage: "Thank you so much andrew 🔥",
    timestamp: "01:27",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=face",
    isOnline: false,
  },
  {
    id: "emilia",
    name: "Emilia",
    lastMessage: "Wow love it! ❤️",
    timestamp: "Yesterday",
    unreadCount: 2,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    isOnline: true,
  },
  {
    id: "natalie",
    name: "Natalie",
    lastMessage: "I know... I'm trying to get the ...",
    timestamp: "Yesterday",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    isOnline: false,
  },
  {
    id: "scarlett",
    name: "Scarlett",
    lastMessage: "It's strong not just fabulous! 😂",
    timestamp: "Dec 20, 2023",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    isOnline: false,
  },
  {
    id: "caroline",
    name: "Caroline",
    lastMessage: "Can't wait to see you again!",
    timestamp: "Dec 19, 2023",
    avatar:
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=80&h=80&fit=crop&crop=face",
    isOnline: false,
  },
];

const nowActiveProfiles = [
  {
    id: "1",
    name: "Aurora",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Charlotte",
    avatar:
      "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Victoria",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Emma",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Emilia",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face",
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

const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${conversation.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer"
    >
      <div className="relative mr-4">
        <img
          src={conversation.avatar}
          alt={conversation.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        {conversation.isOnline && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-black text-lg truncate">
            {conversation.name}
          </h3>
          <span className="text-gray-500 text-sm ml-2 flex-shrink-0">
            {conversation.timestamp}
          </span>
        </div>
        <p className="text-gray-600 text-sm truncate">
          {conversation.lastMessage}
        </p>
      </div>

      {conversation.unreadCount && (
        <div className="ml-3 flex-shrink-0">
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {conversation.unreadCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const NowActiveItem = ({
  profile,
}: {
  profile: (typeof nowActiveProfiles)[0];
}) => (
  <div className="flex flex-col items-center mr-4">
    <div className="relative">
      <img
        src={profile.avatar}
        alt={profile.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
    </div>
  </div>
);

const Chats = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <MobileStatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-black">Chats</h1>
        <div className="flex space-x-4">
          <button>
            <Search className="w-6 h-6 text-black" />
          </button>
          <button>
            <MoreVertical className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      {/* Now Active Section */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Now Active</h2>
          <button className="text-purple-500 font-medium">See All</button>
        </div>

        <div className="flex overflow-x-auto space-x-4 pb-2">
          {nowActiveProfiles.map((profile) => (
            <NowActiveItem key={profile.id} profile={profile} />
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="pb-24">
        {conversations.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
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
          <button
            onClick={() => navigate("/matches")}
            className="flex flex-col items-center py-2"
          >
            <div className="w-6 h-6 flex items-center justify-center mb-1">
              <div className="w-4 h-4 border-2 border-gray-400"></div>
            </div>
            <span className="text-xs text-gray-400">Matches</span>
          </button>
          <button className="flex flex-col items-center py-2">
            <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center mb-1">
              <div className="w-4 h-3 border-2 border-white rounded-sm"></div>
            </div>
            <span className="text-xs text-purple-500 font-medium">Chats</span>
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
    </div>
  );
};

export default Chats;
