// client/components/SafeModeIndicator.tsx
import { useState } from "react";
import { envClient } from "@/env/client";
import { AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SafeModeIndicatorProps {
  className?: string;
  variant?: "badge" | "banner" | "compact";
  showDismiss?: boolean;
}

export function SafeModeIndicator({ 
  className = "", 
  variant = "badge",
  showDismiss = false 
}: SafeModeIndicatorProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Don't show in production or if not in safe mode
  if (!envClient.VITE_SAFE_MODE || envClient.MODE === "production" || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (variant === "banner") {
    return (
      <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              Development Mode Active
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              This application is running in SAFE_MODE with mock services. 
              All payments, emails, and external integrations are simulated.
            </p>
            <SafeModeDetailsDialog />
          </div>
          {showDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-amber-600 hover:text-amber-800 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 text-xs text-amber-700 ${className}`}>
        <AlertTriangle className="h-3 w-3" />
        <span>SAFE MODE</span>
        <SafeModeDetailsDialog />
      </div>
    );
  }

  // Default badge variant
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
        <AlertTriangle className="h-3 w-3 mr-1" />
        SAFE MODE
      </Badge>
      <SafeModeDetailsDialog />
    </div>
  );
}

function SafeModeDetailsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <Info className="h-4 w-4 text-amber-600" />
          <span className="sr-only">Show SAFE MODE details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            SAFE MODE Active
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This application is running in development mode with mock services enabled.
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Mock Services Active:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 💳 Payments (Stripe) - Mock checkout flows</li>
                <li>• 📧 Email (SendGrid) - Saved to local mailbox</li>
                <li>• 🗄️ Storage - Local filesystem</li>
                <li>• 📊 Analytics - Local logging</li>
                <li>• 🔔 Push Notifications - Mock delivery</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">What this means:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• No real charges will be made</li>
                <li>• Emails are saved locally (not sent)</li>
                <li>• All interactions are fully functional</li>
                <li>• Data is stored temporarily</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              For Developers:
            </h4>
            <p className="text-xs text-blue-800">
              Set <code>SAFE_MODE=false</code> and provide real API keys to enable production services.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for checking safe mode status
export function useSafeMode() {
  return {
    isSafeMode: envClient.VITE_SAFE_MODE,
    isDevelopment: envClient.MODE === "development",
    isProduction: envClient.MODE === "production",
  };
}

// Higher-order component for wrapping features that require real services
interface SafeModeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireReal?: boolean;
}

export function SafeModeWrapper({ 
  children, 
  fallback, 
  requireReal = false 
}: SafeModeWrapperProps) {
  if (requireReal && envClient.VITE_SAFE_MODE) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Feature Unavailable in SAFE MODE
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          This feature requires real services to be configured.
        </p>
        {fallback}
      </div>
    );
  }

  return <>{children}</>;
}
