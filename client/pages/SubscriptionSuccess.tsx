import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan");

  const handleContinue = () => {
    navigate("/home");
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8">
          <Check className="w-12 h-12 text-white" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Welcome to Premium!
        </h1>
        
        <p className="text-lg text-gray-600 text-center mb-8 max-w-md">
          Your subscription has been successfully activated. You now have access to all premium features!
        </p>

        {/* Features Unlocked */}
        <div className="bg-white rounded-2xl p-6 mb-8 w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Features Unlocked
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Unlimited likes</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">See who liked you</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Advanced filters</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Read receipts</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Priority support</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleViewProfile}
            className="w-full py-4 border border-purple-600 text-purple-600 rounded-2xl font-semibold hover:bg-purple-50 transition-colors"
          >
            View My Profile
          </button>
        </div>

        {/* Plan Info */}
        {planId && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Plan: {planId.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
