import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    // Fetch all sessions in date range
    const sessions = await prisma.formAnalytics.findMany({
      where: dateFilter.gte ? { createdAt: dateFilter } : {},
      orderBy: { createdAt: 'desc' },
    });

    // Calculate overview stats
    const totalSessions = sessions.length;
    const completed = sessions.filter((s) => s.completed).length;
    const abandoned = sessions.filter((s) => s.abandoned || (!s.completed && s.exitStep)).length;
    const completionRate = totalSessions > 0 ? (completed / totalSessions) * 100 : 0;

    const completedSessions = sessions.filter((s) => s.completed && s.totalDuration);
    const averageCompletionTime =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) /
          completedSessions.length
        : 0;

    // Calculate funnel data (drop-off by step)
    const funnel = calculateFunnel(sessions);

    // Calculate question analytics
    const questionAnalytics = calculateQuestionAnalytics(sessions);

    // Calculate time analytics
    const timeAnalytics = calculateTimeAnalytics(sessions);

    // Calculate drop-off points
    const dropOffPoints = calculateDropOffPoints(funnel);

    // Device breakdown
    const deviceBreakdown = sessions.reduce((acc: any, s) => {
      const device = s.deviceType || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    // Traffic source breakdown
    const trafficSources = sessions.reduce((acc: any, s) => {
      const source = s.utmSource || 'Direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      overview: {
        totalSessions,
        completed,
        abandoned,
        completionRate: Math.round(completionRate * 10) / 10,
        averageCompletionTime: Math.round(averageCompletionTime),
      },
      funnel,
      questionAnalytics,
      timeAnalytics,
      dropOffPoints,
      deviceBreakdown,
      trafficSources,
    });
  } catch (error) {
    console.error('Error fetching form stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate funnel
function calculateFunnel(sessions: any[]) {
  const steps = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17];
  const stepNames: Record<number, string> = {
    3: 'Property Type',
    4: 'House Size',
    5: 'Land Size',
    6: 'House Age',
    7: 'Bedrooms',
    8: 'Bathrooms',
    9: 'CV Valuation',
    10: 'Garage',
    11: 'Condition',
    12: 'Relationship',
    13: 'Situation',
    14: 'Clarification',
    15: 'Extra Features',
    17: 'Contact Details',
  };

  const funnel = steps.map((step) => {
    const reachedStep = sessions.filter((s) => s.maxStepReached >= step).length;
    const percentage = sessions.length > 0 ? (reachedStep / sessions.length) * 100 : 0;

    return {
      step,
      stepName: stepNames[step],
      count: reachedStep,
      percentage: Math.round(percentage * 10) / 10,
    };
  });

  return funnel;
}

// Helper function to calculate question analytics
function calculateQuestionAnalytics(sessions: any[]) {
  const questionsAnalytics: any[] = [];

  // Process each session's step history
  const allStepEvents: any[] = [];
  sessions.forEach((session) => {
    if (session.stepHistory) {
      try {
        const steps = JSON.parse(session.stepHistory);
        allStepEvents.push(...steps);
      } catch (e) {
        // Skip invalid JSON
      }
    }
  });

  // Group by step
  const stepGroups: Record<number, any[]> = {};
  allStepEvents.forEach((event) => {
    if (!stepGroups[event.step]) {
      stepGroups[event.step] = [];
    }
    stepGroups[event.step].push(event);
  });

  // Analyze each step
  Object.entries(stepGroups).forEach(([step, events]) => {
    const stepNum = parseInt(step);

    // Count answer distribution
    const answerCounts: Record<string, number> = {};
    let totalDuration = 0;
    let skipCount = 0;

    events.forEach((event) => {
      // Count answers
      if (event.answer) {
        const answerStr = typeof event.answer === 'string' ? event.answer : JSON.stringify(event.answer);
        answerCounts[answerStr] = (answerCounts[answerStr] || 0) + 1;
      }

      // Sum duration
      if (event.duration) {
        totalDuration += event.duration;
      }

      // Count skips
      if (event.wasSkipped) {
        skipCount++;
      }
    });

    // Convert to array and sort
    const answers = Object.entries(answerCounts)
      .map(([value, count]) => ({
        value,
        count,
        percentage: Math.round((count / events.length) * 100 * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count);

    questionsAnalytics.push({
      step: stepNum,
      stepName: events[0]?.stepName || `Step ${stepNum}`,
      totalResponses: events.length,
      answers,
      averageTime: events.length > 0 ? Math.round(totalDuration / events.length) : 0,
      skipRate: events.length > 0 ? Math.round((skipCount / events.length) * 100 * 10) / 10 : 0,
    });
  });

  return questionsAnalytics.sort((a, b) => a.step - b.step);
}

// Helper function to calculate time analytics
function calculateTimeAnalytics(sessions: any[]) {
  const timeByStep: Record<number, number[]> = {};

  sessions.forEach((session) => {
    if (session.stepHistory) {
      try {
        const steps = JSON.parse(session.stepHistory);
        steps.forEach((event: any) => {
          if (!timeByStep[event.step]) {
            timeByStep[event.step] = [];
          }
          if (event.duration) {
            timeByStep[event.step].push(event.duration);
          }
        });
      } catch (e) {
        // Skip invalid JSON
      }
    }
  });

  const timeAnalytics = Object.entries(timeByStep)
    .map(([step, durations]) => {
      const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const sorted = [...durations].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];

      return {
        step: parseInt(step),
        averageTime: Math.round(avg),
        medianTime: Math.round(median),
        minTime: Math.round(Math.min(...durations)),
        maxTime: Math.round(Math.max(...durations)),
      };
    })
    .sort((a, b) => a.step - b.step);

  return timeAnalytics;
}

// Helper function to calculate drop-off points
function calculateDropOffPoints(funnel: any[]) {
  const dropOffs = [];

  for (let i = 0; i < funnel.length - 1; i++) {
    const current = funnel[i];
    const next = funnel[i + 1];

    const dropCount = current.count - next.count;
    const dropPercentage = current.count > 0 ? (dropCount / current.count) * 100 : 0;

    if (dropCount > 0) {
      dropOffs.push({
        fromStep: current.step,
        fromStepName: current.stepName,
        toStep: next.step,
        toStepName: next.stepName,
        dropCount,
        dropPercentage: Math.round(dropPercentage * 10) / 10,
      });
    }
  }

  // Sort by drop percentage
  return dropOffs.sort((a, b) => b.dropPercentage - a.dropPercentage);
}
