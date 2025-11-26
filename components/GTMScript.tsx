'use client';

import { useEffect, useState, useCallback } from 'react';

// Global variable to track currently loaded GTM container
let currentLoadedContainerId: string | null = null;

export function GTMScript() {
  const [containerId, setContainerId] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  const fetchGTMSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings/gtm', {
        cache: 'no-store' // Always get fresh settings
      });
      const data = await response.json();
      console.log('GTM Settings fetched:', data);

      if (data.enabled && data.containerId) {
        setContainerId(data.containerId);
        setIsEnabled(true);
      } else {
        setContainerId(null);
        setIsEnabled(false);
      }
    } catch (error) {
      console.error('Failed to fetch GTM settings:', error);
    }
  }, []);

  // Fetch GTM settings on mount
  useEffect(() => {
    fetchGTMSettings();

    // Listen for custom event to refresh GTM settings (triggered after admin changes)
    const handleGTMUpdate = () => {
      console.log('GTM settings update event received');
      fetchGTMSettings();
    };

    window.addEventListener('gtm-settings-updated', handleGTMUpdate);

    return () => {
      window.removeEventListener('gtm-settings-updated', handleGTMUpdate);
    };
  }, [fetchGTMSettings]);

  // Load GTM script when containerId is available
  useEffect(() => {
    // Initialize dataLayer if not exists
    window.dataLayer = window.dataLayer || [];

    // If disabled, don't load any script
    if (!isEnabled || !containerId) {
      console.log('GTM is disabled or no container ID');
      return;
    }

    // If already loaded with same container, skip
    if (currentLoadedContainerId === containerId) {
      console.log('GTM already loaded with container:', containerId);
      return;
    }

    // Remove existing GTM script if loading a different container
    if (currentLoadedContainerId && currentLoadedContainerId !== containerId) {
      console.log('Removing old GTM script for:', currentLoadedContainerId);
      const existingScripts = document.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]');
      existingScripts.forEach(script => script.remove());
      // Note: Full GTM cleanup would require page reload for complete reset
      // Push event to indicate container change
      window.dataLayer.push({
        event: 'gtm_container_change',
        old_container: currentLoadedContainerId,
        new_container: containerId
      });
    }

    console.log('Loading GTM with container:', containerId);

    // Push GTM start event
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    // Create and inject GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
    script.id = 'gtm-script';

    script.onload = () => {
      console.log('GTM script loaded successfully for:', containerId);
      currentLoadedContainerId = containerId;
    };

    script.onerror = () => {
      console.error('Failed to load GTM script for:', containerId);
    };

    // Insert at the beginning of head
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

  }, [containerId, isEnabled]);

  return null;
}

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function GTMNoScript({ containerId }: { containerId: string }) {
  if (!containerId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
