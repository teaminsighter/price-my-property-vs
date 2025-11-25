'use client';

import { useEffect, useState } from 'react';

export function GTMScript() {
  const [containerId, setContainerId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fetch GTM settings on mount
    async function fetchGTMSettings() {
      try {
        const response = await fetch('/api/settings/gtm');
        const data = await response.json();
        console.log('GTM Settings fetched:', data);
        if (data.enabled && data.containerId) {
          setContainerId(data.containerId);
        }
      } catch (error) {
        console.error('Failed to fetch GTM settings:', error);
      }
    }

    fetchGTMSettings();
  }, []);

  // Load GTM script when containerId is available
  useEffect(() => {
    if (!containerId || isLoaded) return;

    console.log('Loading GTM with container:', containerId);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    // Create and inject GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;

    script.onload = () => {
      console.log('GTM script loaded successfully');
    };

    script.onerror = () => {
      console.error('Failed to load GTM script');
    };

    // Insert at the beginning of head
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    setIsLoaded(true);
  }, [containerId, isLoaded]);

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
