'use client';

import { useState } from 'react';

export function usePhoneVerification() {
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const startVerification = (phone: string) => {
    setPhoneToVerify(phone);
    setIsVerificationOpen(true);
    setIsVerified(false);
    setVerificationId(null);
  };

  const handleVerified = (id: string) => {
    setVerificationId(id);
    setIsVerified(true);
    setIsVerificationOpen(false);
  };

  const closeVerification = () => {
    setIsVerificationOpen(false);
  };

  const resetVerification = () => {
    setIsVerificationOpen(false);
    setPhoneToVerify('');
    setVerificationId(null);
    setIsVerified(false);
  };

  return {
    isVerificationOpen,
    phoneToVerify,
    verificationId,
    isVerified,
    startVerification,
    handleVerified,
    closeVerification,
    resetVerification,
  };
}
