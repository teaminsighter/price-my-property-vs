import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

// Create new form session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      referrer,
      landingPage,
      deviceType,
      browser,
      os,
      screenSize,
    } = body;

    // Generate unique session ID
    const sessionId = nanoid(16);

    // Create analytics session
    const session = await prisma.formAnalytics.create({
      data: {
        sessionId,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        referrer,
        landingPage,
        deviceType,
        browser,
        os,
        screenSize,
        stepHistory: JSON.stringify([]), // Initialize empty array
        currentStep: 3,
        maxStepReached: 3,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.error('Error creating form session:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Update form session (track step progress)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      step,
      stepName,
      duration,
      answer,
      answers, // Complete form state
      wasSkipped,
      wentBack,
    } = body;

    // Get existing session
    const session = await prisma.formAnalytics.findUnique({
      where: { sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Parse existing step history
    const stepHistory = session.stepHistory ? JSON.parse(session.stepHistory) : [];

    // Add new step event
    stepHistory.push({
      step,
      stepName,
      enteredAt: new Date(Date.now() - duration * 1000).toISOString(),
      leftAt: new Date().toISOString(),
      duration,
      answer,
      wasSkipped: wasSkipped || false,
      wentBack: wentBack || false,
    });

    // Calculate metrics
    const maxStepReached = Math.max(session.maxStepReached, step);
    const stepsCompleted = stepHistory.filter((s: any) => !s.wasSkipped).length;
    const totalDuration = stepHistory.reduce((sum: number, s: any) => sum + s.duration, 0);
    const averageStepTime = totalDuration / stepsCompleted;

    // Update session
    const updated = await prisma.formAnalytics.update({
      where: { sessionId },
      data: {
        stepHistory: JSON.stringify(stepHistory),
        currentStep: step,
        maxStepReached,
        stepsCompleted,
        answers: answers ? JSON.stringify(answers) : session.answers,
        totalDuration,
        averageStepTime,
        exitStep: step, // Track last step in case of abandonment
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: updated.sessionId,
    });
  } catch (error) {
    console.error('Error updating form session:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
