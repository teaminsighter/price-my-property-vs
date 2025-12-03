'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// Get or create visitor ID
function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server';

  let visitorId = localStorage.getItem('pmp_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('pmp_visitor_id', visitorId);
  }
  return visitorId;
}

// Get session ID
function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('pmp_session_id');
}

// Set session ID
function setSessionId(id: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('pmp_session_id', id);
  }
}

// Get UTM params from URL
function getUtmParams(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
  };
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string>('');
  const pageStartTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      scrollDepthRef.current = Math.max(scrollDepthRef.current, scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track function
  const track = useCallback(async (action: string, data: Record<string, unknown> = {}) => {
    try {
      const visitorId = getVisitorId();
      const sessionId = getSessionId();

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          visitorId,
          sessionId,
          ...data,
        }),
      });

      const result = await response.json();

      // Save new session ID if returned
      if (result.sessionId) {
        setSessionId(result.sessionId);
      }

      return result;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      return { success: false };
    }
  }, []);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const existingSession = getSessionId();

      if (!existingSession) {
        const utmParams = getUtmParams();
        await track('session_start', {
          referrer: document.referrer || null,
          ...utmParams,
        });
      }
    };

    initSession();

    // Start heartbeat (every 30 seconds)
    heartbeatIntervalRef.current = setInterval(() => {
      if (getSessionId()) {
        track('heartbeat');
      }
    }, 30000);

    // Handle page unload
    const handleUnload = () => {
      const sessionId = getSessionId();
      if (sessionId && lastPathRef.current) {
        // Use sendBeacon for reliable delivery on page unload
        const data = JSON.stringify({
          action: 'page_exit',
          visitorId: getVisitorId(),
          sessionId,
          path: lastPathRef.current,
          duration: Math.round((Date.now() - pageStartTimeRef.current) / 1000),
          scrollDepth: scrollDepthRef.current,
        });
        navigator.sendBeacon('/api/analytics/track', data);
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [track]);

  // Track page views on navigation
  useEffect(() => {
    const sessionId = getSessionId();

    // Track page exit for previous page
    if (lastPathRef.current && sessionId) {
      const duration = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      track('page_exit', {
        path: lastPathRef.current,
        duration,
        scrollDepth: scrollDepthRef.current,
      });
    }

    // Reset for new page
    pageStartTimeRef.current = Date.now();
    scrollDepthRef.current = 0;
    lastPathRef.current = pathname;

    // Track new page view
    if (sessionId) {
      track('page_view', {
        path: pathname,
        title: document.title,
        referrer: document.referrer || null,
      });
    }
  }, [pathname, track]);

  return null; // This component doesn't render anything
}
