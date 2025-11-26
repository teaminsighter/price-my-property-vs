/**
 * GTM DataLayer Utility
 * Provides typed, consistent event tracking for Google Tag Manager
 *
 * Events pushed here will be available in GTM for:
 * - Google Analytics 4
 * - Google Ads Conversion Tracking
 * - Facebook Pixel
 * - Any other GTM-integrated platform
 */

import { UserTracking } from './user-tracking';

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

// Base event structure
interface DataLayerEvent {
  event?: string;
  [key: string]: unknown;
}

// UTM Parameters
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

// User tracking IDs for dataLayer
export interface UserTrackingData {
  user_id?: string | null;
  client_id?: string | null;
  visitor_id?: string | null;
}

// User data for enhanced conversions (hashed)
export interface UserData {
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

// Lead/Conversion data
export interface LeadData {
  lead_id?: string;
  property_type?: string;
  property_value?: string;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  suburb?: string;
  timeframe?: string;
  situation?: string;
}

// Form progress data
export interface FormProgressData {
  form_name: string;
  step_number: number;
  step_name: string;
  total_steps: number;
  time_on_step?: number;
  form_session_id?: string;
}

// Page view data
export interface PageViewData {
  page_title: string;
  page_path: string;
  page_location?: string;
  page_referrer?: string;
}

/**
 * Initialize dataLayer if not exists
 */
function ensureDataLayer(): void {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
}

/**
 * Get user tracking IDs for dataLayer
 */
function getUserTrackingData(): UserTrackingData {
  const visitorId = UserTracking.getVisitorId();
  const gaClientId = UserTracking.getGAClientId();

  return {
    user_id: visitorId, // Our unique visitor ID
    client_id: gaClientId, // GA Client ID if available
    visitor_id: visitorId, // Alias for clarity
  };
}

/**
 * Push event to dataLayer
 */
function pushToDataLayer(data: DataLayerEvent, includeUserIds: boolean = true): void {
  if (typeof window === 'undefined') return;

  ensureDataLayer();

  // Get user tracking IDs
  const userTracking = includeUserIds ? getUserTrackingData() : {};

  // Add timestamp and user IDs to all events
  const eventWithMetadata = {
    ...data,
    ...userTracking,
    event_timestamp: new Date().toISOString(),
  };

  window.dataLayer.push(eventWithMetadata);

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 DataLayer Push:', eventWithMetadata);
  }
}

/**
 * Get UTM parameters from URL
 */
export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined,
  };
}

/**
 * Get stored UTM params from sessionStorage (persists across pages)
 */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem('utm_params');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Store UTM params in sessionStorage
 */
export function storeUTMParams(params: UTMParams): void {
  if (typeof window === 'undefined') return;

  try {
    // Merge with existing params (don't overwrite with empty values)
    const existing = getStoredUTMParams();
    const merged = { ...existing };

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        merged[key as keyof UTMParams] = value;
      }
    });

    sessionStorage.setItem('utm_params', JSON.stringify(merged));
  } catch {
    // SessionStorage not available
  }
}

/**
 * Get all UTM params (from URL first, then storage)
 */
export function getAllUTMParams(): UTMParams {
  const urlParams = getUTMParams();
  const storedParams = getStoredUTMParams();

  // URL params take priority
  const merged = { ...storedParams };
  Object.entries(urlParams).forEach(([key, value]) => {
    if (value) {
      merged[key as keyof UTMParams] = value;
    }
  });

  // Store for future pages
  storeUTMParams(merged);

  return merged;
}

// ===========================================
// EVENT TRACKING FUNCTIONS
// ===========================================

/**
 * Track page view with UTM attribution
 */
export function trackPageView(data: PageViewData): void {
  const utmParams = getAllUTMParams();

  pushToDataLayer({
    event: 'page_view',
    page_title: data.page_title,
    page_path: data.page_path,
    page_location: data.page_location || (typeof window !== 'undefined' ? window.location.href : ''),
    page_referrer: data.page_referrer || (typeof document !== 'undefined' ? document.referrer : ''),
    ...utmParams,
  });
}

/**
 * Track form start (user begins filling form)
 */
export function trackFormStart(formName: string, sessionId?: string): void {
  const utmParams = getAllUTMParams();

  pushToDataLayer({
    event: 'form_start',
    form_name: formName,
    form_session_id: sessionId,
    ...utmParams,
  });
}

/**
 * Track form step progression
 */
export function trackFormProgress(data: FormProgressData): void {
  const utmParams = getAllUTMParams();

  pushToDataLayer({
    event: 'form_progress',
    form_name: data.form_name,
    step_number: data.step_number,
    step_name: data.step_name,
    total_steps: data.total_steps,
    step_progress_percent: Math.round((data.step_number / data.total_steps) * 100),
    time_on_step: data.time_on_step,
    form_session_id: data.form_session_id,
    ...utmParams,
  });
}

/**
 * Track form field interaction
 */
export function trackFormFieldInteraction(
  formName: string,
  fieldName: string,
  fieldValue?: string,
  stepNumber?: number
): void {
  pushToDataLayer({
    event: 'form_field_interaction',
    form_name: formName,
    field_name: fieldName,
    field_value: fieldValue,
    step_number: stepNumber,
  });
}

/**
 * Track form abandonment
 */
export function trackFormAbandonment(
  formName: string,
  lastStep: number,
  totalSteps: number,
  sessionId?: string
): void {
  const utmParams = getAllUTMParams();

  pushToDataLayer({
    event: 'form_abandonment',
    form_name: formName,
    last_step: lastStep,
    total_steps: totalSteps,
    abandonment_percent: Math.round((lastStep / totalSteps) * 100),
    form_session_id: sessionId,
    ...utmParams,
  });
}

