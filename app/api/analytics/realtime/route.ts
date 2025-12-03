import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Mark sessions as inactive if no ping in last 5 minutes
    await prisma.visitorSession.updateMany({
      where: {
        isActive: true,
        lastPing: { lt: fiveMinutesAgo },
      },
      data: {
        isActive: false,
        endedAt: now,
      },
    });

    // Get active visitors (pinged in last 5 minutes)
    const activeVisitors = await prisma.visitorSession.count({
      where: {
        isActive: true,
        lastPing: { gte: fiveMinutesAgo },
      },
    });

    // Get today's page views
    const todayPageViews = await prisma.pageView.count({
      where: {
        viewedAt: { gte: todayStart },
      },
    });

    // Get today's sessions
    const todaySessions = await prisma.visitorSession.count({
      where: {
        startedAt: { gte: todayStart },
      },
    });

    // Get bounce rate (sessions with only 1 page view)
    const bouncedSessions = await prisma.visitorSession.count({
      where: {
        startedAt: { gte: todayStart },
        pageViews: 1,
        isActive: false,
      },
    });
    const completedSessions = await prisma.visitorSession.count({
      where: {
        startedAt: { gte: todayStart },
        isActive: false,
      },
    });
    const bounceRate = completedSessions > 0 ? (bouncedSessions / completedSessions) * 100 : 0;

    // Get average session duration
    const avgDuration = await prisma.visitorSession.aggregate({
      where: {
        startedAt: { gte: todayStart },
        isActive: false,
        duration: { gt: 0 },
      },
      _avg: { duration: true },
    });

    // Get conversions (leads) today
    const todayConversions = await prisma.lead.count({
      where: {
        createdAt: { gte: todayStart },
      },
    });

    // Conversion rate
    const conversionRate = todaySessions > 0 ? (todayConversions / todaySessions) * 100 : 0;

    // Get last hour data for chart (5-minute intervals)
    const chartData = [];
    for (let i = 11; i >= 0; i--) {
      const intervalStart = new Date(now.getTime() - (i + 1) * 5 * 60 * 1000);
      const intervalEnd = new Date(now.getTime() - i * 5 * 60 * 1000);

      const [visitors, pageViews, conversions] = await Promise.all([
        prisma.visitorSession.count({
          where: {
            OR: [
              { startedAt: { gte: intervalStart, lt: intervalEnd } },
              { lastPing: { gte: intervalStart, lt: intervalEnd } },
            ],
          },
        }),
        prisma.pageView.count({
          where: {
            viewedAt: { gte: intervalStart, lt: intervalEnd },
          },
        }),
        prisma.lead.count({
          where: {
            createdAt: { gte: intervalStart, lt: intervalEnd },
          },
        }),
      ]);

      chartData.push({
        time: intervalEnd.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit', hour12: false }),
        visitors,
        pageViews,
        conversions,
      });
    }

    // Get device breakdown
    const deviceStats = await prisma.visitorSession.groupBy({
      by: ['device'],
      where: {
        startedAt: { gte: todayStart },
      },
      _count: true,
    });

    const deviceBreakdown = {
      desktop: deviceStats.find(d => d.device === 'desktop')?._count || 0,
      mobile: deviceStats.find(d => d.device === 'mobile')?._count || 0,
      tablet: deviceStats.find(d => d.device === 'tablet')?._count || 0,
    };
    const totalDevices = deviceBreakdown.desktop + deviceBreakdown.mobile + deviceBreakdown.tablet;

    // Get top pages today
    const topPages = await prisma.pageView.groupBy({
      by: ['path'],
      where: {
        viewedAt: { gte: todayStart },
      },
      _count: true,
      orderBy: { _count: { path: 'desc' } },
      take: 5,
    });

    // Get recent activity (last 10 page views)
    const recentActivity = await prisma.pageView.findMany({
      where: {
        viewedAt: { gte: oneHourAgo },
      },
      orderBy: { viewedAt: 'desc' },
      take: 10,
      include: {
        session: {
          select: {
            device: true,
            browser: true,
            country: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        activeVisitors,
        todayPageViews,
        bounceRate: bounceRate.toFixed(1),
        avgSessionDuration: Math.round(avgDuration._avg?.duration || 0),
        conversionRate: conversionRate.toFixed(1),
        todayConversions,
        chartData,
        deviceBreakdown: {
          desktop: { count: deviceBreakdown.desktop, percent: totalDevices > 0 ? ((deviceBreakdown.desktop / totalDevices) * 100).toFixed(1) : '0.0' },
          mobile: { count: deviceBreakdown.mobile, percent: totalDevices > 0 ? ((deviceBreakdown.mobile / totalDevices) * 100).toFixed(1) : '0.0' },
          tablet: { count: deviceBreakdown.tablet, percent: totalDevices > 0 ? ((deviceBreakdown.tablet / totalDevices) * 100).toFixed(1) : '0.0' },
        },
        topPages: topPages.map((p, i) => ({
          rank: i + 1,
          path: p.path,
          views: p._count,
          percent: todayPageViews > 0 ? ((p._count / todayPageViews) * 100).toFixed(1) : '0.0',
        })),
        recentActivity: recentActivity.map(a => ({
          id: a.id,
          path: a.path,
          title: a.title,
          time: a.viewedAt,
          device: a.session.device,
          browser: a.session.browser,
          location: a.session.city || a.session.country || 'Unknown',
        })),
        lastUpdated: now.toISOString(),
      },
    });
  } catch (error) {
    console.error('Real-time analytics error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
