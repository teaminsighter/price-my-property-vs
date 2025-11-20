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

    // Fetch all form analytics sessions
    const sessions = await prisma.formAnalytics.findMany({
      where: dateFilter.gte ? { startedAt: dateFilter } : {},
      orderBy: { startedAt: 'desc' },
    });

    // Step definitions
    const stepDefinitions = [
      { step: 3, name: 'Property Type', type: 'select', options: ['Free Standing', 'Town House', 'Apartment', 'Land Only', 'Terraced', 'Semi Detached'] },
      { step: 4, name: 'House Size (SQM)', type: 'slider', min: 0, max: 500 },
      { step: 5, name: 'Land Size (SQM)', type: 'slider', min: 250, max: 3000 },
      { step: 6, name: 'House Age (Years)', type: 'slider', min: 0, max: 100 },
      { step: 7, name: 'Bedrooms', type: 'slider', min: 0, max: 6 },
      { step: 8, name: 'Bathrooms', type: 'slider', min: 0, max: 4 },
      { step: 9, name: 'CV Valuation', type: 'slider', min: 100000, max: 3000000 },
      { step: 10, name: 'Internal Garage', type: 'select', options: ['Yes', 'No'] },
      { step: 10.5, name: 'Garage Capacity', type: 'select', options: ['1', '2', '3+'] },
      { step: 11, name: 'House Condition', type: 'select', options: ['Needs Work', 'Liveable & Tidy', 'Recently Renovated'] },
      { step: 12, name: 'Relationship to Property', type: 'select', options: ['Owner', 'Estate', 'Buyer', 'Tenant', 'Not My Property', 'Real Estate Agent'] },
      { step: 13, name: 'Current Situation', type: 'select', options: ['Downsizing', 'Selling Investment', 'Need Larger Home', 'Thinking of Selling', 'Moving', 'Other'] },
      { step: 14, name: 'Clarification', type: 'select', options: ['Listing Soon', 'Want Appraisal', 'Have Bought Already', 'Find Out Worth', 'Refinancing'] },
      { step: 15, name: 'Extra Features', type: 'multi-select', options: ['Sea View', 'Heating', 'Lawn', 'Outdoor Area', 'Spa', 'Pool', 'Deck', 'Fireplace'] },
      { step: 17, name: 'Contact Details', type: 'form', fields: ['firstName', 'lastName', 'email', 'mobile'] },
    ];

    // Analyze each step
    const stepAnalysis = stepDefinitions.map(stepDef => {
      const stepData: any = {
        step: stepDef.step,
        stepName: stepDef.name,
        type: stepDef.type,
        totalResponses: 0,
        avgTimeSpent: 0,
        dropOffRate: 0,
        answers: [],
      };

      // Parse step history from sessions
      const stepEvents: any[] = [];
      sessions.forEach(session => {
        if (session.stepHistory) {
          try {
            const history = JSON.parse(session.stepHistory);
            const stepEvent = history.find((h: any) => h.step === stepDef.step);
            if (stepEvent) {
              stepEvents.push(stepEvent);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      });

      stepData.totalResponses = stepEvents.length;

      // Calculate average time spent
      const timesSpent = stepEvents.filter(e => e.duration).map(e => e.duration);
      if (timesSpent.length > 0) {
        stepData.avgTimeSpent = Math.round(timesSpent.reduce((sum, t) => sum + t, 0) / timesSpent.length);
      }

      // Calculate drop-off rate
      const usersReachedStep = sessions.filter(s => s.maxStepReached >= stepDef.step).length;
      const usersReachedNextStep = sessions.filter(s => s.maxStepReached > stepDef.step).length;
      if (usersReachedStep > 0) {
        stepData.dropOffRate = Math.round(((usersReachedStep - usersReachedNextStep) / usersReachedStep) * 100 * 10) / 10;
      }

      // Analyze answers based on type
      if (stepDef.type === 'select') {
        // Count each option
        const answerCounts: Record<string, number> = {};
        stepEvents.forEach(event => {
          if (event.answer) {
            const answer = String(event.answer);
            answerCounts[answer] = (answerCounts[answer] || 0) + 1;
          }
        });

        stepData.answers = Object.entries(answerCounts)
          .map(([value, count]) => ({
            value,
            count,
            percentage: stepEvents.length > 0 ? Math.round((count / stepEvents.length) * 100 * 10) / 10 : 0,
          }))
          .sort((a, b) => b.count - a.count);

        stepData.mostSelected = stepData.answers[0]?.value || 'N/A';
        stepData.mostSelectedCount = stepData.answers[0]?.count || 0;
        stepData.mostSelectedPercentage = stepData.answers[0]?.percentage || 0;

      } else if (stepDef.type === 'multi-select') {
        // Multi-select answers (arrays)
        const answerCounts: Record<string, number> = {};
        stepEvents.forEach(event => {
          if (event.answer && Array.isArray(event.answer)) {
            event.answer.forEach((item: string) => {
              answerCounts[item] = (answerCounts[item] || 0) + 1;
            });
          }
        });

        stepData.answers = Object.entries(answerCounts)
          .map(([value, count]) => ({
            value,
            count,
            percentage: stepEvents.length > 0 ? Math.round((count / stepEvents.length) * 100 * 10) / 10 : 0,
          }))
          .sort((a, b) => b.count - a.count);

        stepData.mostSelected = stepData.answers[0]?.value || 'N/A';
        stepData.mostSelectedCount = stepData.answers[0]?.count || 0;

      } else if (stepDef.type === 'slider') {
        // Numeric answers - calculate ranges and averages
        const values = stepEvents.filter(e => e.answer !== null && e.answer !== undefined).map(e => Number(e.answer));

        if (values.length > 0) {
          const min = Math.min(...values);
          const max = Math.max(...values);
          const avg = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
          const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];

          stepData.numericStats = {
            min,
            max,
            average: avg,
            median,
            total: values.length,
          };

          // Create ranges for visualization
          const rangeSize = (max - min) / 5;
          const ranges: Record<string, number> = {};

          values.forEach(val => {
            const rangeIndex = Math.min(Math.floor((val - min) / rangeSize), 4);
            const rangeStart = Math.round(min + (rangeIndex * rangeSize));
            const rangeEnd = Math.round(min + ((rangeIndex + 1) * rangeSize));
            const rangeKey = `${rangeStart}-${rangeEnd}`;
            ranges[rangeKey] = (ranges[rangeKey] || 0) + 1;
          });

          stepData.answers = Object.entries(ranges)
            .map(([range, count]) => ({
              value: range,
              count,
              percentage: Math.round((count / values.length) * 100 * 10) / 10,
            }))
            .sort((a, b) => b.count - a.count);

          stepData.mostSelected = `${avg} (average)`;
          stepData.mostSelectedCount = values.length;
        }
      }

      return stepData;
    });

    return NextResponse.json({
      success: true,
      data: stepAnalysis,
    });
  } catch (error) {
    console.error('Error fetching step analysis:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
