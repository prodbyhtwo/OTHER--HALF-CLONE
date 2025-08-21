import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Volume2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CaptchaVerification() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showImageGrid, setShowImageGrid] = useState(false);
  const navigate = useNavigate();

  // Mock bicycle images - in real app these would be from an API
  const mockImages = [
    "https://api.builder.io/api/v1/image/assets/TEMP/4db295374d7d62f5921dd2ec0c0ef185e8ee6dad?width=240",
    "https://api.builder.io/api/v1/image/assets/TEMP/c33f437e5b5f6cac28675c665c0d87d58bb9e949?width=240",
    "https://api.builder.io/api/v1/image/assets/TEMP/e9e6f3ade88af38e3d6609e843c4c872ff9e42b5?width=240",
    "https://api.builder.io/api/v1/image/assets/TEMP/f9f7dbd72eb133c9c70d30ad3a1176e8add40e74?width=240",
    "https://api.builder.io/api/v1/image/assets/TEMP/7519a9911fb10ffa1aa42feca23e6508d8277c50?width=194", // This one has a bicycle
    "https://api.builder.io/api/v1/image/assets/TEMP/571d08e0b29bad81905e34955238043918ef49a0?width=240",
    "https://api.builder.io/api/v1/image/assets/TEMP/931184eb9b99826884ac8670d712c223322ae39a?width=240",
    "https://api.builder.io/api/v1/image/assets/TEMP/eacebe89695cb650e8e27f7f181aed9eb6717d9a?width=240",
    "https://api.builder.io/api/v1/image/assets/TEMP/b4d036e0ff8bea826249e79500f5f2df0bb77c04?width=240",
  ];

  const handleCaptchaClick = () => {
    if (!captchaVerified) {
      setShowImageGrid(true);
    }
  };

  const toggleImageSelection = (index: number) => {
    setSelectedImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleVerify = () => {
    // In real app, this would validate the selected images
    setCaptchaVerified(true);
    setShowImageGrid(false);
  };

  const handleContinue = () => {
    if (captchaVerified) {
      navigate("/email-verification");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 py-2 h-11">
        <span className="text-base font-semibold text-black">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-2 bg-black opacity-60 rounded-sm"></div>
            <div className="w-1 h-3 bg-black opacity-60 rounded-sm"></div>
            <div className="w-1 h-2.5 bg-black opacity-60 rounded-sm"></div>
            <div className="w-1 h-4 bg-black rounded-sm"></div>
          </div>
          <svg className="w-4 h-3 ml-1" viewBox="0 0 16 11" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.63661 2.27733C9.8525 2.27742 11.9837 3.12886 13.5896 4.65566C13.7105 4.77354 13.9038 4.77205 14.0229 4.65233L15.1789 3.48566C15.2392 3.42494 15.2729 3.34269 15.2724 3.25711C15.2719 3.17153 15.2373 3.08967 15.1763 3.02966C10.9612 -1.00989 4.31137 -1.00989 0.0962725 3.02966C0.0352139 3.08963 0.00057 3.17146 6.97078e-06 3.25704C-0.000556058 3.34262 0.0330082 3.42489 0.0932725 3.48566L1.24961 4.65233C1.36863 4.77223 1.56208 4.77372 1.68294 4.65566C3.28909 3.12876 5.4205 2.27732 7.63661 2.27733ZM7.63653 6.0729C8.85402 6.07282 10.0281 6.52536 10.9305 7.34257C11.0526 7.45855 11.2449 7.45603 11.3639 7.3369L12.5185 6.17023C12.5793 6.10904 12.6131 6.02602 12.6122 5.93976C12.6113 5.85349 12.5759 5.77118 12.5139 5.71123C9.76567 3.15485 5.50973 3.15485 2.76153 5.71123C2.69945 5.77118 2.66404 5.85353 2.66322 5.93982C2.66241 6.02612 2.69626 6.10913 2.7572 6.17023L3.91153 7.3369C4.03052 7.45603 4.2228 7.45855 4.34487 7.34257C5.24674 6.5259 6.41985 6.0734 7.63653 6.0729ZM9.94959 8.62671C9.95136 8.71322 9.91735 8.79662 9.8556 8.85723L7.85826 10.8729C7.79971 10.9321 7.71989 10.9655 7.6366 10.9655C7.55331 10.9655 7.47348 10.9321 7.41493 10.8729L5.41726 8.85723C5.35555 8.79658 5.3216 8.71315 5.32343 8.62664C5.32526 8.54013 5.36271 8.45821 5.42693 8.40023C6.7025 7.32134 8.57069 7.32134 9.84626 8.40023C9.91044 8.45826 9.94783 8.54021 9.94959 8.62671Z"
              fill="black"
            />
          </svg>
          <div className="w-7 h-3 border border-black/35 rounded-sm ml-1">
            <div className="w-full h-full bg-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Navigation Bar with Progress */}
      <div className="flex items-center justify-between px-6 py-3 h-18">
        <Link to="/signup" className="flex items-center justify-center w-7 h-7">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <div className="flex-1 mx-4">
          <div className="w-full h-3 bg-gray-200 rounded-full">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          </div>
        </div>
        <div className="w-7"></div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Verify you're human 🤖
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Please solve this captcha so we know you are a person.
          </p>
        </div>

        {/* CAPTCHA Box */}
        {!showImageGrid ? (
          <div className="border border-gray-200 rounded-sm bg-gray-50 shadow-sm">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={cn(
                    "w-6 h-6 border-2 rounded-sm cursor-pointer",
                    captchaVerified
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 bg-white",
                  )}
                  onClick={handleCaptchaClick}
                >
                  {captchaVerified && (
                    <svg
                      className="w-full h-full text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  I'm not a robot
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-sm mb-1">
                  <span className="text-xs text-white font-semibold">
                    reCAPTCHA
                  </span>
                </div>
                <div className="text-xs text-gray-500">Privacy - Terms</div>
              </div>
            </div>
          </div>
        ) : (
          /* Image Grid CAPTCHA */
          <div className="border border-gray-200 rounded-sm bg-white shadow-lg">
            {/* Header */}
            <div className="bg-blue-500 text-white p-6">
              <p className="text-lg font-medium">
                Select all images with a bicycle.
              </p>
            </div>

            {/* Image Grid */}
            <div className="p-2">
              <div className="grid grid-cols-3 gap-1">
                {mockImages.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative w-30 h-30 cursor-pointer border-2",
                      selectedImages.includes(index)
                        ? "border-blue-500"
                        : "border-transparent",
                    )}
                    onClick={() => toggleImageSelection(index)}
                  >
                    <img
                      src={image}
                      alt={`Captcha image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImages.includes(index) && (
                      <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 text-white flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Special bicycle image indicator */}
                    {index === 4 && selectedImages.includes(index) && (
                      <div className="absolute top-0 left-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-gray-600">
                <RotateCcw className="w-6 h-6" />
                <Volume2 className="w-6 h-6" />
                <Info className="w-6 h-6" />
              </div>
              <Button
                onClick={handleVerify}
                disabled={selectedImages.length === 0}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-sm"
              >
                VERIFY
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      {captchaVerified && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-6 pb-9">
          <Button
            onClick={handleContinue}
            className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-full"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
