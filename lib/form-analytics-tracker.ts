// Form Analytics Tracker - Client-side tracking utility

export interface StepEvent {
  step: number;
  stepName: string;
  enteredAt: string;
  leftAt?: string;
  duration?: number;
  answer?: any;
  wasSkipped?: boolean;
  wentBack?: boolean;
}

export class FormAnalyticsTracker {
  private sessionId: string | null = null;
  private currentStepStart: number = 0;
  private isInitialized: boolean = false;

  // Step names mapping
  private stepNames: Record<number, string> = {
    3: 'Property Type',
    4: 'House Size',
    5: 'Land Size',
    6: 'House Age',
    7: 'Bedrooms',
    8: 'Bathrooms',
    9: 'CV Valuation',
    10: 'Garage',
    10.5: 'Garage Capacity',
    11: 'Condition',
    12: 'Relationship',
    13: 'Situation',
    14: 'Clarification',
    14.5: 'Recently Listed',
    15: 'Extra Features',
    17: 'Contact Details',
    18: 'Thank You',
  };

  // Initialize session
  async createSession() {
    if (this.isInitialized) return this.sessionId;

    try {
      // Detect device info
      const deviceType = this.getDeviceType();
      const browser = this.getBrowser();
      const os = this.getOS();
      const screenSize = `${window.screen.width}x${window.screen.height}`;

      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || undefined;
      const utmMedium = urlParams.get('utm_medium') || undefined;
      const utmCampaign = urlParams.get('utm_campaign') || undefined;
      const utmTerm = urlParams.get('utm_term') || undefined;
      const utmContent = urlParams.get('utm_content') || undefined;

      const response = await fetch('/api/analytics/form-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referrer: document.referrer || undefined,
          landingPage: window.location.href,
          deviceType,
          browser,
          os,
          screenSize,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        this.sessionId = result.sessionId;
        this.isInitialized = true;
        console.log('📊 Analytics session created:', this.sessionId);
      }

      return this.sessionId;
    } catch (error) {
      console.error('Failed to create analytics session:', error);
      return null;
    }
  }

  // Track step entry
  trackStepEnter(step: number) {
    this.currentStepStart = Date.now();
  }

  // Track step exit and save data
  async trackStepExit(step: number, answer: any, formData: any) {
    if (!this.sessionId) return;

    try {
      const duration = (Date.now() - this.currentStepStart) / 1000; // seconds

      await fetch('/api/analytics/form-session', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          step,
          stepName: this.stepNames[step] || `Step ${step}`,
          duration,
          answer,
          answers: formData, // Save complete form state
        }),
      });
    } catch (error) {
      console.error('Failed to track step exit:', error);
    }
  }

  // Mark session as completed
  async markCompleted(leadId: string) {
    if (!this.sessionId) return;

    try {
      await fetch('/api/analytics/form-session/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          leadId,
        }),
      });

      console.log('✅ Analytics session completed');
    } catch (error) {
      console.error('Failed to mark session as completed:', error);
    }
  }

  // Helper: Get device type
  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Helper: Get browser
  private getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    return 'Unknown';
  }

  // Helper: Get OS
  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'MacOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Unknown';
  }
}

// Export singleton instance
export const formTracker = new FormAnalyticsTracker();
