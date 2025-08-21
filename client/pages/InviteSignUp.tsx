import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Mail, Key } from "lucide-react";
import { useLoggedHandlers } from "@/components/ActionLoggerProvider";

interface SystemSettings {
  invite_only_mode: boolean;
  invite_requirements: {
    email_domain_whitelist: string[];
    must_supply_invite_key: boolean;
  };
}

export default function InviteSignUp() {
  const { createClickHandler, createSubmitHandler } = useLoggedHandlers();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get invite code from URL if present
  const inviteCodeFromUrl = searchParams.get("invite") || "";

  // State
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"invite" | "code">("invite");
  const [inviteCode, setInviteCode] = useState(inviteCodeFromUrl);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [codeExpiry, setCodeExpiry] = useState<Date | null>(null);

  // Load system settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings/invite-only-mode");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Countdown timer for code expiry
  useEffect(() => {
    if (!codeExpiry) return;

    const timer = setInterval(() => {
      const now = new Date();
      if (now >= codeExpiry) {
        setCodeExpiry(null);
        setError("This code has expired. Please request a new one.");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [codeExpiry]);

  const handleInviteChange = (value: string) => {
    setInviteCode(value.toUpperCase());
    setError("");
  };

  const handleEmailChange = (value: string) => {
    setEmail(value.toLowerCase().trim());
    setError("");
  };

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, "").slice(0, 6));
    setError("");
  };

  const onRequestEmailCode = createSubmitHandler(
    "request_email_code",
    async (formData: { inviteCode: string; email: string }) => {
      setSubmitting(true);
      setError("");

      try {
        const response = await fetch("/api/auth/email/request-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            invite_code: formData.inviteCode || undefined,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess(`Verification code sent to ${formData.email}`);
          setStep("code");
          // Set expiry time (10 minutes from now)
          setCodeExpiry(new Date(Date.now() + 10 * 60 * 1000));
        } else {
          setError(data.error || "Failed to send verification code");
        }
      } catch (error) {
        setError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  );

  const onVerifyEmailCode = createSubmitHandler(
    "verify_email_code",
    async (formData: { email: string; code: string; inviteCode: string }) => {
      setSubmitting(true);
      setError("");

      try {
        const response = await fetch("/api/auth/email/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            code: formData.code,
            invite_code: formData.inviteCode || undefined,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store session token (in a real app, this would be handled by auth context)
          localStorage.setItem("auth_token", data.session.token);

          // Redirect to onboarding
          navigate("/onboarding/nickname");
        } else {
          setError(data.error || "Invalid verification code");
        }
      } catch (error) {
        setError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  );

  const onResendCode = createClickHandler("resend_code", "button", async () => {
    await onRequestEmailCode({ inviteCode, email });
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9610FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!settings?.invite_only_mode) {
    // If invite-only mode is off, redirect to regular auth
    navigate("/signin");
    return null;
  }

  const timeRemaining = codeExpiry
    ? Math.max(0, Math.floor((codeExpiry.getTime() - Date.now()) / 1000))
    : 0;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button
          onClick={createClickHandler("back_button", "button", () =>
            navigate(-1),
          )}
          data-action="click_back_button"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#9610FF]">OTHER HALF</h1>
          <p className="text-sm text-gray-600">Faith-based connections</p>
        </div>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {step === "invite"
                  ? "Invite-only access"
                  : "Enter verification code"}
              </CardTitle>
              <CardDescription>
                {step === "invite"
                  ? "Enter your invite key and email to get a sign-in code"
                  : `Code sent to ${email}`}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {step === "invite" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onRequestEmailCode({ inviteCode, email });
                  }}
                  className="space-y-4"
                >
                  {settings.invite_requirements.must_supply_invite_key && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="invite-code"
                        className="flex items-center"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Invite key
                      </Label>
                      <Input
                        id="invite-code"
                        type="text"
                        placeholder="Enter your invite key"
                        value={inviteCode}
                        onChange={(e) => handleInviteChange(e.target.value)}
                        required={
                          settings.invite_requirements.must_supply_invite_key
                        }
                        className="font-mono uppercase"
                        data-action="input_invite_code"
                      />
                      <p className="text-sm text-gray-600">
                        Ask your church leader or friend for a key. Keys may
                        expire or have limited uses.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      required
                      data-action="input_email"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#9610FF] hover:bg-[#8A0FE6]"
                    disabled={
                      submitting ||
                      !email ||
                      (settings.invite_requirements.must_supply_invite_key &&
                        !inviteCode)
                    }
                    data-action="submit_request_code"
                  >
                    {submitting ? "Sending..." : "Send sign-in code"}
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onVerifyEmailCode({ email, code, inviteCode });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="code">6-digit code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      required
                      className="font-mono text-center text-2xl tracking-widest"
                      maxLength={6}
                      data-action="input_verification_code"
                    />
                    {timeRemaining > 0 && (
                      <p className="text-sm text-gray-600 text-center">
                        Code expires in {minutes}:
                        {seconds.toString().padStart(2, "0")}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#9610FF] hover:bg-[#8A0FE6]"
                    disabled={submitting || code.length !== 6}
                    data-action="submit_verify_code"
                  >
                    {submitting ? "Verifying..." : "Verify code"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={onResendCode}
                      disabled={submitting || timeRemaining > 540} // Disable for first 1 minute
                      className="text-[#9610FF] hover:underline text-sm disabled:text-gray-400"
                      data-action="click_resend_code"
                    >
                      {timeRemaining > 540
                        ? "Resend code (wait 1 minute)"
                        : "Resend code"}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={createClickHandler(
                        "change_email",
                        "button",
                        () => setStep("invite"),
                      )}
                      className="text-gray-600 hover:underline text-sm"
                      data-action="click_change_email"
                    >
                      Change email address
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
