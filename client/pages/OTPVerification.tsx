import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["8", "4", "6", ""]);
  const [countdown, setCountdown] = useState(52);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeypadClick = (digit: string) => {
    const emptyIndex = otp.findIndex((val) => val === "");
    if (emptyIndex !== -1) {
      handleOtpChange(emptyIndex, digit);
    }
  };

  const handleBackspace = () => {
    for (let i = otp.length - 1; i >= 0; i--) {
      if (otp[i] !== "") {
        handleOtpChange(i, "");
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
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

      {/* Navigation Bar */}
      <div className="flex items-center px-6 py-3 h-18">
        <Link
          to="/reset-password"
          className="flex items-center justify-center w-7 h-7"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            OTP code verification 🔐
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We have sent an OTP code to your email
            and********ley@yourdomain.com. Enter the OTP code below to verify.
          </p>
        </div>

        {/* OTP Input */}
        <div className="py-8 space-y-10">
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  "w-21 h-18 text-center text-2xl font-bold rounded-xl border text-gray-900",
                  index === 2 && digit
                    ? "border-2 border-purple-600 bg-purple-50"
                    : "border border-gray-50 bg-gray-50",
                  "focus:outline-none focus:border-purple-600 focus:bg-purple-50",
                )}
              />
            ))}
          </div>

          {/* Resend Code */}
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-900">Didn't receive email?</p>
            <p className="text-lg text-gray-900">
              You can resend code in{" "}
              <span className="text-purple-600 font-medium">{countdown}</span> s
            </p>
          </div>
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 px-3 py-3">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Row 1 */}
          {["1", "2", "3"].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeypadClick(digit)}
              className="h-14 bg-gray-50 text-gray-900 text-2xl font-medium rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              {digit}
            </button>
          ))}
          {/* Row 2 */}
          {["4", "5", "6"].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeypadClick(digit)}
              className="h-14 bg-gray-50 text-gray-900 text-2xl font-medium rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              {digit}
            </button>
          ))}
          {/* Row 3 */}
          {["7", "8", "9"].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeypadClick(digit)}
              className="h-14 bg-gray-50 text-gray-900 text-2xl font-medium rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              {digit}
            </button>
          ))}
          {/* Row 4 */}
          <button className="h-14 bg-gray-50 text-gray-900 text-2xl font-medium rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors">
            *
          </button>
          <button
            onClick={() => handleKeypadClick("0")}
            className="h-14 bg-gray-50 text-gray-900 text-2xl font-medium rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 bg-gray-50 text-gray-900 text-2xl font-medium rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
              <path
                d="M23.331 7C23.6405 7 23.9372 7.12292 24.156 7.34171C24.3748 7.5605 24.4977 7.85725 24.4977 8.16667V19.8333C24.4977 20.1428 24.3748 20.4395 24.156 20.6583C23.9372 20.8771 23.6405 21 23.331 21H10.4977L4.66438 15.1667C4.3774 14.8458 4.21875 14.4305 4.21875 14C4.21875 13.5695 4.3774 13.1542 4.66438 12.8333L10.4977 7H23.331Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.6667 11.6666L14 16.3333M14 11.6666L18.6667 16.3333L14 11.6666Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center py-2">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
