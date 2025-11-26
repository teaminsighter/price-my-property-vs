"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import GTM from "@/lib/gtm";

function AddressFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  const initAutocomplete = () => {
    if (!inputRef.current || autocompleteRef.current || !window.google) {
      return;
    }

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "nz" },
          fields: ["formatted_address", "address_components"],
          types: ["address"],
        }
      );

      // Listen for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address && inputRef.current) {
          inputRef.current.value = place.formatted_address;
        }
      });

      console.log("Google Maps Autocomplete initialized successfully");
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }
  };

  useEffect(() => {
    if (isGoogleMapsLoaded) {
      initAutocomplete();
    }
  }, [isGoogleMapsLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = inputRef.current?.value || "";
    if (address.trim()) {
      // Track CTA click in GTM
      GTM.trackCTAClick('Get Started Now', 'Hero Section', '/get-started');

      // Track custom event for address submission
      GTM.trackCustomEvent('address_submitted', {
        address_entered: true,
        form_location: 'hero_section'
      });

      // Build URL with address and preserve UTM parameters
      const params = new URLSearchParams();
      params.set('address', address);

      // Preserve UTM parameters from current URL
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
      utmParams.forEach(param => {
        const value = searchParams.get(param);
        if (value) {
          params.set(param, value);
        }
      });

      router.push(`/get-started?${params.toString()}`);
    }
  };

  return (
    <>
      {/* Load Google Maps Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => {
          console.log("Google Maps script loaded");
          setIsGoogleMapsLoaded(true);
        }}
        onError={(e) => {
          console.error("Failed to load Google Maps script:", e);
        }}
      />

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="ENTER YOUR ADDRESS"
          className="flex-1 px-6 py-4 text-gray-700 bg-white rounded-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 text-sm"
          autoComplete="off"
        />
        <motion.button
          type="submit"
          className="px-8 py-4 bg-primary hover:bg-secondary text-white font-semibold rounded-sm transition-colors whitespace-nowrap"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          GET STARTED NOW
        </motion.button>
      </motion.form>
    </>
  );
}

// Loading fallback for Suspense
function AddressFormFallback() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
      <input
        type="text"
        placeholder="ENTER YOUR ADDRESS"
        className="flex-1 px-6 py-4 text-gray-700 bg-white rounded-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 text-sm"
        disabled
      />
      <button
        type="button"
        className="px-8 py-4 bg-primary text-white font-semibold rounded-sm whitespace-nowrap opacity-75"
        disabled
      >
        GET STARTED NOW
      </button>
    </div>
  );
}

export default function AddressForm() {
  return (
    <Suspense fallback={<AddressFormFallback />}>
      <AddressFormContent />
    </Suspense>
  );
}
