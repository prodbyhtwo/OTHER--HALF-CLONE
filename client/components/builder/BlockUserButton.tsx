// client/components/builder/BlockUserButton.tsx
import React, { useState, useEffect } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, ShieldOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validateComponentProps, blockUserButtonSchema } from "./registry";

interface BlockUserButtonProps {
  userId: string;
  targetId: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  confirmationRequired?: boolean;
  className?: string;
}

export function BlockUserButton(props: BlockUserButtonProps) {
  const validatedProps = validateComponentProps('BlockUserButton', props, blockUserButtonSchema);
  const { 
    userId, 
    targetId, 
    variant = 'destructive', 
    size = 'default', 
    confirmationRequired = true,
    className
  } = validatedProps;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  
  // Check if user is already blocked
  useEffect(() => {
    const checkBlockStatus = async () => {
      try {
        const response = await fetch('/api/me/blocks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsBlocked(data.data.blockedUserIds.includes(targetId));
        }
      } catch (error) {
        console.error('Error checking block status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkBlockStatus();
  }, [targetId]);
  
  const handleBlock = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/users/${targetId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason: 'Blocked via button' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to block user');
      }
      
      setIsBlocked(true);
      toast.success('User blocked successfully');
      
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUnblock = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/users/${targetId}/block`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to unblock user');
      }
      
      setIsBlocked(false);
      toast.success('User unblocked successfully');
      
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClick = () => {
    if (isBlocked) {
      handleUnblock();
    } else {
      handleBlock();
    }
  };
  
  if (checkingStatus) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }
  
  if (confirmationRequired && !isBlocked) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            disabled={isLoading}
            className={className}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            Block User
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block this user? They won't be able to see your profile 
              or send you messages. You can unblock them later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBlock}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Blocking...
                </>
              ) : (
                'Block User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  return (
    <Button 
      variant={isBlocked ? "outline" : variant} 
      size={size} 
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isBlocked ? (
        <ShieldOff className="mr-2 h-4 w-4" />
      ) : (
        <Shield className="mr-2 h-4 w-4" />
      )}
      {isBlocked ? 'Unblock User' : 'Block User'}
    </Button>
  );
}

export default BlockUserButton;
