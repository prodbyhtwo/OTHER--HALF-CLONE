interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareProfileModal({
  isOpen,
  onClose,
}: ShareProfileModalProps) {
  if (!isOpen) return null;

  const recentPeople = [
    {
      name: "Charlotte Hanlin",
      avatar:
        "https://api.builder.io/api/v1/image/assets/TEMP/4296061fb30d115b85b128a983ae3976df3fd04e?width=34",
      platform: "whatsapp",
    },
    {
      name: "Kristin Watson",
      avatar:
        "https://api.builder.io/api/v1/image/assets/TEMP/ab23d4828c00ce858c8d8ef65ace0df0256d9d06?width=34",
      platform: "facebook",
    },
    {
      name: "Clinton Mcclure",
      avatar:
        "https://api.builder.io/api/v1/image/assets/TEMP/f57f2a08d4fd3f1d399b47136408a86fc078780e?width=34",
      platform: "instagram",
    },
    {
      name: "Maryland Winkles",
      avatar:
        "https://api.builder.io/api/v1/image/assets/TEMP/4296061fb30d115b85b128a983ae3976df3fd04e?width=34",
      platform: "whatsapp",
    },
    {
      name: "Alexia Hershey",
      avatar:
        "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=34",
      platform: "whatsapp",
    },
  ];

  const socialMediaOptions = [
    {
      name: "WhatsApp",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/b3a477af25d6b7e6b5e03ddee1d1898449599b5b?width=120",
    },
    {
      name: "Facebook",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/3d9b2ac3ab42c931b7276c38847d40c9ae19329f?width=120",
    },
    {
      name: "Instagram",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/500a77fef1d27f72b72b45c5be325ce76de8b2c9?width=120",
    },
    {
      name: "Telegram",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/455f6b5f64b0b638dfc9ef62a12f03a7fc4639d2?width=120",
    },
    {
      name: "Twitter",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/6b5e8356d10d3c39191cd541f6d35f72efd3df40?width=120",
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return "https://api.builder.io/api/v1/image/assets/TEMP/4296061fb30d115b85b128a983ae3976df3fd04e?width=34";
      case "facebook":
        return "https://api.builder.io/api/v1/image/assets/TEMP/ab23d4828c00ce858c8d8ef65ace0df0256d9d06?width=34";
      case "instagram":
        return "https://api.builder.io/api/v1/image/assets/TEMP/f57f2a08d4fd3f1d399b47136408a86fc078780e?width=34";
      default:
        return "https://api.builder.io/api/v1/image/assets/TEMP/4296061fb30d115b85b128a983ae3976df3fd04e?width=34";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[28px] border border-gray-200 z-50 max-w-[430px] mx-auto">
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-5">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-5">
          <h2 className="text-2xl font-bold text-black text-center">
            Share this Profile
          </h2>
        </div>

        {/* Recent people section */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-semibold text-gray-500">
              Recent people
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto">
            {recentPeople.map((person, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 min-w-20"
              >
                <div className="relative">
                  <div className="w-17 h-17 rounded-full overflow-hidden">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded overflow-hidden">
                    <img
                      src={getPlatformIcon(person.platform)}
                      alt={person.platform}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-sm text-black text-center leading-tight max-w-22">
                  {person.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Social media section */}
        <div className="px-6 pb-9">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-semibold text-gray-500">
              Social media
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-5 gap-3">
            {socialMediaOptions.map((option, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="w-15 h-15 rounded-3.5 overflow-hidden">
                  <img
                    src={option.icon}
                    alt={option.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-black text-center">
                  {option.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
