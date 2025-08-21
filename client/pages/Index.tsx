import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Mobile status bar component
const MobileStatusBar = () => (
  <div className="w-full h-11 flex items-center justify-between px-6 text-white text-base font-semibold">
    <div className="flex items-center">
      <span>9:41</span>
    </div>
    <div className="flex items-center gap-1">
      {/* Signal bars */}
      <div className="flex items-end gap-1">
        <div className="w-1 h-2 bg-white rounded-sm"></div>
        <div className="w-1 h-3 bg-white rounded-sm"></div>
        <div className="w-1 h-4 bg-white rounded-sm"></div>
        <div className="w-1 h-5 bg-white rounded-sm"></div>
      </div>
      {/* WiFi icon */}
      <svg className="w-4 h-3 ml-2" viewBox="0 0 16 11" fill="white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
        />
      </svg>
      {/* Battery */}
      <div className="ml-2 w-7 h-3 border border-white border-opacity-35 rounded-sm relative">
        <div className="absolute inset-0.5 bg-white rounded-sm"></div>
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-white bg-opacity-40 rounded-r"></div>
      </div>
    </div>
  </div>
);

// Floating heart component
const FloatingHeart = ({
  size = "w-8 h-8",
  opacity = "opacity-20",
  delay = "0s",
  duration = "8s",
  x = "50%",
  y = "50%",
}) => (
  <div
    className={`absolute ${size} ${opacity} animate-pulse`}
    style={{
      left: x,
      top: y,
      animationDelay: delay,
      animationDuration: duration,
    }}
  >
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </div>
);

