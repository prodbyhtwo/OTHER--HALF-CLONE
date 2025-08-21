import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AuthTest() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Authentication Pages Test
        </h1>

        <div className="space-y-4">
          <Link to="/signin" className="block">
            <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-full">
              Sign In Page
            </Button>
          </Link>

          <Link to="/reset-password" className="block">
            <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-full">
              Reset Password Page
            </Button>
          </Link>

          <Link to="/otp-verification" className="block">
            <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-full">
              OTP Verification Page
            </Button>
          </Link>

          <Link to="/create-new-password" className="block">
            <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-full">
              Create New Password Page
            </Button>
          </Link>
        </div>

        <div className="pt-8 text-center">
          <Link
            to="/"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
