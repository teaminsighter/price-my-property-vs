/**
 * Phone number utility functions for NZ numbers
 */

/**
 * Format phone number as user types
 * Handles both +64 and 0 prefixes
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, '');

  // Handle +64 prefix
  if (cleaned.startsWith('+64')) {
    const digits = cleaned.slice(3); // Remove +64
    if (digits.length <= 2) return `+64 ${digits}`;
    if (digits.length <= 5) return `+64 ${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 8) return `+64 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    return `+64 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
  }

  // Handle 0 prefix (mobile and landline)
  if (cleaned.startsWith('0')) {
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  }

  // Handle no prefix (assume mobile)
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
  if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)}`;
}

/**
 * Remove formatting from phone number for validation/storage
 */
export function cleanPhoneNumber(value: string): string {
  return value.replace(/[\s\-()]/g, '');
}

/**
 * Validate NZ phone number
 */
export function isValidNZPhone(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone);
  const withPrefixRegex = /^(?:\+?64|0)[2-9]\d{7,9}$/;
  const withoutPrefixRegex = /^[2-9]\d{7,8}$/;
  return withPrefixRegex.test(cleaned) || withoutPrefixRegex.test(cleaned);
}
