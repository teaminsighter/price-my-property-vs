'use server';
/**
 * Server-side Google Places API service
 * Calls Google Places API from the server to avoid client-side SDK loading
 */

import { z } from 'zod';

const AddressSuggestionSchema = z.array(z.object({
  description: z.string(),
  placeId: z.string(),
}));

export type AddressSuggestion = z.infer<typeof AddressSuggestionSchema>[number];
export type AddressSuggestions = z.infer<typeof AddressSuggestionSchema>;

const PlaceDetailsSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  formattedAddress: z.string(),
  city: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

export type PlaceDetails = z.infer<typeof PlaceDetailsSchema>;

/**
 * Search for NZ addresses using Google Places Autocomplete API
 */
export async function searchAddresses(query: string): Promise<AddressSuggestions> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set.');
    return [];
  }

  if (!query || query.length < 3) {
    return [];
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
  url.searchParams.append('input', query);
  url.searchParams.append('key', apiKey);
  url.searchParams.append('components', 'country:nz');
  url.searchParams.append('types', 'address');

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.error_message || data.status);
      return [];
    }

    if (data.predictions) {
      const suggestions = data.predictions.map((p: { description: string; place_id: string }) => ({
        description: p.description,
        placeId: p.place_id,
      }));

      const parsed = AddressSuggestionSchema.safeParse(suggestions);
      if (parsed.success) {
        return parsed.data;
      } else {
        console.error('Address suggestion validation error:', parsed.error);
        return [];
      }
    }

    return [];
  } catch (error) {
    console.error('Error calling Google Places API:', error);
    return [];
  }
}

/**
 * Get detailed information about a place using its place_id
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set.');
    return null;
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.append('place_id', placeId);
  url.searchParams.append('key', apiKey);
  url.searchParams.append('fields', 'geometry,formatted_address,address_components');

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' || !data.result) {
      console.error('Google Place Details API error:', data.error_message || data.status);
      return null;
    }

    const { result } = data;
    const addressComponents = result.address_components || [];

    const getComponent = (types: string[]) => {
      const component = addressComponents.find((c: { types: string[]; long_name: string }) =>
        types.some(type => c.types.includes(type))
      );
      return component?.long_name;
    };

    const details = {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
      suburb: getComponent(['sublocality', 'sublocality_level_1']),
      city: getComponent(['locality', 'postal_town']),
      state: getComponent(['administrative_area_level_1']),
      zipCode: getComponent(['postal_code']),
      country: getComponent(['country']),
    };

    const parsed = PlaceDetailsSchema.safeParse(details);
    if (parsed.success) {
      return parsed.data;
    } else {
      console.error('Place Details validation error:', parsed.error);
      return null;
    }
  } catch (error) {
    console.error('Error calling Google Place Details API:', error);
    return null;
  }
}
