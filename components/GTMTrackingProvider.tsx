"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import GTM from "@/lib/gtm";

/**
 * GTM Tracking Provider Component
 * Initializes GTM tracking and tracks page views across the application
 *
 * Place this component in the root layout to enable tracking on all pages
 */
export default function GTMTrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize tracking on mount
  useEffect(() => {
    GTM.initializeTracking();
  }, []);

  // Track page views on route change
  useEffect(() => {
    // Get page title from document
    const pageTitle = typeof document !== 'undefined' ? document.title : '';

    // Track page view with UTM attribution
    GTM.trackPageView({
      page_title: pageTitle || getPageTitle(pathname),
      page_path: pathname,
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      page_referrer: typeof document !== 'undefined' ? document.referrer : '',
    });

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📄 Page View Tracked:', pathname);
    }
  }, [pathname, searchParams]);

  // Track scroll depth
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 90, 100];
    const trackedMilestones = new Set<number>();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        // Track milestone when crossed
        for (const milestone of scrollMilestones) {
          if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
            trackedMilestones.add(milestone);
            GTM.trackScrollDepth(milestone, pathname);
          }
        }
      }
    };

    // Throttle scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [pathname]);

  // Track outbound link clicks
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const currentHost = window.location.hostname;

          // Check if it's an outbound link
          if (url.hostname !== currentHost && url.hostname !== 'localhost') {
            GTM.trackOutboundLink(link.href, link.textContent || link.href);
          }
        } catch {
          // Invalid URL, ignore
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return <>{children}</>;
}

/**
 * Get a friendly page title based on pathname
 */
function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/': 'Home',
    '/get-started': 'Property Valuation Form',
    '/admin': 'Admin Dashboard',
    '/admin/login': 'Admin Login',
    '/admin/form-analytics': 'Form Analytics',
    '/admin/lead-scoring': 'Lead Scoring',
    '/admin/session-recordings': 'Session Recordings',
    '/admin/attribution': 'Attribution',
  };

  return titles[pathname] || pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';
}
