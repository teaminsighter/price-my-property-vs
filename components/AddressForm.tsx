"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function AddressForm() {
  const router = useRouter();
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
      router.push(`/get-started?address=${encodeURIComponent(address)}`);
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
