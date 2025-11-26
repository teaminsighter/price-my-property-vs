/**
 * User Tracking Utility
 * Generates and manages unique visitor IDs and captures tracking cookies
 *
 * This enables:
 * - Cross-session user tracking
 * - Enhanced conversions for Google Ads
 * - Facebook Advanced Matching
 * - Better attribution in GA4
 */

// Storage keys
const VISITOR_ID_KEY = 'pmp_visitor_id';
const VISITOR_ID_TIMESTAMP_KEY = 'pmp_visitor_id_ts';

/**
 * Generate a unique visitor ID (UUID v4 format)
 */
function generateVisitorId(): string {
  // Use crypto API if available, fallback to Math.random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create a unique visitor ID
 * Stored in localStorage and persists across sessions
 */
export function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);

    if (!visitorId) {
      visitorId = generateVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
      localStorage.setItem(VISITOR_ID_TIMESTAMP_KEY, new Date().toISOString());

      if (process.env.NODE_ENV === 'development') {
        console.log('🆔 New visitor ID created:', visitorId);
      }
    }

    return visitorId;
  } catch {
    // localStorage not available
    return null;
  }
}

/**
 * Get visitor ID creation timestamp
 */
export function getVisitorIdTimestamp(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(VISITOR_ID_TIMESTAMP_KEY);
  } catch {
    return null;
  }
}

/**
 * Parse cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

/**
 * Get Google Analytics Client ID from _ga cookie
 * Format: GA1.1.XXXXXXXXXX.XXXXXXXXXX or GA1.2.XXXXXXXXXX.XXXXXXXXXX
 * We extract the last two parts (the actual client ID)
 */
export function getGAClientId(): string | null {
  if (typeof document === 'undefined') return null;

  try {
    const gaCookie = getCookie('_ga');

    if (gaCookie) {
      // Extract client ID from GA cookie (last two parts)
      const parts = gaCookie.split('.');
      if (parts.length >= 4) {
        return `${parts[2]}.${parts[3]}`;
      }
      // Some formats might be different
      if (parts.length >= 2) {
        return parts.slice(-2).join('.');
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get Facebook Browser ID from _fbp cookie
 * Format: fb.1.TIMESTAMP.RANDOM_NUMBER
 */
export function getFBP(): string | null {
  if (typeof document === 'undefined') return null;

  try {
    return getCookie('_fbp');
  } catch {
    return null;
  }
}

/**
 * Get Facebook Click ID from _fbc cookie
 * This is set when user clicks on Facebook ad with fbclid parameter
 * Format: fb.1.TIMESTAMP.FBCLID
 */
export function getFBC(): string | null {
  if (typeof document === 'undefined') return null;

  try {
    return getCookie('_fbc');
  } catch {
    return null;
  }
}

/**
 * Get all user tracking IDs
 */
export interface UserTrackingIds {
  visitorId: string | null;
  gaClientId: string | null;
  fbp: string | null;
  fbc: string | null;
  visitorIdTimestamp: string | null;
}

export function getAllUserTrackingIds(): UserTrackingIds {
  return {
    visitorId: getVisitorId(),
    gaClientId: getGAClientId(),
    fbp: getFBP(),
    fbc: getFBC(),
    visitorIdTimestamp: getVisitorIdTimestamp(),
  };
}

/**
 * Check if user is a returning visitor
 */
export function isReturningVisitor(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const timestamp = localStorage.getItem(VISITOR_ID_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const createdAt = new Date(timestamp);
    const now = new Date();

    // Consider returning if visitor ID was created more than 1 hour ago
    return (now.getTime() - createdAt.getTime()) > 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * Get visitor session count (basic implementation)
 */
export function getSessionCount(): number {
  if (typeof window === 'undefined') return 1;

  try {
    const key = 'pmp_session_count';
    const count = parseInt(sessionStorage.getItem(key) || '0', 10);

    // Increment on first call per session
    if (count === 0) {
      const totalKey = 'pmp_total_sessions';
      const total = parseInt(localStorage.getItem(totalKey) || '0', 10) + 1;
      localStorage.setItem(totalKey, total.toString());
      sessionStorage.setItem(key, '1'); // Mark this session as counted
      return total;
    }

    return parseInt(localStorage.getItem('pmp_total_sessions') || '1', 10);
  } catch {
    return 1;
  }
}

// Export all functions as a utility object
export const UserTracking = {
  getVisitorId,
  getVisitorIdTimestamp,
  getGAClientId,
  getFBP,
  getFBC,
  getAllUserTrackingIds,
  isReturningVisitor,
  getSessionCount,
};

export default UserTracking;
