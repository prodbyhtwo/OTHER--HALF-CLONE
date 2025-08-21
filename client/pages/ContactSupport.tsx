import React from "react";
import { ArrowLeft, Headphones, Globe, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContactSupport: React.FC = () => {
  const navigate = useNavigate();

  const contactOptions = [
    {
      icon: Headphones,
      title: "Customer Support",
      iconColor: "#9610FF",
      action: () => {
        // Handle customer support contact
      },
    },
    {
      icon: Globe,
      title: "Website",
      iconColor: "#9610FF",
      action: () => {
        window.open("https://datify.com", "_blank");
      },
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      iconColor: "#9610FF",
      action: () => {
        window.open("https://wa.me/1234567890", "_blank");
      },
    },
    {
      icon: "facebook",
      title: "Facebook",
      iconColor: "#1877F2",
      action: () => {
        window.open("https://facebook.com/datify", "_blank");
      },
    },
    {
      icon: "twitter",
      title: "Twitter",
      iconColor: "#1DA1F2",
      action: () => {
        window.open("https://twitter.com/datify", "_blank");
      },
    },
    {
      icon: "instagram",
      title: "Instagram",
      iconColor: "#E4405F",
      action: () => {
        window.open("https://instagram.com/datify", "_blank");
      },
    },
  ];

  const renderSocialIcon = (iconType: string, color: string) => {
    switch (iconType) {
      case "facebook":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
            <path d="M12.5 2C6.70132 2 2 6.70132 2 12.5C2 17.74 5.83918 22.0833 10.8597 22.874V15.5359H8.19247V12.5H10.8597V10.1866C10.8597 7.55296 12.4275 6.10066 14.8249 6.10066C15.9737 6.10066 17.1772 6.30543 17.1772 6.30543V8.88764H15.8498C14.5477 8.88764 14.1403 9.69832 14.1403 10.529V12.4979H17.0501L16.5849 15.5338H14.1403V22.8719C19.1608 22.0854 23 17.7411 23 12.5C23 6.70132 18.2987 2 12.5 2Z" />
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
            <path d="M20.8425 8.25087C20.8564 8.43787 20.8564 8.62381 20.8564 8.80974C20.8564 14.5 16.5254 21.0569 8.61032 21.0569C6.17179 21.0569 3.90637 20.3506 2 19.1238C2.34622 19.1633 2.67963 19.1772 3.03974 19.1772C4.97709 19.1819 6.85958 18.5341 8.38378 17.3382C7.48554 17.3219 6.6148 17.0256 5.89314 16.4905C5.17148 15.9554 4.63492 15.2084 4.35839 14.3536C4.62447 14.3931 4.89161 14.4199 5.17159 14.4199C5.55735 14.4199 5.94525 14.3664 6.30536 14.2735C5.33055 14.0766 4.454 13.5483 3.82475 12.7782C3.1955 12.0081 2.85241 11.0438 2.85381 10.0493V9.99588C3.42764 10.3154 4.09337 10.5152 4.79865 10.5419C4.20781 10.1493 3.72334 9.61655 3.38847 8.99118C3.05359 8.3658 2.87872 7.66726 2.87945 6.95787C2.87945 6.15856 3.0921 5.4255 3.46504 4.78649C4.54661 6.11691 5.89556 7.20531 7.42454 7.98122C8.95352 8.75712 10.6284 9.20321 12.3408 9.29061C12.2745 8.97003 12.2339 8.6377 12.2339 8.3043C12.2336 7.73897 12.3448 7.17913 12.561 6.65678C12.7772 6.13443 13.0942 5.65982 13.494 5.26007C13.8937 4.86033 14.3684 4.54329 14.8907 4.32707C15.413 4.11086 15.9729 3.99972 16.5382 4C17.7778 4 18.8966 4.51934 19.6831 5.35925C20.6467 5.17291 21.5708 4.82113 22.4144 4.31951C22.0932 5.31417 21.4204 6.1576 20.5219 6.69179C21.3766 6.59431 22.2118 6.36956 23 6.02499C22.4113 6.88317 21.6819 7.63572 20.8425 8.25087Z" />
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill={color}>
            <path d="M20.95 8.30447C20.9399 7.54709 20.7981 6.79724 20.531 6.08847C20.2993 5.49062 19.9455 4.94767 19.4922 4.4943C19.0388 4.04093 18.4958 3.68712 17.898 3.45547C17.1983 3.19283 16.4592 3.05081 15.712 3.03547C14.75 2.99247 14.445 2.98047 12.003 2.98047C9.561 2.98047 9.248 2.98047 8.293 3.03547C7.54616 3.05092 6.80735 3.19294 6.108 3.45547C5.51006 3.68696 4.96702 4.04071 4.51363 4.4941C4.06024 4.94749 3.70649 5.49053 3.475 6.08847C3.21183 6.7876 3.07012 7.52658 3.056 8.27347C3.013 9.23647 3 9.54147 3 11.9835C3 14.4255 3 14.7375 3.056 15.6935C3.071 16.4415 3.212 17.1795 3.475 17.8805C3.70688 18.4782 4.0609 19.021 4.51444 19.4742C4.96798 19.9274 5.51106 20.281 6.109 20.5125C6.80643 20.7857 7.54537 20.9378 8.294 20.9625C9.257 21.0055 9.562 21.0185 12.004 21.0185C14.446 21.0185 14.759 21.0185 15.714 20.9625C16.4612 20.9478 17.2004 20.8061 17.9 20.5435C18.4977 20.3116 19.0405 19.9576 19.4938 19.5043C19.9472 19.051 20.3011 18.5082 20.533 17.9105C20.796 17.2105 20.937 16.4725 20.952 15.7235C20.995 14.7615 21.008 14.4565 21.008 12.0135C21.006 9.57147 21.006 9.26147 20.95 8.30447ZM11.997 16.6015C9.443 16.6015 7.374 14.5325 7.374 11.9785C7.374 9.42447 9.443 7.35547 11.997 7.35547C13.2231 7.35547 14.399 7.84253 15.266 8.70951C16.1329 9.5765 16.62 10.7524 16.62 11.9785C16.62 13.2046 16.1329 14.3804 15.266 15.2474C14.399 16.1144 13.2231 16.6015 11.997 16.6015ZM16.804 8.26247C16.6624 8.2626 16.5222 8.23481 16.3913 8.18068C16.2605 8.12655 16.1416 8.04715 16.0414 7.94702C15.9413 7.8469 15.8619 7.72801 15.8078 7.59716C15.7537 7.46631 15.7259 7.32607 15.726 7.18447C15.726 7.04297 15.7539 6.90286 15.808 6.77213C15.8622 6.6414 15.9415 6.52262 16.0416 6.42256C16.1416 6.32251 16.2604 6.24314 16.3912 6.18899C16.5219 6.13484 16.662 6.10697 16.8035 6.10697C16.945 6.10697 17.0851 6.13484 17.2158 6.18899C17.3466 6.24314 17.4654 6.32251 17.5654 6.42256C17.6655 6.52262 17.7448 6.6414 17.799 6.77213C17.8531 6.90286 17.881 7.04297 17.881 7.18447C17.881 7.78047 17.399 8.26247 16.804 8.26247Z" />
            <path d="M11.9952 14.9826C13.6537 14.9826 14.9982 13.6381 14.9982 11.9796C14.9982 10.3211 13.6537 8.97656 11.9952 8.97656C10.3367 8.97656 8.99219 10.3211 8.99219 11.9796C8.99219 13.6381 10.3367 14.9826 11.9952 14.9826Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderIcon = (option: any) => {
    if (typeof option.icon === "string") {
      return renderSocialIcon(option.icon, option.iconColor);
    } else {
      const IconComponent = option.icon;
      return (
        <IconComponent
          className="w-6 h-6"
          style={{ color: option.iconColor || "#9610FF" }}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto">
      {/* Status Bar */}
      <div className="w-full h-11 flex items-center justify-between px-6 text-black text-base font-semibold">
        <div className="flex items-center">
          <span>9:41</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-end gap-1">
            <div className="w-1 h-2 bg-black rounded-sm"></div>
            <div className="w-1 h-3 bg-black rounded-sm"></div>
            <div className="w-1 h-4 bg-black rounded-sm"></div>
            <div className="w-1 h-5 bg-black rounded-sm"></div>
          </div>
          <svg className="w-4 h-3 ml-2" viewBox="0 0 16 11" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
              fill="black"
            />
          </svg>
          <div className="ml-2 w-7 h-3 border border-black border-opacity-35 rounded-sm relative">
            <div className="absolute inset-0.5 bg-black rounded-sm"></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-black bg-opacity-40 rounded-r"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 h-18">
        <button
          onClick={() => navigate(-1)}
          className="w-7 h-7 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-1 text-center text-gray-900 text-2xl font-bold">
          Contact Support
        </h1>
        <div className="w-7 h-7"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        <div className="space-y-5">
          {contactOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="w-full flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center">
                {renderIcon(option)}
              </div>
              <h3 className="flex-1 text-left text-lg font-bold text-gray-900">
                {option.title}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
