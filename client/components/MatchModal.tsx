import { Heart } from "lucide-react";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: {
    name: string;
    image: string;
  };
  matchProfile: {
    name: string;
    image: string;
  };
  onStartChat: () => void;
}

// Heart shapes background component
const HeartsBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Floating hearts */}
    <Heart
      className="absolute top-12 left-8 w-6 h-6 text-[#C4A3E8] fill-current animate-pulse"
      style={{ animationDelay: "0s" }}
    />
    <Heart
      className="absolute top-20 right-12 w-8 h-8 text-[#B18CE8] fill-current animate-pulse"
      style={{ animationDelay: "1s" }}
    />
    <Heart
      className="absolute top-32 left-16 w-4 h-4 text-[#D4B8E8] fill-current animate-pulse"
      style={{ animationDelay: "0.5s" }}
    />
    <Heart
      className="absolute top-40 right-8 w-5 h-5 text-[#C4A3E8] fill-current animate-pulse"
      style={{ animationDelay: "1.5s" }}
    />
    <Heart
      className="absolute bottom-32 left-12 w-7 h-7 text-[#B18CE8] fill-current animate-pulse"
      style={{ animationDelay: "2s" }}
    />
    <Heart
      className="absolute bottom-20 right-16 w-6 h-6 text-[#D4B8E8] fill-current animate-pulse"
      style={{ animationDelay: "2.5s" }}
    />
    <Heart
      className="absolute bottom-40 left-20 w-4 h-4 text-[#C4A3E8] fill-current animate-pulse"
      style={{ animationDelay: "0.3s" }}
    />
    <Heart
      className="absolute top-16 right-20 w-5 h-5 text-[#B18CE8] fill-current animate-pulse"
      style={{ animationDelay: "1.8s" }}
    />
  </div>
);

// Overlapping hearts component with profile pictures
const OverlappingHearts = ({
  userProfile,
  matchProfile,
}: {
  userProfile: { image: string };
  matchProfile: { image: string };
}) => (
  <div className="relative flex items-center justify-center mb-8">
    {/* Left heart - User */}
    <div className="relative">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#9610FF] to-[#B347C9] p-1">
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={userProfile.image}
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Heart shape border overlay */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(45deg, #9610FF 0%, #B347C9 100%)`,
          clipPath:
            "polygon(50% 15%, 60% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 40% 35%)",
        }}
      ></div>
    </div>

    {/* Right heart - Match */}
    <div className="relative -ml-8 z-10">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#9610FF] to-[#B347C9] p-1">
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={matchProfile.image}
            alt="Match profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Heart shape border overlay */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(45deg, #9610FF 0%, #B347C9 100%)`,
          clipPath:
            "polygon(50% 15%, 60% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 40% 35%)",
        }}
      ></div>
    </div>
  </div>
);

export default function MatchModal({
  isOpen,
  onClose,
  userProfile,
  matchProfile,
  onStartChat,
}: MatchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 mx-auto animate-in zoom-in-95 duration-300">
        {/* Hearts Background */}
        <HeartsBackground />

        {/* Overlapping Profile Hearts */}
        <div className="relative z-10 flex flex-col items-center">
          <OverlappingHearts
            userProfile={userProfile}
            matchProfile={matchProfile}
          />

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#9610FF] mb-4">
              You Got the Match!
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              You both liked each other. Take charge and start a meaningful
              conversation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <button
              onClick={onStartChat}
              className="w-full bg-[#9610FF] text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-[#8510E6] transition-colors"
            >
              Let's Chat
            </button>

            <button
              onClick={onClose}
              className="w-full bg-[#F7ECFF] text-[#9610FF] font-bold py-4 px-6 rounded-full text-lg hover:bg-[#F0E0FF] transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
