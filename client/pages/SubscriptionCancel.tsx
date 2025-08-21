import React from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowLeft, RefreshCw } from "lucide-react";

export default function SubscriptionCancel() {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate("/upgrade-membership");
  };

  const handleContinueFree = () => {
    navigate("/home");
  };

  const handleContactSupport = () => {
    navigate("/contact-support");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Cancel Icon */}
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-8">
          <X className="w-12 h-12 text-gray-500" />
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Subscription Cancelled
        </h1>
        
        <p className="text-lg text-gray-600 text-center mb-8 max-w-md">
          Your subscription process was cancelled. No charges have been made to your account.
        </p>

        {/* Options */}
        <div className="bg-white rounded-2xl p-6 mb-8 w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What's Next?
          </h2>
          
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-1">Try Again</h3>
              <p className="text-sm text-blue-700">
                Return to our plans and complete your subscription
              </p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-1">Continue Free</h3>
              <p className="text-sm text-green-700">
                Keep using the app with basic features
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-1">Need Help?</h3>
              <p className="text-sm text-purple-700">
                Contact our support team for assistance
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <button
            onClick={handleContinueFree}
            className="w-full py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue with Free Plan
          </button>
          
          <button
            onClick={handleContactSupport}
            className="w-full py-4 text-purple-600 rounded-2xl font-semibold hover:bg-purple-50 transition-colors"
          >
            Contact Support
          </button>
        </div>

        {/* Reassurance */}
        <div className="mt-8 text-center max-w-md">
          <p className="text-sm text-gray-500">
            Don't worry! You can upgrade to premium anytime from your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
