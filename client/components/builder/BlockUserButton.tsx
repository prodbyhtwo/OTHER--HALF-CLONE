// client/components/builder/BlockUserButton.tsx
import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, ShieldOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBlockUpdates } from "@/hooks/use-realtime";
import { validateComponentProps, blockUserButtonSchema } from "./registry";

interface BlockUserButtonProps {
  userId: string;
  targetId: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  confirmationRequired?: boolean;
  className?: string;
}

export function BlockUserButton(props: BlockUserButtonProps) {
  const validatedProps = validateComponentProps(
    "BlockUserButton",
    props,
    blockUserButtonSchema,
  );
  const {
    userId,
    targetId,
    variant = "destructive",
    size = "default",
    confirmationRequired = true,
    className,
  } = validatedProps;

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { lastUpdate } = useBlockUpdates(userId);

  const [blockReason, setBlockReason] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Check if target user is blocked
  const { data: blockedUsers, isLoading: checkingStatus } = useQuery<{
    success: boolean;
    data: { blockedUserIds: string[]; total: number };
  }>({
    queryKey: ["blocks", userId],
    queryFn: async () => {
      const response = await fetch("/api/blocks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch blocked users");
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });

  const isBlocked =
    blockedUsers?.data.blockedUserIds.includes(targetId) || false;

  // Block user mutation
  const blockUserMutation = useMutation({
    mutationFn: async (reason?: string) => {
      const response = await fetch("/api/blocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          userId: targetId,
          reason: reason || "No reason provided",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to block user");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blocks", userId] });
      setDialogOpen(false);
      setBlockReason("");
      toast({
        title: "User blocked",
        description: "The user has been blocked successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to block user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Unblock user mutation
  const unblockUserMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/blocks/${targetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to unblock user");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blocks", userId] });
      toast({
        title: "User unblocked",
        description: "The user has been unblocked successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to unblock user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBlock = () => {
    blockUserMutation.mutate(blockReason);
  };

  const handleUnblock = () => {
    unblockUserMutation.mutate();
  };

  const handleQuickBlock = () => {
    if (confirmationRequired) {
      setDialogOpen(true);
    } else {
      blockUserMutation.mutate();
    }
  };

  // Handle real-time block updates
  useEffect(() => {
    if (lastUpdate?.type === "block_update") {
      queryClient.invalidateQueries({ queryKey: ["blocks", userId] });
    }
  }, [lastUpdate, queryClient, userId]);

  const isLoading =
    blockUserMutation.isPending || unblockUserMutation.isPending;

  // Don't allow blocking yourself
  if (userId === targetId) {
    return null;
  }

  if (checkingStatus) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (isBlocked) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleUnblock}
        disabled={isLoading}
        className={className}
      >
        {unblockUserMutation.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ShieldOff className="mr-2 h-4 w-4" />
        )}
        Unblock User
      </Button>
    );
  }

  if (confirmationRequired) {
    return (
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={isLoading}
            className={className}
          >
            <Shield className="mr-2 h-4 w-4" />
            Block User
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block this user? They won't be able to
              see your profile or send you messages. You can unblock them later
              if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="block-reason">Reason (optional):</Label>
            <Textarea
              id="block-reason"
              placeholder="Why are you blocking this user?"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This reason is for your reference only and won't be shared.
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlock}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {blockUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Blocking...
                </>
              ) : (
                "Block User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleQuickBlock}
      disabled={isLoading}
      className={className}
    >
      {blockUserMutation.isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Shield className="mr-2 h-4 w-4" />
      )}
      Block User
    </Button>
  );
}

export default BlockUserButton;
