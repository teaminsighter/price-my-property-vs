import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

// Parse user agent to get device type
function getDeviceType(userAgent: string): string {
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

// Parse browser from user agent
function getBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('SamsungBrowser')) return 'Samsung Browser';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  return 'Other';
}

// Parse OS from user agent
function getOS(userAgent: string): string {
  if (userAgent.includes('Windows NT 10')) return 'Windows 10';
  if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
  if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac OS X')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Other';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, visitorId, sessionId, path, title, referrer, scrollDepth, duration, utmSource, utmMedium, utmCampaign } = body;

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
               headersList.get('x-real-ip') ||
               'unknown';

    // Handle different tracking actions
    switch (action) {
      case 'session_start': {
        // Create a new visitor session
        const session = await prisma.visitorSession.create({
          data: {
            visitorId: visitorId || 'anonymous',
            userAgent,
            device: getDeviceType(userAgent),
            browser: getBrowser(userAgent),
            os: getOS(userAgent),
            ipAddress: ip,
            referrer: referrer || null,
            utmSource: utmSource || null,
            utmMedium: utmMedium || null,
            utmCampaign: utmCampaign || null,
            isActive: true,
            lastPing: new Date(),
          },
        });

        return NextResponse.json({ success: true, sessionId: session.id });
      }

      case 'page_view': {
        if (!sessionId) {
          return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
        }

        // Create page view and update session
        const [pageView] = await Promise.all([
          prisma.pageView.create({
            data: {
              sessionId,
              visitorId: visitorId || 'anonymous',
              path: path || '/',
              title: title || null,
              referrer: referrer || null,
            },
          }),
          prisma.visitorSession.update({
            where: { id: sessionId },
            data: {
              pageViews: { increment: 1 },
              lastPing: new Date(),
            },
          }),
        ]);

        return NextResponse.json({ success: true, pageViewId: pageView.id });
      }

      case 'page_exit': {
        if (!sessionId || !path) {
          return NextResponse.json({ success: false, error: 'Session ID and path required' }, { status: 400 });
        }

        // Update the last page view with duration and scroll depth
        const lastPageView = await prisma.pageView.findFirst({
          where: { sessionId, path },
          orderBy: { viewedAt: 'desc' },
        });

        if (lastPageView) {
          await prisma.pageView.update({
            where: { id: lastPageView.id },
            data: {
              duration: duration || null,
              scrollDepth: scrollDepth || null,
            },
          });
        }

        return NextResponse.json({ success: true });
      }

      case 'heartbeat': {
        if (!sessionId) {
          return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
        }

        // Update last ping and duration
        await prisma.visitorSession.update({
          where: { id: sessionId },
          data: {
            lastPing: new Date(),
            duration: { increment: 30 }, // Heartbeat every 30 seconds
          },
        });

        return NextResponse.json({ success: true });
      }

      case 'session_end': {
        if (!sessionId) {
          return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
        }

        await prisma.visitorSession.update({
          where: { id: sessionId },
          data: {
            isActive: false,
            endedAt: new Date(),
          },
        });

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
