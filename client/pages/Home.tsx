import { useState, useRef, useEffect } from "react";
import {
  Heart,
  X,
  Star,
  RotateCcw,
  Send,
  Bell,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MatchModal from "../components/MatchModal";
import FilterModal from "../components/FilterModal";
import { useLoggedHandlers } from "@/components/ActionLoggerProvider";

// Mobile status bar component
const MobileStatusBar = () => (
  <div
    className="w-full h-11 flex items-center justify-between px-6 text-black text-base font-semibold"
    data-ignore-dead-scan
  >
    <div className="flex items-center">
      <span data-ignore-dead-scan>9:41</span>
    </div>
    <div className="flex items-center gap-1" data-ignore-dead-scan>
      {/* Signal bars */}
      <div className="flex items-end gap-1" data-ignore-dead-scan>
        <div
          className="w-1 h-2 bg-black rounded-sm"
          data-ignore-dead-scan
        ></div>
        <div
          className="w-1 h-3 bg-black rounded-sm"
          data-ignore-dead-scan
        ></div>
        <div
          className="w-1 h-4 bg-black rounded-sm"
          data-ignore-dead-scan
        ></div>
        <div
          className="w-1 h-5 bg-black rounded-sm"
          data-ignore-dead-scan
        ></div>
      </div>
      {/* WiFi icon */}
      <svg
        className="w-4 h-3 ml-2"
        viewBox="0 0 16 11"
        fill="black"
        data-ignore-dead-scan
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
        />
      </svg>
      {/* Battery */}
      <div
        className="ml-2 w-7 h-3 border border-black border-opacity-35 rounded-sm relative"
        data-ignore-dead-scan
      >
        <div
          className="absolute inset-0.5 bg-black rounded-sm"
          data-ignore-dead-scan
        ></div>
        <div
          className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-black bg-opacity-40 rounded-r"
          data-ignore-dead-scan
        ></div>
      </div>
    </div>
  </div>
);

// Header component
const Header = ({
  onFilterClick,
  onNotificationClick,
}: {
  onFilterClick: () => void;
  onNotificationClick: () => void;
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white">
      <div className="w-10 h-10 rounded-full bg-[#9610FF] flex items-center justify-center">
        <Heart className="w-6 h-6 text-white fill-current" />
      </div>
      <h1 className="text-2xl font-bold text-black">Datify</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={onNotificationClick}
          data-action="click_header_notifications"
          className="relative"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">3</span>
          </div>
        </button>
        <button onClick={onFilterClick} data-action="click_header_filter">
          <Filter className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// Action button component
const ActionButton = ({
  icon,
  color,
  size = "w-14 h-14",
  onClick,
  actionId,
}: {
  icon: React.ReactNode;
  color: string;
  size?: string;
  onClick?: () => void;
  actionId?: string;
}) => (
  <button
    onClick={onClick}
    data-action={actionId ? `click_action_${actionId}` : undefined}
    className={`${size} rounded-full ${color} flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95`}
  >
    {icon}
  </button>
);

// Profile card component
const ProfileCard = ({
  profile,
  onSwipe,
  onSuperLike,
}: {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
  onSuperLike: () => void;
}) => {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showOverlay, setShowOverlay] = useState<
    "like" | "nope" | "super" | null
  >(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart || !isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setDragOffset({ x: deltaX, y: deltaY });

    // Show overlay based on drag direction
    if (Math.abs(deltaX) > 50) {
      setShowOverlay(deltaX > 0 ? "like" : "nope");
    } else {
      setShowOverlay(null);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const threshold = 100;

    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? "right" : "left");
    }

    // Reset
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setShowOverlay(null);
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) * 0.002;

  return (
    <div
      ref={cardRef}
      data-action="swipe_profile_card"
      className="absolute inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: opacity,
        zIndex: isDragging ? 50 : "auto",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Profile Image */}
      <div className="relative h-full">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-full object-cover"
          data-ignore-dead-scan
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
          data-ignore-dead-scan
        ></div>

        {/* Swipe overlay */}
        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`px-8 py-4 rounded-xl border-4 text-4xl font-bold transform ${
                showOverlay === "like"
                  ? "border-[#9610FF] text-[#9610FF] bg-white bg-opacity-95 rotate-12 shadow-2xl"
                  : showOverlay === "super"
                    ? "border-[#FF981F] text-[#FF981F] bg-white bg-opacity-95 -rotate-8 shadow-2xl scale-110"
                    : "border-red-500 text-red-500 bg-white bg-opacity-95 -rotate-12 shadow-2xl"
              } backdrop-blur-sm`}
              style={{
                textShadow: "0 2px 8px rgba(0,0,0,0.1)",
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
              }}
            >
              {showOverlay === "like"
                ? "LIKE!"
                : showOverlay === "super"
                  ? "SUPER LIKE!"
                  : "NOPE"}
            </div>
          </div>
        )}

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold mb-1">
            {profile.name} ({profile.age})
          </h2>
          <p className="text-lg opacity-90">{profile.distance} km away</p>
        </div>

        {/* Photo indicators */}
        <div
          className="absolute top-4 left-4 right-4 flex gap-2"
          data-ignore-dead-scan
        >
          {profile.photos.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index === 0 ? "bg-[#9610FF]" : "bg-white bg-opacity-30"
              }`}
              data-ignore-dead-scan
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Bottom navigation component
const BottomNavigation = ({
  onMatchesClick,
  onChatsClick,
  onProfileClick,
}: {
  onMatchesClick: () => void;
  onChatsClick: () => void;
  onProfileClick: () => void;
}) => {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-2">
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 rounded-full bg-[#9610FF] flex items-center justify-center mb-1">
            <Heart className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="text-xs font-medium text-[#9610FF]">Home</span>
        </div>

        <button
          onClick={onMatchesClick}
          data-action="click_nav_matches"
          className="flex flex-col items-center py-2"
        >
          <Star className="w-6 h-6 text-gray-400 mb-1" />
          <span className="text-xs text-gray-400">Matches</span>
        </button>

        <button
          onClick={onChatsClick}
          data-action="click_nav_chats"
          className="flex flex-col items-center py-2"
        >
          <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center mb-1">
            <div className="w-4 h-3 border-2 border-gray-400 rounded-sm"></div>
          </div>
          <span className="text-xs text-gray-400">Chats</span>
        </button>

        <button
          onClick={onProfileClick}
          data-action="click_nav_profile"
          className="flex flex-col items-center py-2"
        >
          <div className="w-6 h-6 rounded-full bg-gray-200 mb-1"></div>
          <span className="text-xs text-gray-400">Profile</span>
        </button>
      </div>
    </div>
  );
};

// Profile data interface
interface Profile {
  id: number;
  name: string;
  age: number;
  distance: number;
  image: string;
  photos: string[];
}

// Sample profiles
const profiles: Profile[] = [
  {
    id: 1,
    name: "Monica",
    age: 24,
    distance: 5,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=400&h=600&fit=crop&crop=face",
    photos: ["1", "2", "3", "4", "5"],
  },
  {
    id: 2,
    name: "Isabella",
    age: 22,
    distance: 4,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face",
    photos: ["1", "2", "3", "4", "5", "6"],
  },
  {
    id: 3,
    name: "Emma",
    age: 26,
    distance: 3,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
    photos: ["1", "2", "3"],
  },
  {
    id: 4,
    name: "Sofia",
    age: 23,
    distance: 7,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
    photos: ["1", "2", "3", "4"],
  },
];

export default function Home() {
  const { createClickHandler, createActionHandler } = useLoggedHandlers();
  const navigate = useNavigate();
  const [currentProfiles, setCurrentProfiles] = useState(profiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const userProfile = {
    name: "You",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  };

  const handleSwipe = createActionHandler(
    "profile_swipe",
    (direction: "left" | "right") => {
      // Simulate match on right swipe (20% chance)
      if (direction === "right" && Math.random() > 0.8) {
        setMatchedProfile(currentProfiles[currentIndex]);
        setShowMatchModal(true);
      }

      const nextIndex = currentIndex + 1;

      if (nextIndex < currentProfiles.length) {
        setCurrentIndex(nextIndex);
      } else {
        // Reset to show profiles again (in a real app, you'd fetch new profiles)
        setCurrentIndex(0);
      }
    },
  );

  const handleSuperLike = createActionHandler("profile_super_like", () => {
    // Always show match modal on super like
    setMatchedProfile(currentProfiles[currentIndex]);
    setShowMatchModal(true);
    handleSwipe("right");
  });

  const handleAction = createActionHandler(
    "profile_action",
    (action: "pass" | "like" | "super" | "rewind" | "boost") => {
      switch (action) {
        case "pass":
          handleSwipe("left");
          break;
        case "like":
          handleSwipe("right");
          break;
        case "super":
          handleSuperLike();
          break;
        case "rewind":
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
          break;
        case "boost":
          // Handle boost action
          break;
      }
    },
  );

  const handleFilterApply = (filters: any) => {
    // In a real app, you would apply these filters to fetch new profiles
    console.log("Applied filters:", filters);
    // For now, we'll just reset to the beginning
    setCurrentIndex(0);
  };

  const currentProfile = currentProfiles[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Status Bar */}
      <MobileStatusBar />

      {/* Header */}
      <Header
        onFilterClick={createClickHandler("filter_modal_open", "button", () =>
          setShowFilterModal(true),
        )}
        onNotificationClick={createClickHandler(
          "header_notifications",
          "button",
          () => navigate("/notifications"),
        )}
      />

      {/* Profile Cards Container */}
      <div className="flex-1 relative">
        {currentProfile && (
          <ProfileCard
            profile={currentProfile}
            onSwipe={handleSwipe}
            onSuperLike={handleSuperLike}
          />
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-4">
            <ActionButton
              icon={<RotateCcw className="w-6 h-6 text-yellow-500" />}
              color="bg-white border-2 border-yellow-500"
              onClick={() => handleAction("rewind")}
              actionId="rewind"
            />
            <ActionButton
              icon={<X className="w-8 h-8 text-red-500" />}
              color="bg-white border-2 border-red-500"
              size="w-16 h-16"
              onClick={() => handleAction("pass")}
              actionId="pass"
            />
            <ActionButton
              icon={<Star className="w-6 h-6 text-blue-500 fill-current" />}
              color="bg-white border-2 border-blue-500"
              onClick={() => handleAction("super")}
              actionId="super"
            />
            <ActionButton
              icon={<Heart className="w-8 h-8 text-[#9610FF] fill-current" />}
              color="bg-[#9610FF]"
              size="w-16 h-16"
              onClick={() => handleAction("like")}
              actionId="like"
            />
            <ActionButton
              icon={<Send className="w-6 h-6 text-purple-500" />}
              color="bg-white border-2 border-purple-500"
              onClick={() => handleAction("boost")}
              actionId="boost"
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        onMatchesClick={createClickHandler("nav_matches", "button", () =>
          navigate("/matches"),
        )}
        onChatsClick={createClickHandler("nav_chats", "button", () =>
          navigate("/chats"),
        )}
        onProfileClick={createClickHandler("nav_profile", "button", () =>
          navigate("/profile"),
        )}
      />

      {/* Match Modal */}
      {matchedProfile && (
        <MatchModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          userProfile={userProfile}
          matchProfile={{
            name: matchedProfile.name,
            image: matchedProfile.image,
          }}
          onStartChat={() => {
            setShowMatchModal(false);
            // Navigate to chat or handle chat start
          }}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
}
