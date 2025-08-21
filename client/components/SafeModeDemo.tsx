// client/components/SafeModeDemo.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  CreditCard,
  Database,
  TrendingUp,
  Bell,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { SafeModeIndicator } from "./SafeModeIndicator";
import { toast } from "sonner";

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export function SafeModeDemo() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});

  const setLoadingState = (key: string, isLoading: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: isLoading }));
  };

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    return response.json();
  };

  const testEmail = async () => {
    setLoadingState("email", true);
    try {
      const result = await apiCall("/api/demo/email", {
        method: "POST",
        body: JSON.stringify({
          to: "test@example.com",
          subject: "SAFE_MODE Test Email",
          html: "<h1>Hello from SAFE_MODE!</h1><p>This email was sent in development mode.</p>",
        }),
      });
      setResults((prev) => ({ ...prev, email: result }));
      toast.success("Email sent to mock mailbox!");
    } catch (error) {
      toast.error("Email test failed");
      setResults((prev) => ({ ...prev, email: { error: String(error) } }));
    } finally {
      setLoadingState("email", false);
    }
  };

  const testPayment = async () => {
    setLoadingState("payment", true);
    try {
      const result = await apiCall("/api/demo/payment", {
        method: "POST",
        body: JSON.stringify({
          priceId: "price_test_monthly",
          userEmail: "test@example.com",
          userId: "user_test_123",
        }),
      });
      setResults((prev) => ({ ...prev, payment: result }));
      if (result.checkoutUrl) {
        toast.success("Mock checkout session created!");
      }
    } catch (error) {
      toast.error("Payment test failed");
      setResults((prev) => ({ ...prev, payment: { error: String(error) } }));
    } finally {
      setLoadingState("payment", false);
    }
  };

  const testAnalytics = async () => {
    setLoadingState("analytics", true);
    try {
      const result = await apiCall("/api/demo/analytics", {
        method: "POST",
        body: JSON.stringify({
          event: "safe_mode_test",
          userId: "user_test_123",
          properties: {
            feature: "analytics_demo",
            timestamp: new Date().toISOString(),
          },
        }),
      });
      setResults((prev) => ({ ...prev, analytics: result }));
      toast.success("Analytics event tracked!");
    } catch (error) {
      toast.error("Analytics test failed");
      setResults((prev) => ({ ...prev, analytics: { error: String(error) } }));
    } finally {
      setLoadingState("analytics", false);
    }
  };

  const testNotification = async () => {
    setLoadingState("notification", true);
    try {
      const result = await apiCall("/api/demo/notification", {
        method: "POST",
        body: JSON.stringify({
          to: "user_test_123",
          title: "SAFE_MODE Test",
          body: "This is a test notification from SAFE_MODE",
          data: { type: "demo", timestamp: Date.now() },
        }),
      });
      setResults((prev) => ({ ...prev, notification: result }));
      toast.success("Push notification sent to mock queue!");
    } catch (error) {
      toast.error("Notification test failed");
      setResults((prev) => ({
        ...prev,
        notification: { error: String(error) },
      }));
    } finally {
      setLoadingState("notification", false);
    }
  };

  const getServiceStatus = async () => {
    setLoadingState("status", true);
    try {
      const result = await apiCall("/api/status");
      setResults((prev) => ({ ...prev, status: result }));
    } catch (error) {
      setResults((prev) => ({ ...prev, status: { error: String(error) } }));
    } finally {
      setLoadingState("status", false);
    }
  };

  const renderResult = (key: string) => {
    const result = results[key];
    if (!result) return null;

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          {result.error ? (
            <XCircle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          <span className="text-sm font-medium">
            {result.error ? "Error" : "Success"}
          </span>
        </div>
        <pre className="text-xs overflow-auto max-h-32">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">SAFE_MODE Integration Demo</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This demo shows how all services work end-to-end in SAFE_MODE using
          mock implementations. All buttons are functional and demonstrate real
          workflows without requiring external secrets.
        </p>
        <SafeModeIndicator variant="banner" />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Service Status
              </CardTitle>
              <CardDescription>
                Check the current status of all services in SAFE_MODE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={getServiceStatus}
                disabled={loading.status}
                className="mb-4"
              >
                {loading.status ? "Checking..." : "Get Service Status"}
              </Button>
              {renderResult("status")}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mock Services Active</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Service</span>
                  <Badge variant="secondary">Mock (Local Mailbox)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Processing</span>
                  <Badge variant="secondary">Mock (No Charges)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">File Storage</span>
                  <Badge variant="secondary">Mock (Local Files)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analytics</span>
                  <Badge variant="secondary">Mock (Local Logs)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <Badge variant="secondary">Mock (Local Queue)</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Development Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="/__mailbox"
                  target="_blank"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Mail className="h-4 w-4" />
                  View Mock Mailbox
                  <ExternalLink className="h-3 w-3" />
                </a>
                <div className="text-sm text-gray-600">
                  <strong>Local Storage:</strong> Files saved to{" "}
                  <code>.storage/</code>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Analytics:</strong> Events logged to{" "}
                  <code>.analytics/</code>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Notifications:</strong> Saved to{" "}
                  <code>.notifications/</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Service Test
              </CardTitle>
              <CardDescription>
                Send a test email using the mock mailer service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="email-to">To</Label>
                  <Input id="email-to" defaultValue="test@example.com" />
                </div>
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    defaultValue="SAFE_MODE Test Email"
                  />
                </div>
                <div>
                  <Label htmlFor="email-content">Content</Label>
                  <Textarea
                    id="email-content"
                    defaultValue="Hello from SAFE_MODE! This email was sent in development mode."
                    rows={4}
                  />
                </div>
              </div>
              <Button
                onClick={testEmail}
                disabled={loading.email}
                className="w-full"
              >
                {loading.email ? "Sending..." : "Send Test Email"}
              </Button>
              {renderResult("email")}
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <strong>In SAFE_MODE:</strong> Emails are saved as .eml files in
                the .mailbox/ directory and can be viewed at{" "}
                <a
                  href="/__mailbox"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  /__mailbox
                </a>
                .
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Processing Test
              </CardTitle>
              <CardDescription>
                Create a mock checkout session to test payment flows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testPayment}
                disabled={loading.payment}
                className="w-full"
              >
                {loading.payment
                  ? "Creating..."
                  : "Create Mock Checkout Session"}
              </Button>
              {renderResult("payment")}
              <div className="bg-green-50 p-3 rounded-lg text-sm">
                <strong>In SAFE_MODE:</strong> No real charges are made. Mock
                checkout URLs lead to a success page that simulates payment
                completion.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analytics Test
              </CardTitle>
              <CardDescription>
                Track events using the mock analytics service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testAnalytics}
                disabled={loading.analytics}
                className="w-full"
              >
                {loading.analytics ? "Tracking..." : "Track Test Event"}
              </Button>
              {renderResult("analytics")}
              <div className="bg-purple-50 p-3 rounded-lg text-sm">
                <strong>In SAFE_MODE:</strong> Analytics events are logged to
                local files in the .analytics/ directory for inspection.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Push Notifications Test
              </CardTitle>
              <CardDescription>
                Send a test push notification using the mock service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testNotification}
                disabled={loading.notification}
                className="w-full"
              >
                {loading.notification ? "Sending..." : "Send Test Notification"}
              </Button>
              {renderResult("notification")}
              <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                <strong>In SAFE_MODE:</strong> Push notifications are saved to
                local files in the .notifications/ directory instead of being
                sent to real devices.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
