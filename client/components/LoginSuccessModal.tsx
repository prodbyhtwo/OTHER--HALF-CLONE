import { useEffect } from "react";
import { User } from "lucide-react";

interface LoginSuccessModalProps {
  onClose: () => void;
}

export default function LoginSuccessModal({ onClose }: LoginSuccessModalProps) {
  useEffect(() => {
    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-11">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm mx-auto">
        {/* Illustration */}
        <div className="relative w-46 h-45 mx-auto mb-8">
          {/* Decorative dots */}
          <div className="absolute top-0 left-26 w-5 h-5 bg-purple-600 rounded-full"></div>
          <div className="absolute top-43 left-15 w-2 h-2 bg-purple-600 rounded-full"></div>
          <div className="absolute top-32 left-0 w-2.5 h-2.5 bg-purple-600 rounded-full"></div>
          <div className="absolute top-5 right-4 w-4 h-4 bg-purple-600 rounded-full"></div>
          <div className="absolute top-27 right-0 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
          <div className="absolute top-18 left-19 w-1 h-1 bg-purple-600 rounded-full"></div>
          <div className="absolute top-39 right-5 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>

          {/* Main circle */}
          <div className="absolute top-5 left-6 w-35 h-35 bg-purple-600 rounded-full flex items-center justify-center">
            <User className="w-15 h-12 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-purple-600">
            Log in Successful!
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
              className="w-15 h-15 animate-spin"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="gradient"
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
              <path
                d="M41.6476 11.3531C41.9608 11.0037 42.3398 10.7195 42.7629 10.5166C43.186 10.3137 43.645 10.1962 44.1135 10.1708C44.582 10.1453 45.051 10.2125 45.4936 10.3684C45.9362 10.5243 46.3437 10.7659 46.6929 11.0793C49.31 13.4218 51.4029 16.2906 52.8344 19.498C54.266 22.7053 55.0039 26.1789 55 29.6912C55 43.5007 43.8071 54.6912 30 54.6912V47.5484C33.6147 47.5484 37.1442 46.4515 40.1221 44.4026C43.1 42.3537 45.386 39.4494 46.6779 36.0735C47.9698 32.6975 48.2068 29.009 47.3575 25.4956C46.5082 21.9821 44.6127 18.8091 41.9214 16.396C41.2165 15.7635 40.7916 14.877 40.7402 13.9313C40.6889 12.9856 41.0153 12.0582 41.6476 11.3531Z"
                fill="url(#gradient)"
              />
              <path
                d="M25.8309 5.03881C26.7563 4.9013 27.6986 5.13234 28.4554 5.68227C29.2122 6.2322 29.723 7.05711 29.878 7.97967C30.033 8.90223 29.8198 9.84877 29.2843 10.6158C28.7488 11.3829 27.9337 11.9092 27.0143 12.0817C22.8551 12.788 19.0801 14.9436 16.3582 18.1668C13.6362 21.3899 12.1429 25.4724 12.1429 29.6912C12.1429 34.4272 14.0242 38.9692 17.3731 42.3181C20.722 45.6669 25.264 47.5483 30 47.5483V54.6912C16.1929 54.6912 5 43.5007 5 29.6912C5 17.4412 13.8714 7.04833 25.8309 5.03881Z"
                fill="#9610FF"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
