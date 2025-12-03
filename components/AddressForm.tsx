"use client";

import { useRef, useEffect, useState, Suspense, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import GTM from "@/lib/gtm";
import { searchAddresses, getPlaceDetails, type AddressSuggestion } from "@/lib/services/google-places";

interface SelectedAddress {
  description: string;
  placeId: string;
  zipCode?: string;
}

function AddressFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search for addresses
  const handleInputChange = useCallback(async (value: string) => {
    setInputValue(value);
    setSelectedAddress(null); // Clear selected address when typing
    setError(null); // Clear error when typing

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchAddresses(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  // Handle suggestion selection - get place details including zipcode
  const handleSuggestionClick = async (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    setIsLoadingDetails(true);

    try {
      const details = await getPlaceDetails(suggestion.placeId);

      if (details?.zipCode) {
        setSelectedAddress({
          description: suggestion.description,
          placeId: suggestion.placeId,
          zipCode: details.zipCode,
        });
        setError(null);
      } else {
        setSelectedAddress({
          description: suggestion.description,
          placeId: suggestion.placeId,
        });
        setError("Unable to retrieve postal code for this address. Please select a more specific address.");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      setError("Unable to verify address. Please try again.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that an address was selected from suggestions
    if (!selectedAddress) {
      setError("Please select an address from the suggestions.");
      return;
    }

    // Validate that zipcode was retrieved
    if (!selectedAddress.zipCode) {
      setError("Unable to retrieve postal code for this address. Please select a more specific address.");
      return;
    }

    const address = selectedAddress.description;

    // Track CTA click in GTM
    GTM.trackCTAClick('Get Started Now', 'Hero Section', '/get-started');

    // Track custom event for address submission
    GTM.trackCustomEvent('address_submitted', {
      address_entered: true,
      form_location: 'hero_section',
      has_zipcode: true,
      zipcode: selectedAddress.zipCode,
    });

    // Build URL with address, zipcode and preserve UTM parameters
    const params = new URLSearchParams();
    params.set('address', address);
    params.set('postal', selectedAddress.zipCode);

    // Preserve UTM parameters from current URL
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    utmParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });

    router.push(`/get-started?${params.toString()}`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-2xl relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1" ref={containerRef}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="ENTER YOUR ADDRESS"
            className={`w-full px-6 py-4 text-gray-700 bg-white rounded-sm focus:outline-none focus:ring-2 placeholder-gray-400 text-sm ${
              error ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary'
            }`}
            autoComplete="off"
          />

          {/* Loading indicator */}
          {(isLoading || isLoadingDetails) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Success checkmark when zipcode is retrieved */}
          {selectedAddress?.zipCode && !isLoadingDetails && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-sm shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.placeId || index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm border-b border-gray-100 last:border-b-0"
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isLoadingDetails || !selectedAddress?.zipCode}
          className={`px-8 py-4 font-semibold rounded-sm transition-colors whitespace-nowrap ${
            isLoadingDetails || !selectedAddress?.zipCode
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-primary hover:bg-secondary text-white cursor-pointer'
          }`}
          whileHover={selectedAddress?.zipCode && !isLoadingDetails ? { scale: 1.05 } : {}}
          whileTap={selectedAddress?.zipCode && !isLoadingDetails ? { scale: 0.95 } : {}}
        >
          {isLoadingDetails ? 'VERIFYING...' : 'GET STARTED NOW'}
        </motion.button>
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded"
        >
          {error}
        </motion.p>
      )}

      {/* Postal code display */}
      {selectedAddress?.zipCode && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-600 text-sm"
        >
          ✓ Postal Code: {selectedAddress.zipCode}
        </motion.p>
      )}
    </motion.form>
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