/**
 * Track lead form submission (MAIN CONVERSION EVENT)
 * This is the primary conversion event for Google Ads and Facebook
 */
export function trackLeadSubmission(
  leadData: LeadData,
  userData: UserData,
  formSessionId?: string
): void {
  const utmParams = getAllUTMParams();

  // Main conversion event
  pushToDataLayer({
    event: 'generate_lead',
    // Lead details
    lead_id: leadData.lead_id,
    property_type: leadData.property_type,
    property_value: leadData.property_value,
    bedrooms: leadData.bedrooms,
    bathrooms: leadData.bathrooms,
    location: leadData.location,
    suburb: leadData.suburb,
    timeframe: leadData.timeframe,
    situation: leadData.situation,
    // Form session
    form_session_id: formSessionId,
    // UTM Attribution
    ...utmParams,
    // User data for enhanced conversions (should be hashed in GTM)
    user_data: {
      email: userData.email,
      phone_number: userData.phone_number,
      first_name: userData.first_name,
      last_name: userData.last_name,
      address: userData.address,
    },
  });

  // Also push Google Ads conversion event format
  pushToDataLayer({
    event: 'conversion',
    send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Will be configured in GTM
    value: leadData.property_value ? parseFloat(leadData.property_value.replace(/[^0-9.]/g, '')) : 0,
    currency: 'NZD',
    transaction_id: leadData.lead_id,
  });

  // Facebook standard event format
  pushToDataLayer({
    event: 'Lead',
    content_name: 'Property Valuation Request',
    content_category: leadData.property_type,
    value: leadData.property_value ? parseFloat(leadData.property_value.replace(/[^0-9.]/g, '')) : 0,
    currency: 'NZD',
  });
}

/**
 * Track form completion (successful submission)
 */
export function trackFormComplete(
  formName: string,
  totalSteps: number,
  totalTime: number,
  sessionId?: string
): void {
  const utmParams = getAllUTMParams();

  pushToDataLayer({
    event: 'form_complete',
    form_name: formName,
    total_steps: totalSteps,
    total_time_seconds: totalTime,
    form_session_id: sessionId,
    ...utmParams,
  });
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(
  ctaName: string,
  ctaLocation: string,
  destinationUrl?: string
): void {
  const utmParams = getAllUTMParams();

  pushToDataLayer({
    event: 'cta_click',
    cta_name: ctaName,
    cta_location: ctaLocation,
    destination_url: destinationUrl,
    ...utmParams,
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: number, pagePath: string): void {
  pushToDataLayer({
    event: 'scroll_depth',
    scroll_depth_percent: depth,
    page_path: pagePath,
  });
}

/**
 * Track outbound link clicks
 */
export function trackOutboundLink(url: string, linkText: string): void {
  pushToDataLayer({
    event: 'outbound_link',
    link_url: url,
    link_text: linkText,
  });
}

/**
 * Track video interactions
 */
export function trackVideoInteraction(
  action: 'play' | 'pause' | 'complete' | 'progress',
  videoTitle: string,
  videoPercent?: number
): void {
  pushToDataLayer({
    event: 'video_interaction',
    video_action: action,
    video_title: videoTitle,
    video_percent: videoPercent,
  });
}

/**
 * Track errors
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  errorLocation?: string
): void {
  pushToDataLayer({
    event: 'error',
    error_type: errorType,
    error_message: errorMessage,
    error_location: errorLocation,
  });
}

/**
 * Track custom events
 */
export function trackCustomEvent(
  eventName: string,
  eventData: Record<string, unknown>
): void {
  const utmParams = getAllUTMParams();

  pushToDataLayer({
    event: eventName,
    ...eventData,
    ...utmParams,
  });
}

/**
 * Set user properties (for GA4 user properties)
 */
export function setUserProperties(properties: Record<string, unknown>): void {
  pushToDataLayer({
    event: 'set_user_properties',
    user_properties: properties,
  });
}

/**
 * Initialize tracking on page load
 * Call this once on app mount
 */
export function initializeTracking(): void {
  if (typeof window === 'undefined') return;

  ensureDataLayer();

  // Capture and store UTM params
  const utmParams = getAllUTMParams();

  // Get user tracking info
  const isReturning = UserTracking.isReturningVisitor();
  const sessionCount = UserTracking.getSessionCount();

  // Push initial page context
  pushToDataLayer({
    event: 'tracking_initialized',
    ...utmParams,
    page_path: window.location.pathname,
    page_referrer: document.referrer,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    user_agent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // User session data
    is_returning_visitor: isReturning,
    session_count: sessionCount,
  });
}

/**
 * Get all user tracking IDs (for form submission)
 */
export function getAllUserTrackingIds() {
  return UserTracking.getAllUserTrackingIds();
}

// Export all functions
export const GTM = {
  // Initialization
  initializeTracking,
  ensureDataLayer,

  // UTM handling
  getUTMParams,
  getStoredUTMParams,
  storeUTMParams,
  getAllUTMParams,

  // User tracking
  getAllUserTrackingIds,

  // Page tracking
  trackPageView,
  trackScrollDepth,

  // Form tracking
  trackFormStart,
  trackFormProgress,
  trackFormFieldInteraction,
  trackFormAbandonment,
  trackFormComplete,
  trackLeadSubmission,

  // Interaction tracking
  trackCTAClick,
  trackOutboundLink,
  trackVideoInteraction,

  // Utility tracking
  trackError,
  trackCustomEvent,
  setUserProperties,

  // Direct push
  push: pushToDataLayer,
};

export default GTM;
