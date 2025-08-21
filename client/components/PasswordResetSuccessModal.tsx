import { useEffect } from "react";
import { Lock } from "lucide-react";

interface PasswordResetSuccessModalProps {
  onClose: () => void;
}

export default function PasswordResetSuccessModal({
  onClose,
}: PasswordResetSuccessModalProps) {
  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
      <div className="w-[340px] bg-white rounded-2xl p-8 space-y-8 mx-4">
        {/* Illustration */}
        <div className="relative flex items-center justify-center">
          {/* Background circles */}
          <div className="absolute">
            <svg width="186" height="180" viewBox="0 0 186 180" fill="none">
              {/* Various colored dots */}
              <circle cx="59" cy="173" r="3.5" fill="#9610FF" />
              <circle cx="121" cy="170" r="1" fill="#9610FF" />
              <circle cx="5" cy="128" r="5" fill="#9610FF" />
              <circle cx="163" cy="158" r="2.5" fill="#9610FF" />
              <circle cx="168" cy="108" r="2.5" fill="#9610FF" />
              <circle cx="0" cy="74" r="1" fill="#9610FF" />
              <circle cx="171" cy="20" r="7.5" fill="#9610FF" />
              <circle cx="104" cy="2" r="2.5" fill="#9610FF" />
              <circle cx="10" cy="0" r="10" fill="#9610FF" />

              {/* Main purple circle */}
              <circle cx="95.5" cy="91.5" r="70.5" fill="#9610FF" />
            </svg>
          </div>

          {/* Lock icon */}
          <div className="relative z-10 flex items-center justify-center w-15 h-15 text-white">
            <Lock className="w-12 h-12" strokeWidth={2} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-purple-600">
            Reset Password Successful!
          </h2>
          <p className="text-base text-gray-900 leading-relaxed">
            Please wait...
            <br />
            You will be directed to the homepage.
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="w-15 h-15 relative">
            <svg
              className="w-full h-full animate-spin"
              viewBox="0 0 60 60"
              fill="none"
            >
              <path
                d="M41.6476 11.3531C41.9608 11.0037 42.3398 10.7195 42.7629 10.5166C43.186 10.3137 43.645 10.1962 44.1135 10.1708C44.582 10.1453 45.051 10.2125 45.4936 10.3684C45.9362 10.5243 46.3437 10.7659 46.6929 11.0793C49.31 13.4218 51.4029 16.2906 52.8344 19.498C54.266 22.7053 55.0039 26.1789 55 29.6912C55 43.5007 43.8071 54.6912 30 54.6912V47.5484C33.6147 47.5484 37.1442 46.4515 40.1221 44.4026C43.1 42.3537 45.386 39.4494 46.6779 36.0735C47.9698 32.6975 48.2068 29.009 47.3575 25.4956C46.5082 21.9821 44.6127 18.8091 41.9214 16.396C41.2165 15.7635 40.7916 14.877 40.7402 13.9313C40.6889 12.9856 41.0153 12.0582 41.6476 11.3531Z"
                fill="url(#paint0_linear)"
              />
              <path
                d="M25.8309 5.03881C26.7563 4.9013 27.6986 5.13234 28.4554 5.68227C29.2122 6.2322 29.723 7.05711 29.878 7.97967C30.033 8.90223 29.8198 9.84877 29.2843 10.6158C28.7488 11.3829 27.9337 11.9092 27.0143 12.0817C22.8551 12.788 19.0801 14.9436 16.3582 18.1668C13.6362 21.3899 12.1429 25.4724 12.1429 29.6912C12.1429 34.4272 14.0242 38.9692 17.3731 42.3181C20.722 45.6669 25.264 47.5483 30 47.5483V54.6912C16.1929 54.6912 5 43.5007 5 29.6912C5 17.4412 13.8714 7.04833 25.8309 5.03881Z"
                fill="#9610FF"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="42.5"
                  y1="10.1655"
                  x2="30"
                  y2="47.5469"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9610FF" stopOpacity="0" />
                  <stop offset="1" stopColor="#9610FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
