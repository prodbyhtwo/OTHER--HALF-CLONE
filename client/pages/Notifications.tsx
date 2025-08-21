import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, ChevronRight } from "lucide-react";

// Mobile status bar component
const MobileStatusBar = () => (
  <div className="w-full h-11 flex items-center justify-between px-6 text-black text-base font-semibold">
    <div className="flex items-center">
      <span>9:41</span>
    </div>
    <div className="flex items-center gap-1">
      {/* Signal bars */}
      <div className="flex items-end gap-1">
        <div className="w-1 h-2 bg-black rounded-sm"></div>
        <div className="w-1 h-3 bg-black rounded-sm"></div>
        <div className="w-1 h-4 bg-black rounded-sm"></div>
        <div className="w-1 h-5 bg-black rounded-sm"></div>
      </div>
      {/* WiFi icon */}
      <svg className="w-4 h-3 ml-2" viewBox="0 0 16 11" fill="black">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
        />
      </svg>
      {/* Battery */}
      <div className="ml-2 w-7 h-3 border border-black border-opacity-35 rounded-sm relative">
        <div className="absolute inset-0.5 bg-black rounded-sm"></div>
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-black bg-opacity-40 rounded-r"></div>
      </div>
    </div>
  </div>
);

// Header component
const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-6 py-3">
      <button onClick={() => navigate(-1)} className="p-2 -ml-2">
        <ArrowLeft className="w-6 h-6 text-black" />
      </button>
      <h1 className="text-2xl font-bold text-black">Notification</h1>
      <button className="p-2 -mr-2">
        <Settings className="w-6 h-6 text-black" />
      </button>
    </div>
  );
};

// Section divider component
const SectionDivider = ({ title }: { title: string }) => (
  <div className="flex items-center gap-4 px-6 mb-5">
    <span className="text-sm font-semibold text-gray-500">{title}</span>
    <div className="flex-1 h-px bg-gray-200"></div>
  </div>
);

