/**
 * Formats a date value into a localized string representation.
 * Provides a safe wrapper around Intl.DateTimeFormat with error handling and customizable options.
 * 
 * @param date - The date to format (Date object, ISO string, timestamp, or undefined)
 * @param opts - Intl.DateTimeFormatOptions to customize the output format
 * @returns A formatted date string in en-US locale, or empty string if invalid/undefined
 * 
 * @example
 * ```tsx
 * // Basic usage with default format (long month, numeric day/year)
 * formatDate(new Date()) // "January 15, 2024"
 * formatDate("2024-01-15") // "January 15, 2024"
 * formatDate(1705123200000) // "January 15, 2024"
 * 
 * // Custom formatting options
 * formatDate(new Date(), { 
 *   month: 'short', 
 *   day: '2-digit' 
 * }) // "Jan 15, 2024"
 * 
 * formatDate(new Date(), {
 *   weekday: 'long',
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric'
 * }) // "Monday, January 15, 2024"
 * 
 * // Time formatting
 * formatDate(new Date(), {
 *   hour: '2-digit',
 *   minute: '2-digit',
 *   hour12: true
 * }) // "January 15, 2024 at 2:30 PM"
 * 
 * // Safe handling of invalid dates
 * formatDate(undefined) // ""
 * formatDate("invalid-date") // ""
 * formatDate(null) // ""
 * ```
 * 
 * @default
 * - month: 'long' (e.g., "January")
 * - day: 'numeric' (e.g., "15")
 * - year: 'numeric' (e.g., "2024")
 * - locale: 'en-US'
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts
    }).format(new Date(date));
  } catch (_err) {
    return '';
  }
}
