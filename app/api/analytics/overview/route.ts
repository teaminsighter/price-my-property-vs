import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    } : {};

    // Get total leads
    const totalLeads = await prisma.lead.count({
      where: dateFilter,
    });

    // Get new leads (last 30 days comparison)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newLeads = await prisma.lead.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get leads by status
    const leadsByStatus = await prisma.lead.groupBy({
      by: ['status'],
      _count: true,
      where: dateFilter,
    });

    // Get total form sessions
    const totalSessions = await prisma.formAnalytics.count({
      where: dateFilter,
    });

    // Get completed forms
    const completedForms = await prisma.formAnalytics.count({
      where: {
        ...dateFilter,
        completed: true,
      },
    });

    // Get abandoned forms
    const abandonedForms = await prisma.formAnalytics.count({
      where: {
        ...dateFilter,
        abandoned: true,
      },
    });

    // Calculate conversion rate
    const conversionRate = totalSessions > 0
      ? ((completedForms / totalSessions) * 100).toFixed(2)
      : "0.00";

    // Get recent leads
    const recentLeads = await prisma.lead.findMany({
      where: dateFilter,
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        status: true,
        source: true,
        createdAt: true,
        propertyType: true,
        propertyValue: true,
      },
    });

    // Get lead sources
    const leadSources = await prisma.lead.groupBy({
      by: ['source'],
      _count: true,
      where: {
        ...dateFilter,
        source: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          source: 'desc',
        },
      },
      take: 5,
    });

    // Get daily lead trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Use Prisma's groupBy for database-agnostic query (works with both SQLite and MySQL)
    const dailyLeadsRaw = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group leads by date in JavaScript for cross-database compatibility
    const dailyLeadsMap = new Map<string, number>();
    dailyLeadsRaw.forEach(lead => {
      const dateStr = lead.createdAt.toISOString().split('T')[0];
      dailyLeadsMap.set(dateStr, (dailyLeadsMap.get(dateStr) || 0) + 1);
    });

    const dailyLeads = Array.from(dailyLeadsMap.entries()).map(([date, count]) => ({
      date,
      count: BigInt(count),
    }));

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalLeads,
          newLeads,
          totalSessions,
          completedForms,
          abandonedForms,
          conversionRate: parseFloat(conversionRate),
        },
        leadsByStatus: leadsByStatus.map(item => ({
          status: item.status,
          count: item._count,
        })),
        recentLeads,
        leadSources: leadSources.map(item => ({
          source: item.source || 'Direct',
          count: item._count,
        })),
        dailyTrend: dailyLeads.map(item => ({
          date: item.date,
          count: Number(item.count),
        })),
      },
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics overview",
        data: {
          overview: {
            totalLeads: 0,
            newLeads: 0,
            totalSessions: 0,
            completedForms: 0,
            abandonedForms: 0,
            conversionRate: 0,
          },
          leadsByStatus: [],
          recentLeads: [],
          leadSources: [],
          dailyTrend: [],
        }
      },
      { status: 200 } // Return 200 with empty data instead of error
    );
  }
}
