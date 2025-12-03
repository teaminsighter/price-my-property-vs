import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all visitor sessions with their page views
    const sessions = await prisma.visitorSession.findMany({
      where: {
        startedAt: { gte: startDate },
      },
      include: {
        pageViews_rel: {
          orderBy: { viewedAt: 'asc' },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    // Get all leads with their uniqueUserId
    const leads = await prisma.lead.findMany({
      where: {
        createdAt: { gte: startDate },
        uniqueUserId: { not: null },
      },
      select: {
        id: true,
        uniqueUserId: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        phoneVerified: true,
        source: true,
      },
    });

    // Create a map of visitorId -> lead
    const visitorToLead = new Map<string, typeof leads[0]>();
    leads.forEach(lead => {
      if (lead.uniqueUserId) {
        visitorToLead.set(lead.uniqueUserId, lead);
      }
    });

    // Build pivot data: visitor sessions with conversion status
    const pivotData = sessions.map(session => {
      const lead = visitorToLead.get(session.visitorId);
      const pages = session.pageViews_rel.map(pv => pv.path);

      return {
        sessionId: session.id,
        visitorId: session.visitorId,
        startedAt: session.startedAt,
        device: session.device,
        browser: session.browser,
        country: session.country,
        city: session.city,
        pageViews: session.pageViews,
        duration: session.duration,
        pagesVisited: pages,
        firstPage: pages[0] || '/',
        lastPage: pages[pages.length - 1] || '/',
        converted: !!lead,
        lead: lead ? {
          id: lead.id,
          name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.email,
          email: lead.email,
          phoneVerified: lead.phoneVerified,
          convertedAt: lead.createdAt,
        } : null,
      };
    });

    // Page conversion stats
    const pageStats = new Map<string, { visitors: Set<string>; conversions: Set<string> }>();

    sessions.forEach(session => {
      const lead = visitorToLead.get(session.visitorId);
      session.pageViews_rel.forEach(pv => {
        if (!pageStats.has(pv.path)) {
          pageStats.set(pv.path, { visitors: new Set(), conversions: new Set() });
        }
        const stat = pageStats.get(pv.path)!;
        stat.visitors.add(session.visitorId);
        if (lead) {
          stat.conversions.add(session.visitorId);
        }
      });
    });

    const pageConversionRates = Array.from(pageStats.entries())
      .map(([path, stat]) => ({
        path,
        visitors: stat.visitors.size,
        conversions: stat.conversions.size,
        conversionRate: stat.visitors.size > 0
          ? ((stat.conversions.size / stat.visitors.size) * 100).toFixed(1)
          : '0.0',
      }))
      .sort((a, b) => b.conversions - a.conversions);

    // Summary stats
    const totalVisitors = new Set(sessions.map(s => s.visitorId)).size;
    const totalConversions = leads.length;
    const overallConversionRate = totalVisitors > 0
      ? ((totalConversions / totalVisitors) * 100).toFixed(1)
      : '0.0';

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalVisitors,
          totalConversions,
          overallConversionRate,
          period: `Last ${days} days`,
        },
        pivotData,
        pageConversionRates,
      },
    });
  } catch (error) {
    console.error('Conversions analytics error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
