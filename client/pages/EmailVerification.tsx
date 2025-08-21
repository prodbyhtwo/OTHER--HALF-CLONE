import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmailVerification() {
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

      {/* Navigation Bar */}
      <div className="flex items-center px-6 py-3 h-18">
        <Link to="/signup" className="flex items-center justify-center w-7 h-7">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 space-y-8">
        {/* Email Icon */}
        <div className="flex items-center justify-center w-24 h-24 rounded-full border border-gray-200">
          <Mail className="w-15 h-15 text-gray-900" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="text-center space-y-6 max-w-sm">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Check Your Email
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We have sent an email to{" "}
              <span className="text-gray-900">
                and********ley@yourdomain.com.
              </span>
              <br />
              Click the link inside to get started.
            </p>
          </div>

          {/* Resend Email Link */}
          <button className="text-lg font-bold text-purple-600 hover:text-purple-700">
            Resend email
          </button>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-6 pb-9 border-t border-gray-100">
        <Button
          className="w-full h-14 border-2 border-purple-600 text-purple-600 bg-white hover:bg-purple-50 font-bold text-base rounded-full"
          variant="outline"
        >
          I've verified my email
        </Button>
      </div>
    </div>
  );
}
