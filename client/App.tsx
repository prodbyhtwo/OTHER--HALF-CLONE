import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActionLoggerProvider } from "@/components/ActionLoggerProvider";

import Index from "./pages/Index";
import Walkthrough from "./pages/Walkthrough";
import Walkthrough2 from "./pages/Walkthrough2";
import Walkthrough3 from "./pages/Walkthrough3";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignUpFilled from "./pages/SignUpFilled";
import InviteSignUp from "./pages/InviteSignUp";
import ResetPassword from "./pages/ResetPassword";
import OTPVerification from "./pages/OTPVerification";
import CreateNewPassword from "./pages/CreateNewPassword";
import EmailVerification from "./pages/EmailVerification";
import CaptchaVerification from "./pages/CaptchaVerification";
import AuthTest from "./pages/AuthTest";
import OnboardingNickname from "./pages/OnboardingNickname";
import OnboardingBirthdate from "./pages/OnboardingBirthdate";
import OnboardingGender from "./pages/OnboardingGender";
import OnboardingGoals from "./pages/OnboardingGoals";
import OnboardingDistance from "./pages/OnboardingDistance";
import OnboardingInterests from "./pages/OnboardingInterests";
import OnboardingPhotos from "./pages/OnboardingPhotos";
import OnboardingLocation from "./pages/OnboardingLocation";
import OnboardingBasics from "./pages/OnboardingBasics";
import OnboardingLifestyle from "./pages/OnboardingLifestyle";
import OnboardingMusicPreferences from "./pages/OnboardingMusicPreferences";
import OnboardingMoviePreferences from "./pages/OnboardingMoviePreferences";
import OnboardingBookPreferences from "./pages/OnboardingBookPreferences";
import OnboardingTravelPreferences from "./pages/OnboardingTravelPreferences";
import LoadingDiscovery from "./pages/LoadingDiscovery";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import ReportUser from "./pages/ReportUser";
import Matches from "./pages/Matches";
import Chats from "./pages/Chats";
import ChatConversation from "./pages/ChatConversation";
import VoiceCall from "./pages/VoiceCall";
import EditProfile from "./pages/EditProfile";
import VideoCall from "./pages/VideoCall";
import UpgradeMembership from "./pages/UpgradeMembership";
import ReviewSummary from "./pages/ReviewSummary";
import PaymentMethod from "./pages/PaymentMethod";
import Settings from "./pages/Settings";
import DiscoveryPreferences from "./pages/DiscoveryPreferences";
import NotificationSettings from "./pages/NotificationSettings";
import AccountSecurity from "./pages/AccountSecurity";
import SubscriptionSettings from "./pages/SubscriptionSettings";
import ProfilePrivacy from "./pages/ProfilePrivacy";
import DataAnalytics from "./pages/DataAnalytics";
import Username from "./pages/Username";
import Visibility from "./pages/Visibility";
import BlockedUsers from "./pages/BlockedUsers";
import AppAppearance from "./pages/AppAppearance";
import ThirdPartyIntegrations from "./pages/ThirdPartyIntegrations";
import AddNewPayment from "./pages/AddNewPayment";
import HelpSupport from "./pages/HelpSupport";
import FAQ from "./pages/FAQ";
import ContactSupport from "./pages/ContactSupport";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ManageActiveStatus from "./pages/ManageActiveStatus";
import ManageMessages from "./pages/ManageMessages";
import AppLanguage from "./pages/AppLanguage";
import FaithDemo from "./pages/FaithDemo";
import DesignSystem from "./pages/DesignSystem";
import DesignSystemDemo from "./pages/DesignSystemDemo";
import TypographyShowcase from "./pages/TypographyShowcase";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAudit from "./pages/AdminAudit";
import AdminInvites from "./pages/AdminInvites";
import SafeModeDemoPage from "./pages/SafeModeDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ActionLoggerProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/walkthrough" element={<Walkthrough />} />
            <Route path="/walkthrough2" element={<Walkthrough2 />} />
            <Route path="/walkthrough3" element={<Walkthrough3 />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup-filled" element={<SignUpFilled />} />
            <Route path="/invite-signup" element={<InviteSignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route
              path="/create-new-password"
              element={<CreateNewPassword />}
            />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route
              path="/captcha-verification"
              element={<CaptchaVerification />}
            />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route
              path="/onboarding/nickname"
              element={<OnboardingNickname />}
            />
            <Route
              path="/onboarding/birthdate"
              element={<OnboardingBirthdate />}
            />
            <Route path="/onboarding/gender" element={<OnboardingGender />} />
            <Route path="/onboarding/goals" element={<OnboardingGoals />} />
            <Route
              path="/onboarding/distance"
              element={<OnboardingDistance />}
            />
            <Route
              path="/onboarding/interests"
              element={<OnboardingInterests />}
            />
            <Route path="/onboarding/photos" element={<OnboardingPhotos />} />
            <Route
              path="/onboarding/location"
              element={<OnboardingLocation />}
            />
            <Route path="/onboarding/basics" element={<OnboardingBasics />} />
            <Route
              path="/onboarding/lifestyle"
              element={<OnboardingLifestyle />}
            />
            <Route
              path="/onboarding/music-preferences"
              element={<OnboardingMusicPreferences />}
            />
            <Route
              path="/onboarding/movie-preferences"
              element={<OnboardingMoviePreferences />}
            />
            <Route
              path="/onboarding/book-preferences"
              element={<OnboardingBookPreferences />}
            />
            <Route
              path="/onboarding/travel-preferences"
              element={<OnboardingTravelPreferences />}
            />
            <Route path="/loading" element={<LoadingDiscovery />} />
            <Route path="/home" element={<Home />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chat/:userId" element={<ChatConversation />} />
            <Route path="/voice-call/:userId" element={<VoiceCall />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/video-call/:userId" element={<VideoCall />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/report-user" element={<ReportUser />} />
            <Route path="/upgrade-membership" element={<UpgradeMembership />} />
            <Route path="/review-summary" element={<ReviewSummary />} />
            <Route path="/payment-method" element={<PaymentMethod />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/settings/discovery-preferences"
              element={<DiscoveryPreferences />}
            />
            <Route
              path="/settings/notification"
              element={<NotificationSettings />}
            />
            <Route
              path="/settings/account-security"
              element={<AccountSecurity />}
            />
            <Route
              path="/settings/subscription"
              element={<SubscriptionSettings />}
            />
            <Route
              path="/settings/profile-privacy"
              element={<ProfilePrivacy />}
            />
            <Route
              path="/settings/data-analytics"
              element={<DataAnalytics />}
            />
            <Route path="/settings/username" element={<Username />} />
            <Route path="/settings/visibility" element={<Visibility />} />
            <Route path="/settings/blocked-users" element={<BlockedUsers />} />
            <Route
              path="/settings/app-appearance"
              element={<AppAppearance />}
            />
            <Route
              path="/settings/integrations"
              element={<ThirdPartyIntegrations />}
            />
            <Route
              path="/third-party-integrations"
              element={<ThirdPartyIntegrations />}
            />
            <Route path="/add-new-payment" element={<AddNewPayment />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact-support" element={<ContactSupport />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/settings/manage-active-status"
              element={<ManageActiveStatus />}
            />
            <Route
              path="/settings/manage-messages"
              element={<ManageMessages />}
            />
            <Route path="/settings/app-language" element={<AppLanguage />} />
            <Route path="/faith-demo" element={<FaithDemo />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/design-system-demo" element={<DesignSystemDemo />} />
            <Route
              path="/typography-showcase"
              element={<TypographyShowcase />}
            />
            <Route
              path="/subscription/success"
              element={<SubscriptionSuccess />}
            />
            <Route
              path="/subscription/cancel"
              element={<SubscriptionCancel />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/audit" element={<AdminAudit />} />
            <Route path="/admin/invites" element={<AdminInvites />} />
            <Route path="/safe-mode-demo" element={<SafeModeDemoPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ActionLoggerProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
