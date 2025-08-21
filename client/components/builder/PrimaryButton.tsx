// client/components/builder/PrimaryButton.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validateComponentProps, primaryButtonSchema } from "./registry";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  text: string;
  actionId?: string;
  to?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

// Action registry for Builder.io actions
const ACTION_REGISTRY: Record<string, () => void | Promise<void>> = {
  "open-modal": () => {
    // This would open a modal in a real implementation
    toast.info("Modal action triggered");
  },
  "save-settings": async () => {
    // This would save settings in a real implementation
    toast.info("Settings saved");
  },
  "start-checkout": () => {
    // This would start checkout flow
    toast.info("Starting checkout...");
    window.location.href = "/checkout";
  },
  "refresh-data": () => {
    // This would refresh data
    toast.info("Refreshing data...");
    window.location.reload();
  },
  "share-profile": async () => {
    // This would share profile
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Profile",
          text: "Check out my profile!",
          url: window.location.href,
        });
      } catch (error) {
        toast.error("Failed to share");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
  "delete-account": async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      // This would delete account in a real implementation
      toast.error("Account deletion not implemented in demo");
    }
  },
  "report-user": () => {
    toast.info("Report user functionality triggered");
  },
  "block-user": () => {
    toast.info("Block user functionality triggered");
  },
};

export function PrimaryButton(props: PrimaryButtonProps) {
  // Validate props at runtime
  const validatedProps = validateComponentProps(
    "PrimaryButton",
    props,
    primaryButtonSchema,
  );
  const {
    text,
    actionId,
    to,
    variant = "default",
    size = "default",
    disabled = false,
    loading = false,
    fullWidth = false,
    className,
  } = validatedProps;

  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    if (disabled || loading || isProcessing) return;

    try {
      setIsProcessing(true);

      if (actionId) {
        // Execute registered action
        const action = ACTION_REGISTRY[actionId];
        if (action) {
          await action();
        } else {
          console.warn(`Unknown action: ${actionId}`);
          toast.error(`Unknown action: ${actionId}`);
        }
      } else if (to) {
        // Navigate to URL
        if (to.startsWith("http")) {
          // External URL
          window.open(to, "_blank", "noopener,noreferrer");
        } else {
          // Internal navigation
          navigate(to);
        }
      }
    } catch (error) {
      console.error("Button action error:", error);
      toast.error("Action failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = loading || isProcessing;
  const isDisabled = disabled || isLoading;

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(fullWidth && "w-full", className)}
      aria-label={text}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

// Function to register a new action
export function registerAction(
  actionId: string,
  action: () => void | Promise<void>,
) {
  ACTION_REGISTRY[actionId] = action;
}

// Function to get available actions (useful for Builder.io UI)
export function getAvailableActions(): string[] {
  return Object.keys(ACTION_REGISTRY);
}

export default PrimaryButton;
