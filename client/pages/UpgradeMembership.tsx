import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useSubscriptionManagement } from "@/hooks/use-stripe";
import { toast } from "@/hooks/use-toast";

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

export default function UpgradeMembership() {
  const navigate = useNavigate();
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // TODO: Get actual user ID from auth context
  const userId = "user_123";

  const {
    plans,
    loading,
    error,
    fetchPlans,
    handleUpgrade,
    formatPrice
  } = useSubscriptionManagement({ userId });

  useEffect(() => {
    fetchPlans().catch(console.error);
  }, [fetchPlans]);

  const handleSelectPlan = async (planType: string) => {
    if (planType === "free-trial") {
      setShowCongratulations(true);
      return;
    }

    // Find the plan by tier and interval
    const plan = plans.find(p =>
      p.tier === planType &&
      (planType === "premium" ? p.interval === "month" : p.interval === "month")
    );

    if (!plan) {
      toast({
        title: "Plan not found",
        description: "The selected plan is not available.",
        variant: "destructive"
      });
      return;
    }

    setSelectedPlan(plan.id);

    try {
      await handleUpgrade(plan.id);
    } catch (error) {
      console.error("Error starting subscription:", error);
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive"
      });
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MobileStatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Upgrade Membership</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 pb-20">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading Display */}
        {loading && !selectedPlan && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading subscription plans...
            </p>
          </div>
        )}

        {/* Free Plan */}
        <div className="mb-6 p-4 border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">Datify</span>
            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
              Basic
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4">Free</h2>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Create and Edit Profile</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Swipe Match</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Limited Daily Swipes</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Basic Profile Verification</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Chat with Mutual Matches</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">Your current plan</p>
        </div>

        {/* Premium Plan */}
        <div className="mb-6 p-4 border-2 border-purple-600 rounded-2xl bg-purple-50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">Datify</span>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
              Premium
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-4">
            {plans.find(p => p.tier === "premium") ? (
              <>
                <span className="text-4xl font-bold">{formatPrice(plans.find(p => p.tier === "premium" && p.interval === "month")?.price || 2999)}</span>
                <span className="text-gray-600">/ month</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-bold">$29.99</span>
                <span className="text-gray-600">/ month</span>
              </>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">All Free Membership Features</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Unlimited Daily Swipes</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Priority Profile Verification</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Ad-Free Experience</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">See Who Likes Your Profile</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Access to Read Receipts</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Rewind Swipes (Undo)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Advanced Matching Filters</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Boost Profile Visibility</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">In-App Customer Support</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSelectPlan("free-trial")}
              disabled={loading || selectedPlan === "free-trial"}
              className="flex-1 py-3 border border-purple-600 text-purple-600 rounded-full font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {selectedPlan === "free-trial" && <Loader2 className="w-4 h-4 animate-spin" />}
              Start Free Trial
            </button>
            <button
              onClick={() => handleSelectPlan("premium")}
              disabled={loading || Boolean(selectedPlan)}
              className="flex-1 py-3 bg-purple-600 text-white rounded-full font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {selectedPlan?.includes("premium") && <Loader2 className="w-4 h-4 animate-spin" />}
              Select Plan
            </button>
          </div>
        </div>

        {/* Gold Plan */}
        <div className="mb-6 p-4 border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">Datify</span>
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
              Gold
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-4">
            {plans.find(p => p.tier === "pro") ? (
              <>
                <span className="text-4xl font-bold">{formatPrice(plans.find(p => p.tier === "pro" && p.interval === "month")?.price || 1999)}</span>
                <span className="text-gray-600">/ month</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-bold">$19.99</span>
                <span className="text-gray-600">/ month</span>
              </>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">All Premium Membership Features</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Exclusive Gold Badge on Profile</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Additional Super Likes</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Premium Customer Support</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Access to User Activity Insights</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Top-of-Stack Profile Placement</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Travel Mode (Change Location)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Access to All Emojis and Stickers</span>
            </div>
          </div>

          <button
            onClick={() => handleSelectPlan("pro")}
            disabled={loading || Boolean(selectedPlan)}
            className="w-full py-3 bg-yellow-500 text-white rounded-full font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {selectedPlan?.includes("pro") && <Loader2 className="w-4 h-4 animate-spin" />}
            Select Plan
          </button>
        </div>

        {/* Platinum Plan */}
        <div className="mb-6 p-4 border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">Datify</span>
            <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm">
              Platinum
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-4">
            {plans.find(p => p.tier === "premium" && p.interval === "year") ? (
              <>
                <span className="text-4xl font-bold">{formatPrice(plans.find(p => p.tier === "premium" && p.interval === "year")?.price || 25199)}</span>
                <span className="text-gray-600">/ year</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-bold">$251.99</span>
                <span className="text-gray-600">/ year</span>
              </>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">All Gold Membership Features</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">VIP Platinum Badge on Profile</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Priority Customer Support</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Profile Highlight (Stand Out)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Extended Location Preferences</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Profile Boost Credits</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Exclusive Access to Datify Events</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Advanced Safety Features</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm">Access to Premium Blog Content</span>
            </div>
          </div>

          <button
            onClick={() => handleSelectPlan("premium")}
            disabled={loading || Boolean(selectedPlan)}
            className="w-full py-3 bg-gray-400 text-white rounded-full font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {selectedPlan?.includes("premium") && <Loader2 className="w-4 h-4 animate-spin" />}
            Select Plan
          </button>
        </div>
      </div>

      {/* Congratulations Modal */}
      {showCongratulations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center">
            <div className="mb-6 relative">
              <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto flex items-center justify-center relative">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-0 left-8 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-100"></div>
              <div className="absolute bottom-2 left-12 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-200"></div>
              <div className="absolute bottom-6 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-8 left-2 w-1 h-1 bg-purple-200 rounded-full animate-pulse delay-150"></div>
              <div className="absolute bottom-8 right-2 w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-250"></div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-lg text-gray-600 mb-8">
              You're Now a Datify Premium Member!
            </p>

            <div className="text-left mb-8">
              <h3 className="text-lg font-semibold mb-4">Benefits Unlocked:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Unlimited Daily Swipes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Priority Profile Verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">An Ad-Free Experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    The Ability to See Who Likes Your Profile
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Access to Read Receipts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    The Power to Rewind Swipes (Undo)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Advanced Matching Filters</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Boosted Profile Visibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm">In-App Customer Support</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Your dating experience is about to get even more exciting and
              efficient.
            </p>
            <p className="text-gray-600 text-sm mb-8">
              Enjoy your premium journey!
            </p>

            <button
              onClick={() => {
                setShowCongratulations(false);
                navigate("/home");
              }}
              className="w-full py-4 bg-purple-600 text-white rounded-full font-semibold text-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
