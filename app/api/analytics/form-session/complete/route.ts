import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mark form session as completed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, leadId } = body;

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

    // Update session as completed
    const updated = await prisma.formAnalytics.update({
      where: { sessionId },
      data: {
        completed: true,
        completedAt: new Date(),
        leadId,
        convertedToLead: !!leadId,
        abandoned: false,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: updated.sessionId,
    });
  } catch (error) {
    console.error('Error completing form session:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
