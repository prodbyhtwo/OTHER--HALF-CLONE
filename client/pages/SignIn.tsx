import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import LoginSuccessModal from "../components/LoginSuccessModal";
import { useLoggedHandlers } from "@/components/ActionLoggerProvider";

export default function SignIn() {
  const { createClickHandler, createSubmitHandler } = useLoggedHandlers();
  const [email, setEmail] = useState("andrew.ainsley@yourdomain.com");
  const [password, setPassword] = useState("���●●●●●●●●●●●");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [inviteOnlyMode, setInviteOnlyMode] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Check if invite-only mode is enabled
  useEffect(() => {
    const checkInviteOnlyMode = async () => {
      try {
        const response = await fetch("/api/settings/invite-only-mode");
        if (response.ok) {
          const data = await response.json();
          setInviteOnlyMode(data.invite_only_mode);

          // If invite-only mode is enabled, redirect to invite signup
          if (data.invite_only_mode) {
            navigate("/invite-signup");
          }
        }
      } catch (error) {
        console.error("Failed to check invite-only mode:", error);
        setInviteOnlyMode(false);
      }
    };

    checkInviteOnlyMode();
  }, [navigate]);

  const handleLogin = createSubmitHandler("signin_form", () => {
    // Show success modal
    setShowSuccessModal(true);

    // Simulate navigation to homepage after success
    setTimeout(() => {
      navigate("/");
    }, 3000);
  });

  // Show loading while checking invite-only mode
  if (inviteOnlyMode === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9610FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const togglePasswordVisibility = createClickHandler(
    "toggle_password_visibility",
    "button",
    () => setShowPassword(!showPassword),
  );

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
        <Link
          to="/"
          data-action="click_back_signin"
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
            Welcome back 👋
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Please enter your email & password to sign in.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          <div className="space-y-7">
            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-lg font-semibold text-gray-900"
                >
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                    <Mail className="w-5 h-5 text-gray-900" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "h-16 pl-12 pr-5 text-lg font-semibold bg-gray-50 border-gray-50 rounded-xl",
                      "text-gray-900 focus:border-purple-600 focus:ring-purple-600",
                    )}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-lg font-semibold text-gray-900"
                >
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                    <Lock className="w-5 h-5 text-gray-900" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "h-16 pl-12 pr-12 text-xs bg-gray-50 border-gray-50 rounded-xl",
                      "placeholder:text-gray-900 focus:border-purple-600 focus:ring-purple-600",
                    )}
                    placeholder="●●●●●●●●●●●●"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    data-action="toggle_password_visibility"
                    className="absolute right-5 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5 text-gray-900" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-900" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="w-6 h-6 border-2 border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label
                  htmlFor="remember"
                  className="text-lg font-semibold text-gray-900 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/reset-password"
                className="text-lg font-bold text-purple-600 hover:text-purple-700"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200"></div>

          {/* Sign Up Link */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg text-gray-900">
              Don't have an account?
            </span>
            <Link
              to="/signup"
              className="text-lg font-bold text-purple-600 hover:text-purple-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-6 pb-9">
        <Button
          onClick={handleLogin}
          data-action="submit_signin"
          className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-full"
        >
          Log in
        </Button>
      </div>

      {/* Login Success Modal */}
      {showSuccessModal && (
        <LoginSuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
}