// Notification item component
const NotificationItem = ({
  type,
  title,
  description,
  time,
  avatar,
  icon,
}: {
  type: "profile" | "icon";
  title: string;
  description: string;
  time: string;
  avatar?: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50">
    <div className="flex-shrink-0">
      {type === "profile" && avatar ? (
        <img
          src={avatar}
          alt="Profile"
          className="w-15 h-15 rounded-lg object-cover"
        />
      ) : (
        <div className="w-15 h-15 rounded-full border border-gray-200 flex items-center justify-center bg-white">
          {icon}
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-semibold text-black mb-1">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-2">
        {description}
      </p>
      <span className="text-xs text-gray-500">{time}</span>
    </div>

    <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0 mt-2" />
  </div>
);

// Event icon component
const EventIcon = () => (
  <svg className="w-7 h-7 text-black" viewBox="0 0 28 28" fill="none">
    <path
      d="M19.833 12.25H15.333L18.083 9.5L19.833 12.25Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 2.33325C7.552 2.33325 2.333 7.55225 2.333 13.9999C2.333 20.4476 7.552 25.6666 14 25.6666C20.448 25.6666 25.667 20.4476 25.667 13.9999C25.667 7.55225 20.448 2.33325 14 2.33325ZM14 23.3333C8.84 23.3333 4.667 19.1596 4.667 13.9999C4.667 8.84025 8.84 4.66659 14 4.66659C19.16 4.66659 23.333 8.84025 23.333 13.9999C23.333 19.1596 19.16 23.3333 14 23.3333Z"
      fill="currentColor"
    />
    <path
      d="M16.333 10.4999H11.667L14 8.16659L16.333 10.4999Z"
      fill="currentColor"
    />
  </svg>
);

// Security shield icon component
const SecurityIcon = () => (
  <svg className="w-7 h-7 text-black" viewBox="0 0 28 28" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5653 4.08325C13.576 4.08325 7.33429 6.28125 6.61445 6.88209C6.40212 7.09558 6.39395 7.46659 6.43945 9.95042C6.46045 11.1474 6.48962 12.7738 6.48962 15.0254C6.48962 21.0933 13.1653 23.7871 14.5641 24.2829C15.9618 23.7847 22.641 21.0758 22.641 15.0254C22.641 12.7714 22.6701 11.1439 22.6923 9.94692C22.7366 7.46542 22.7285 7.09442 22.5033 6.87042C21.7975 6.28125 15.5546 4.08325 14.5653 4.08325ZM14.5653 26.0819C14.4801 26.0819 14.395 26.0702 14.3121 26.0446C13.9213 25.9268 4.73962 23.0544 4.73962 15.0254C4.73962 12.7889 4.71045 11.1708 4.68945 9.98309C4.63579 7.01625 4.62412 6.39792 5.39062 5.63259C6.30645 4.71442 13.2423 2.33325 14.5653 2.33325C15.8871 2.33325 22.823 4.71442 23.7411 5.63259C24.5065 6.39792 24.4948 7.01625 24.4411 9.97958C24.4201 11.1673 24.391 12.7854 24.391 15.0254C24.391 23.0544 15.2093 25.9268 14.8185 26.0446C14.7356 26.0702 14.6505 26.0819 14.5653 26.0819Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.7423 16.9394C13.5102 16.9394 13.2873 16.8472 13.1228 16.6827L10.9155 14.473C10.5748 14.1312 10.5748 13.5759 10.9167 13.2352C11.2573 12.8934 11.8127 12.8934 12.1545 13.2352L13.7423 14.8254L17.6717 10.896C18.0135 10.5542 18.5665 10.5542 18.9083 10.896C19.2502 11.2379 19.2502 11.792 18.9083 12.1339L14.3607 16.6827C14.1973 16.8472 13.9745 16.9394 13.7423 16.9394Z"
      fill="currentColor"
    />
  </svg>
);

// Star icon component
const StarIcon = () => (
  <svg className="w-7 h-7 text-black" viewBox="0 0 28 28" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.7069 2.25C11.6008 2.25 11.3394 2.27917 11.2006 2.55683L9.07027 6.81633C8.7331 7.4895 8.08327 7.95733 7.33193 8.06467L2.5626 8.75183C2.2476 8.79733 2.14027 9.03067 2.1076 9.12867C2.07843 9.22317 2.03177 9.4635 2.24877 9.67117L5.69743 12.9845C6.24693 13.513 6.4966 14.2748 6.36593 15.0203L5.55393 19.6987C5.50377 19.9915 5.68693 20.1618 5.7686 20.2202C5.85493 20.2855 6.08593 20.415 6.37177 20.2657L10.6359 18.0548C11.3079 17.7083 12.1083 17.7083 12.7779 18.0548L17.0409 20.2645C17.3279 20.4127 17.5589 20.2832 17.6464 20.2202C17.7281 20.1618 17.9113 19.9915 17.8611 19.6987L17.0468 15.0203C16.9161 14.2748 17.1658 13.513 17.7153 12.9845L21.1639 9.67117C21.3821 9.4635 21.3354 9.222 21.3051 9.12867C21.2736 9.03067 21.1663 8.79733 20.8513 8.75183L16.0819 8.06467C15.3318 7.95733 14.6819 7.4895 14.3448 6.81517L12.2121 2.55683C12.0744 2.27917 11.8131 2.25 11.7069 2.25ZM6.10343 22.0833C5.6216 22.0833 5.14327 21.9317 4.73377 21.633C4.02677 21.115 3.68027 20.2598 3.83077 19.3988L4.64277 14.7205C4.6731 14.5467 4.6136 14.3705 4.48527 14.2468L1.0366 10.9335C0.401933 10.3257 0.174433 9.42733 0.442767 8.59317C0.713433 7.74967 1.42977 7.1465 2.31293 7.0205L7.08227 6.33333C7.2666 6.30767 7.42527 6.1945 7.5046 6.0335L9.6361 1.77283C10.0293 0.987667 10.8226 0.5 11.7069 0.5C12.5913 0.5 13.3846 0.987667 13.7778 1.77283L15.9104 6.03233C15.9909 6.1945 16.1484 6.30767 16.3316 6.33333L21.1009 7.0205C21.9841 7.1465 22.7004 7.74967 22.9711 8.59317C23.2394 9.42733 23.0108 10.3257 22.3761 10.9335L18.9274 14.2468C18.7991 14.3705 18.7408 14.5467 18.7711 14.7193L19.5843 19.3988C19.7336 20.261 19.3871 21.1162 18.6789 21.633C17.9614 22.1592 17.0269 22.2303 16.2348 21.8173L11.9729 19.6088C11.8061 19.5225 11.6066 19.5225 11.4398 19.6088L7.17793 21.8185C6.83727 21.9958 6.46977 22.0833 6.10343 22.0833Z"
      fill="currentColor"
    />
  </svg>
);

export default function Notifications() {
  const notifications = [
    {
      section: "Today",
      items: [
        {
          type: "profile" as const,
          title: "New Match Alert! 🎉",
          description:
            "You've got a new match waiting to connect with you. Start a conversation!",
          time: "09:40 AM",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=120&h=120&fit=crop&crop=face",
        },
        {
          type: "icon" as const,
          title: "Exclusive Event Alert 🎉",
          description:
            "Join our singles event this weekend! Meet new people & more social. RSVP now!",
          time: "08:29 AM",
          icon: <EventIcon />,
        },
      ],
    },
    {
      section: "Yesterday",
      items: [
        {
          type: "profile" as const,
          title: "New Connection Request 👩‍❤️‍👨",
          description:
            "Someone wants to connect with you. Accept their request and start chat now!",
          time: "20:30 PM",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
        },
        {
          type: "icon" as const,
          title: "Account Security Alert 🔒",
          description:
            "We've detected unusual activity. Please verify your account for added security.",
          time: "14:56 PM",
          icon: <SecurityIcon />,
        },
      ],
    },
    {
      section: "Dec 20, 2023",
      items: [
        {
          type: "profile" as const,
          title: "Unread Message Reminder 💌",
          description:
            "Don't leave them hanging! You have unread messages from your matches.",
          time: "16:44 PM",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
        },
        {
          type: "icon" as const,
          title: "Unlock Premium Features 🌟",
          description:
            "Upgrade to Premium for exclusive benefits & enhance your experience!",
          time: "10:30 AM",
          icon: <StarIcon />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto">
      {/* Mobile Status Bar */}
      <MobileStatusBar />

      {/* Header */}
      <Header />

      {/* Notifications Content */}
      <div className="flex-1 py-6">
        {notifications.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-7">
            <SectionDivider title={section.section} />
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <NotificationItem
                  key={itemIndex}
                  type={item.type}
                  title={item.title}
                  description={item.description}
                  time={item.time}
                  avatar={item.avatar}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