// Datify logo component
const DatifyLogo = () => (
  <svg className="w-40 h-40 mx-auto mb-8" viewBox="0 0 160 160" fill="none">
    <path
      d="M90.5816 68.5545C91.8176 68.5214 92.8727 67.5294 92.9631 66.2601V65.9014C93.0535 61.6774 90.4942 57.8515 86.6026 56.3741C85.3666 55.949 84.0101 56.6153 83.558 57.8816C83.1359 59.1479 83.7991 60.5347 85.0651 60.9839C86.9974 61.7076 88.2907 63.61 88.2907 65.7175V65.8109C88.2334 66.5013 88.4414 67.1676 88.8634 67.6802C89.2854 68.1927 89.9184 68.4912 90.5816 68.5545Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M70.9578 131.266C104.256 131.266 131.248 104.27 131.248 70.9662C131.248 37.6629 104.256 10.6667 70.9578 10.6667C37.6598 10.6667 10.668 37.6629 10.668 70.9662C10.668 80.6142 12.9349 89.7314 16.9562 97.8176C18.0293 99.9643 18.3851 102.418 17.7641 104.74L14.1768 118.163C13.8228 119.491 13.8242 120.888 14.1807 122.216C14.5372 123.543 15.2363 124.753 16.2079 125.725C17.1796 126.697 18.3896 127.396 19.7167 127.752C21.0437 128.109 22.4412 128.11 23.769 127.756L37.1895 124.168C39.5191 123.582 41.9827 123.867 44.1168 124.97C52.4544 129.123 61.6437 131.278 70.9578 131.266ZM82.5632 46.8469C84.4653 46.8469 86.3645 47.1153 88.1701 47.7213C99.2965 51.3392 103.306 63.5497 99.9566 74.2227C98.0575 79.6766 94.9527 84.6544 90.8861 88.7215C85.0652 94.3594 78.6776 99.3642 71.8016 103.676L71.048 104.131L70.2642 103.645C63.3641 99.3642 56.9403 94.3594 51.0651 88.6914C47.0258 84.6242 43.9178 79.6766 41.9886 74.2227C38.5822 63.5497 42.5914 51.3392 53.8385 47.658C54.7126 47.3565 55.614 47.1454 56.5183 47.0278H56.88C57.7271 46.9042 58.5681 46.8469 59.4122 46.8469H59.7437C61.6428 46.9042 63.4816 47.2358 65.2632 47.8419H65.441C65.5616 47.8991 65.6521 47.9624 65.7123 48.0198C66.3786 48.2338 67.0085 48.475 67.6115 48.8066L68.757 49.3192C69.0337 49.4668 69.3444 49.6924 69.6131 49.8876C69.7829 50.0108 69.9365 50.1223 70.0532 50.1935L70.2028 50.2812C70.4607 50.4318 70.7309 50.5896 70.9575 50.7633C74.3066 48.2037 78.3731 46.8168 82.5632 46.8469Z"
      fill="white"
    />
    <path
      d="M58.8998 137.022C68.7714 145.007 81.0887 149.354 93.785 149.333C101.896 149.345 109.91 147.574 117.26 144.144L142.691 149.222C143.587 149.401 144.513 149.355 145.388 149.09C146.262 148.825 147.057 148.348 147.703 147.702C148.349 147.056 148.826 146.26 149.091 145.386C149.356 144.511 149.402 143.585 149.223 142.689L144.146 117.265C147.57 109.908 149.341 101.89 149.335 93.7748C149.351 81.0839 145.005 68.7731 137.025 58.9063C138.602 67.1257 138.628 75.5675 137.103 83.7965C139.435 93.9818 138.117 104.663 133.381 113.976C132.813 115.089 132.637 116.361 132.881 117.587L136.703 136.699L117.605 132.877C116.376 132.630 115.099 132.806 113.983 133.377C104.672 138.119 93.9916 139.437 83.8083 137.099C75.5737 138.632 67.1246 138.606 58.8998 137.022Z"
      fill="white"
    />
  </svg>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="w-20 h-20 relative">
    <svg className="w-full h-full animate-spin" viewBox="0 0 90 90" fill="none">
      <path
        d="M62.4714 17.0297C62.9412 16.5056 63.5097 16.0792 64.1444 15.7749C64.779 15.4706 65.4674 15.2943 66.1702 15.2562C66.8731 15.218 67.5765 15.3187 68.2404 15.5526C68.9042 15.7864 69.5155 16.1488 70.0393 16.619C73.965 20.1327 77.1043 24.4359 79.2516 29.2469C81.399 34.058 82.5059 39.2683 82.5 44.5368C82.5 65.2511 65.7107 82.0368 45 82.0368V71.3225C50.422 71.3226 55.7164 69.6772 60.1832 66.6039C64.65 63.5306 68.079 59.174 70.0169 54.1102C71.9547 49.0463 72.3102 43.5136 71.0363 38.2434C69.7623 32.9732 66.919 28.2136 62.8821 24.594C61.8247 23.6453 61.1874 22.3154 61.1104 20.8969C61.0334 19.4784 61.5229 18.0873 62.4714 17.0297Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M38.7464 7.55821C40.1344 7.35195 41.5479 7.69851 42.6831 8.52341C43.8183 9.3483 44.5845 10.5857 44.817 11.9695C45.0495 13.3533 44.7297 14.7732 43.9265 15.9237C43.1232 17.0743 41.9006 17.8638 40.5214 18.1225C34.2826 19.182 28.6202 22.4154 24.5373 27.2501C20.4543 32.0848 18.2144 38.2087 18.2143 44.5368C18.2143 51.6408 21.0363 58.4538 26.0596 63.4771C31.0829 68.5004 37.896 71.3225 45 71.3225V82.0368C24.2893 82.0368 7.5 65.251 7.5 44.5368C7.5 26.1618 20.8071 10.5725 38.7464 7.55821Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="63.75"
          y1="15.2483"
          x2="45"
          y2="71.3204"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default function Index() {
  const [mounted, setMounted] = useState(false);
  const [inviteOnlyMode, setInviteOnlyMode] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);

    // Check system settings
    const checkSettings = async () => {
      try {
        const response = await fetch("/api/settings/invite-only-mode");
        if (response.ok) {
          const data = await response.json();
          setInviteOnlyMode(data.invite_only_mode);
        }
      } catch (error) {
        console.error("Failed to check settings:", error);
        setInviteOnlyMode(false);
      }
    };

    checkSettings();

    // Auto navigate to loading screen after 3 seconds
    const timer = setTimeout(() => {
      navigate("/loading");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#9610FF] relative overflow-hidden flex flex-col">
      {/* Mobile Status Bar */}
      <MobileStatusBar />

      {/* Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingHeart
          x="15%"
          y="15%"
          size="w-6 h-6"
          opacity="opacity-10"
          delay="0s"
        />
        <FloatingHeart
          x="80%"
          y="25%"
          size="w-8 h-8"
          opacity="opacity-15"
          delay="1s"
        />
        <FloatingHeart
          x="25%"
          y="40%"
          size="w-5 h-5"
          opacity="opacity-20"
          delay="2s"
        />
        <FloatingHeart
          x="70%"
          y="60%"
          size="w-7 h-7"
          opacity="opacity-10"
          delay="3s"
        />
        <FloatingHeart
          x="10%"
          y="70%"
          size="w-6 h-6"
          opacity="opacity-15"
          delay="4s"
        />
        <FloatingHeart
          x="85%"
          y="80%"
          size="w-9 h-9"
          opacity="opacity-10"
          delay="1.5s"
        />
        <FloatingHeart
          x="45%"
          y="20%"
          size="w-4 h-4"
          opacity="opacity-25"
          delay="2.5s"
        />
        <FloatingHeart
          x="60%"
          y="85%"
          size="w-5 h-5"
          opacity="opacity-20"
          delay="3.5s"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-12 sm:mb-16">
          <DatifyLogo />
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold text-center tracking-wide">
            Datify
          </h1>
        </div>

        {/* Faith Features Demo Access */}
        <div className="mb-8 space-y-4">
          <button
            onClick={() => navigate("/faith-demo")}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-white/30 flex items-center space-x-2 w-full"
          >
            <span>🕊️</span>
            <span>Experience Faith-Based Features</span>
          </button>
          <button
            onClick={() => navigate("/design-system")}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-white/30 flex items-center space-x-2 w-full"
          >
            <span>🎨</span>
            <span>View Design System</span>
          </button>
          {inviteOnlyMode !== null && (
            <button
              onClick={() =>
                navigate(inviteOnlyMode ? "/invite-signup" : "/signin")
              }
              className="bg-white hover:bg-white/90 text-[#9610FF] px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 w-full justify-center"
            >
              <span>💜</span>
              <span>{inviteOnlyMode ? "Join with Invite" : "Sign In"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Spinner */}
      <div className="flex justify-center pb-16 sm:pb-20">
        <LoadingSpinner />
      </div>
    </div>
  );
}
