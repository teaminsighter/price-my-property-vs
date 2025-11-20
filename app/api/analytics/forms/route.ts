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

    // Calculate metrics
    const totalSessions = sessions.length;
    const completed = sessions.filter((s) => s.completed).length;
    const totalViews = totalSessions; // Each session is a view
    const completionRate = totalSessions > 0 ? ((completed / totalSessions) * 100).toFixed(1) : '0.0';

    const completedSessions = sessions.filter((s) => s.completed && s.totalDuration);
    const avgCompletionTime =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) / completedSessions.length
        : 0;

    const minutes = Math.floor(avgCompletionTime / 60);
    const seconds = Math.round(avgCompletionTime % 60);
    const avgTimeFormatted = `${minutes}m ${seconds}s`;

    // Generate submissions trend data (by day)
    const days = startDate && endDate
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 30;

    const submissions = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      if (startDate) {
        date.setTime(new Date(startDate).getTime() + i * 24 * 60 * 60 * 1000);
      } else {
        date.setDate(date.getDate() - (days - i - 1));
      }

      const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const daySessions = sessions.filter(
        (s) => new Date(s.startedAt) >= dayStart && new Date(s.startedAt) <= dayEnd
      );
      const dayCompletions = daySessions.filter((s) => s.completed).length;

      return {
        date: dayStr,
        submissions: daySessions.length,
        completions: dayCompletions,
        views: daySessions.length,
      };
    });

    // Calculate detailed funnel data based on actual form steps
    const stepCounts = [
      { name: 'Page Views', value: totalSessions, color: '#f87416' },
      { name: 'Property Type (Step 3)', value: sessions.filter((s) => s.maxStepReached >= 3).length, color: '#3b82f6' },
      { name: 'House Details (Step 4-6)', value: sessions.filter((s) => s.maxStepReached >= 6).length, color: '#60A5FA' },
      { name: 'Rooms (Step 7-8)', value: sessions.filter((s) => s.maxStepReached >= 8).length, color: '#93C5FD' },
      { name: 'Valuation (Step 9)', value: sessions.filter((s) => s.maxStepReached >= 9).length, color: '#10b981' },
      { name: 'Features (Step 10-11)', value: sessions.filter((s) => s.maxStepReached >= 11).length, color: '#34D399' },
      { name: 'Relationship (Step 12)', value: sessions.filter((s) => s.maxStepReached >= 12).length, color: '#F59E0B' },
      { name: 'Situation (Step 13-14)', value: sessions.filter((s) => s.maxStepReached >= 13).length, color: '#FBBF24' },
      { name: 'Extra Features (Step 15)', value: sessions.filter((s) => s.maxStepReached >= 15).length, color: '#8b5cf6' },
      { name: 'Contact Details (Step 17)', value: sessions.filter((s) => s.maxStepReached >= 17).length, color: '#A78BFA' },
      { name: 'Form Submitted', value: completed, color: '#ef4444' },
    ];

    // Form performance data
    const forms = [
      {
        id: 'property-valuation',
        name: 'Property Valuation Form',
        type: 'Lead Generation',
        submissions: completed,
        views: totalSessions,
        completionRate: completionRate + '%',
        avgTime: avgTimeFormatted,
        status: 'active',
        lastSubmission: completed > 0 && sessions[0] ? new Date(sessions[0].startedAt).toLocaleDateString() : 'Never',
      },
    ];

    // Recent submissions (last 5)
    const recentSubmissions = sessions
      .filter((s) => s.completed)
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        formName: 'Property Valuation',
        submittedAt: new Date(s.startedAt).toLocaleDateString(),
        completionTime: s.totalDuration ? `${Math.floor(s.totalDuration / 60)}m ${s.totalDuration % 60}s` : 'N/A',
        status: 'completed',
        source: s.utmSource || 'Direct',
        leadScore: 0, // Could calculate based on completeness
      }));

    return NextResponse.json({
      success: true,
      data: {
        submissions,
        funnel: stepCounts,
        forms,
        metrics: {
          totalSubmissions: completed,
          totalViews,
          completionRate,
          avgCompletionTime: avgTimeFormatted,
        },
        recentSubmissions,
      },
    });
  } catch (error) {
    console.error('Error fetching form analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
