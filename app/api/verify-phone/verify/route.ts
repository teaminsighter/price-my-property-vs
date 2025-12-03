'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cleanPhoneNumber } from '@/lib/phone-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    // Clean the phone number
    const cleanedPhone = cleanPhoneNumber(phone);

    // Find the most recent verification for this phone
    const verification = await prisma.phoneVerification.findFirst({
      where: {
        phone: cleanedPhone,
        code: code.toString(),
        verified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (new Date() > verification.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check max attempts
    if (verification.attemptCount >= verification.maxAttempts) {
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    // Increment attempt count
    await prisma.phoneVerification.update({
      where: { id: verification.id },
      data: {
        attemptCount: verification.attemptCount + 1,
      },
    });

    // Check if code matches
    if (verification.code !== code.toString()) {
      const remainingAttempts = verification.maxAttempts - (verification.attemptCount + 1);
      return NextResponse.json(
        {
          success: false,
          error: `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
        },
        { status: 400 }
      );
    }

    // Mark as verified
    await prisma.phoneVerification.update({
      where: { id: verification.id },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
      verificationId: verification.id,
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}
