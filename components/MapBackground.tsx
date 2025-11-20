"use client";

import { useEffect, useRef, useState } from "react";

interface MapBackgroundProps {
  address: string;
}

export default function MapBackground({ address }: MapBackgroundProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Check if Google Maps is already loaded when component mounts
  useEffect(() => {
    if (window.google && !isMapReady) {
      setIsMapReady(true);
    }
  }, [isMapReady]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!mapRef.current || !window.google || mapInstanceRef.current) {
      return;
    }

    try {
      // Create map instance centered on New Zealand by default - SATELLITE VIEW
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: -36.8485, lng: 174.7633 }, // Auckland, NZ default
        zoom: 20,
        mapTypeId: "satellite", // Always show satellite view
        // Enable user interaction
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        gestureHandling: "greedy", // Allow dragging, zooming, etc.
      });

      setIsMapReady(true);
    } catch (error) {
      // Handle error silently
    }
  }, []);

  // Geocode and update map when address changes
  useEffect(() => {
    if (!address || !isMapReady || !mapInstanceRef.current || !window.google) {
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results && results[0] && mapInstanceRef.current) {
        const location = results[0].geometry.location;

        // Center map on the location
        mapInstanceRef.current.setCenter(location);
        mapInstanceRef.current.setZoom(20);

        // Remove old marker if exists
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Add new marker
        markerRef.current = new window.google.maps.Marker({
          position: location,
          map: mapInstanceRef.current,
          title: address,
        });
      }
    });
  }, [address, isMapReady]);

  return (
    <div className="fixed inset-0 w-full h-full z-0">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full bg-gray-200" />

      {/* Semi-transparent overlay to make text readable */}
      <div className="absolute inset-0 bg-white/30 pointer-events-none" />
    </div>
  );
}
