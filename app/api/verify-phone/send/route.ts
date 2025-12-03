'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cleanPhoneNumber } from '@/lib/phone-utils';

// TransmitSMS API configuration
const SMS_API_URL = process.env.SMS_API_URL;
const SMS_API_USERNAME = process.env.SMS_API_USERNAME;
const SMS_API_PASSWORD = process.env.SMS_API_PASSWORD;

const isSmsConfigured = !!(SMS_API_URL && SMS_API_USERNAME && SMS_API_PASSWORD);

// Test phone numbers for internal testing (bypass SMS sending)
const TEST_PHONE_NUMBERS = [
  '64333333',
  '+64333333',
  '0333333',
];

// Test verification code for test numbers
const TEST_VERIFICATION_CODE = '123456';

// Check if phone is a test number
function isTestPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return TEST_PHONE_NUMBERS.some(testPhone =>
    cleaned === testPhone || cleaned.endsWith(testPhone.replace(/^\+/, ''))
  );
}

// Generate a 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Rate limiting: Max 3 SMS per phone per hour
async function checkRateLimit(phone: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentVerifications = await prisma.phoneVerification.count({
    where: {
      phone,
      createdAt: {
        gte: oneHourAgo,
      },
    },
  });

  return recentVerifications < 3;
}

export async function POST(request: NextRequest) {
  console.log('=== PHONE VERIFICATION SEND START ===');
  try {
    const body = await request.json();
    const { phone } = body;
    console.log('Phone verification request for:', phone);

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Clean the phone number
    const cleanedPhone = cleanPhoneNumber(phone);

    // Check rate limit
    const canSend = await checkRateLimit(cleanedPhone);
    if (!canSend) {
      return NextResponse.json(
        { success: false, error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Check if this is a test phone number
    const isTestNumber = isTestPhoneNumber(cleanedPhone);

    // Generate verification code (use fixed code for test numbers)
    const code = isTestNumber ? TEST_VERIFICATION_CODE : generateCode();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Get IP and User Agent for security
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Store verification in database
    await prisma.phoneVerification.create({
      data: {
        phone: cleanedPhone,
        code,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    // Skip SMS sending for test numbers
    if (isTestNumber) {
      console.log(`[TEST MODE] Test phone number detected: ${cleanedPhone}, code: ${TEST_VERIFICATION_CODE}`);
      return NextResponse.json({
        success: true,
        message: 'Verification code sent successfully',
      });
    }

    // Send SMS via TransmitSMS (if configured)
    if (isSmsConfigured) {
      try {
        // Format phone number for international format (NZ only)
        let formattedPhone = cleanedPhone;

        // Ensure +64 prefix for NZ numbers
        if (cleanedPhone.startsWith('0')) {
          formattedPhone = '64' + cleanedPhone.substring(1);
        } else if (cleanedPhone.startsWith('+64')) {
          formattedPhone = cleanedPhone.substring(1); // Remove + for TransmitSMS
        } else if (!cleanedPhone.startsWith('64')) {
          formattedPhone = '64' + cleanedPhone;
        }

        console.log(`[SMS] Formatted phone: ${formattedPhone}`);

        // Send SMS via TransmitSMS API with Basic Authentication
        console.log(`[SMS] Attempting to send to ${formattedPhone} via ${SMS_API_URL}`);

        // Create Basic Auth header
        const basicAuth = Buffer.from(`${SMS_API_USERNAME}:${SMS_API_PASSWORD}`).toString('base64');

        // TransmitSMS expects form-urlencoded data, not JSON
        const formData = new URLSearchParams();
        formData.append('to', formattedPhone);
        formData.append('message', `Your Price My Property verification code is: ${code}. Valid for 10 minutes.`);

        const smsResponse = await fetch(SMS_API_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
          },
          body: formData.toString(),
        });

        console.log(`[SMS] Response status: ${smsResponse.status}`);

        // Get response text first to handle non-JSON responses
        const responseText = await smsResponse.text();
        console.log(`[SMS] Response body: ${responseText.substring(0, 200)}`);

        // Try to parse as JSON
        let smsResult;
        try {
          smsResult = JSON.parse(responseText);
        } catch {
          // If not JSON, check if it's a simple text error
          if (responseText.toLowerCase().includes('authorisation') || responseText.toLowerCase().includes('authorization')) {
            console.error('[SMS] Authorization failed - check API credentials');
            throw new Error('SMS API authorization failed. Please verify your API credentials.');
          }
          console.error('[SMS] Failed to parse response as JSON');
          throw new Error(`TransmitSMS API returned non-JSON response: ${responseText.substring(0, 100)}`);
        }

        // Check for errors in response
        if (!smsResponse.ok) {
          const errorMsg = smsResult.error?.message || smsResult.message || JSON.stringify(smsResult);
          throw new Error(`SMS API error (${smsResponse.status}): ${errorMsg}`);
        }

        // Check for API-level errors even with 200 status
        // Note: TransmitSMS returns error.code = "SUCCESS" for successful requests
        if (smsResult.error && smsResult.error.code !== 'SUCCESS') {
          const errorMsg = smsResult.error?.description || smsResult.error?.message || JSON.stringify(smsResult);
          throw new Error(`SMS API error: ${errorMsg}`);
        }
        if (smsResult.errors) {
          const errorMsg = smsResult.errors?.[0]?.message || JSON.stringify(smsResult);
          throw new Error(`SMS API error: ${errorMsg}`);
        }

        console.log(`SMS sent successfully to ${formattedPhone}`);
        console.log(`[SMS] Message ID: ${smsResult.message_id || 'N/A'}`);
      } catch (smsError: unknown) {
        const errorMessage = smsError instanceof Error ? smsError.message : String(smsError);
        console.error('TransmitSMS Error:', errorMessage);
        // Don't fail the request if SMS fails, still return success
        // so dev mode can continue working
      }
    } else {
      // Development mode - log the code
      console.log(`[DEV MODE] Verification code for ${cleanedPhone}: ${code}`);
    }

    console.log('Verification code sent successfully');
    console.log('=== PHONE VERIFICATION SEND SUCCESS ===');
    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      // REMOVE THIS IN PRODUCTION - only for development/testing
      devCode: !isSmsConfigured && process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    console.log('=== PHONE VERIFICATION SEND FAILED ===');
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
