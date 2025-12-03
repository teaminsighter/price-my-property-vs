'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  onVerified: (verificationId: string) => void;
  skipInitialSend?: boolean; // Skip sending code on open (if already sent by server)
}

export function PhoneVerificationModal({
  isOpen,
  onClose,
  phone,
  onVerified,
  skipInitialSend = false,
}: PhoneVerificationModalProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Send verification code
  const sendCode = useCallback(async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/verify-phone/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          variant: 'destructive',
          title: 'Failed to send code',
          description: data.error || 'Please try again later',
        });
        return;
      }

      // Show dev code in development mode
      if (data.devCode) {
        toast({
          title: 'Development Mode',
          description: `Verification code: ${data.devCode}`,
        });
      } else {
        toast({
          title: 'Code sent!',
          description: 'Please check your phone for the verification code',
        });
      }

      setTimeLeft(600); // Reset timer
      setCanResend(false);
    } catch (error) {
      console.error('Error sending code:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send verification code',
      });
    } finally {
      setIsSending(false);
    }
  }, [phone, toast]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) {
      if (timeLeft <= 0) setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Send code when modal opens (unless skipInitialSend is true)
  useEffect(() => {
    if (isOpen && phone && !skipInitialSend) {
      sendCode();
    }
  }, [isOpen, phone, skipInitialSend, sendCode]);

  // Verify code
  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid code',
        description: 'Please enter the 6-digit verification code',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          variant: 'destructive',
          title: 'Verification failed',
          description: data.error || 'Invalid code',
        });
        return;
      }

      toast({
        title: 'Success!',
        description: 'Phone number verified successfully',
      });

      onVerified(data.verificationId);
      onClose();
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to verify code',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle code input - only allow numbers and max 6 digits
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && code.length === 6) {
      handleVerify();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Phone Number</DialogTitle>
          <DialogDescription>
            We sent a 6-digit code to <strong>{phone}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={handleCodeChange}
              onKeyPress={handleKeyPress}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              autoFocus
              disabled={isVerifying}
            />
            {timeLeft > 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                Code expires in {formatTime(timeLeft)}
              </p>
            ) : (
              <p className="text-sm text-destructive text-center">
                Code has expired. Please request a new one.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || code.length !== 6 || timeLeft === 0}
              className="w-full"
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>

            <Button
              variant="outline"
              onClick={sendCode}
              disabled={isSending || !canResend}
              className="w-full"
            >
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {canResend ? 'Resend Code' : `Resend in ${formatTime(timeLeft)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
