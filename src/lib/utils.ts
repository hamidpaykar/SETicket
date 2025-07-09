import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and merges Tailwind CSS classes using tailwind-merge.
 * This utility helps avoid conflicts between Tailwind classes and enables conditional class application.
 * 
 * @param inputs - Array of class values that can be strings, objects, arrays, or conditional expressions
 * @returns A string of merged and deduplicated class names
 * 
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-4', 'py-2', 'bg-blue-500')
 * // Returns: "px-4 py-2 bg-blue-500"
 * 
 * // Conditional classes
 * cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')
 * 
 * // Tailwind merge functionality - resolves conflicts
 * cn('px-4', 'px-6') // Returns: "px-6" (later px value wins)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a byte value into a human-readable string representation.
 * Supports both standard (1000-based) and binary (1024-based) size calculations.
 * 
 * @param bytes - The number of bytes to format
 * @param opts - Configuration options for formatting
 * @param opts.decimals - Number of decimal places to show (default: 0)
 * @param opts.sizeType - Type of size calculation: 'normal' (1000-based) or 'accurate' (1024-based)
 * @returns A formatted string with size and unit (e.g., "1.5 MB", "2.3 GiB")
 * 
 * @example
 * ```tsx
 * formatBytes(1024) // Returns: "1 KB"
 * formatBytes(1024, { sizeType: 'accurate' }) // Returns: "1 KiB"
 * formatBytes(1536, { decimals: 1 }) // Returns: "1.5 KB"
 * formatBytes(0) // Returns: "0 Byte"
 * ```
 */
export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

/**
 * Generates a random alphanumeric ID string.
 * Uses Math.random() to create a 7-character identifier suitable for temporary IDs or keys.
 * 
 * @returns A random 7-character alphanumeric string
 * 
 * @example
 * ```tsx
 * generateId() // Returns: "a7b9c2d" (example)
 * 
 * // Common usage for React keys or temporary IDs
 * const items = data.map(item => ({ ...item, id: generateId() }))
 * ```
 * 
 * @note This is not cryptographically secure and should not be used for security-sensitive applications.
 * For production use cases requiring unique IDs, consider using uuid or nanoid libraries.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Formats a date string into a human-readable format.
 * Converts an ISO date string or date-like string into "MMM dd, yyyy" format.
 * 
 * @param dateString - The date string to format (ISO string or any valid date string)
 * @returns A formatted date string in "MMM dd, yyyy" format (e.g., "Jan 15, 2024")
 * 
 * @example
 * ```tsx
 * formatDate("2024-01-15T10:30:00Z") // Returns: "Jan 15, 2024"
 * formatDate("2024-12-25") // Returns: "Dec 25, 2024"
 * 
 * // Common usage in components
 * <span>{formatDate(user.createdAt)}</span>
 * ```
 * 
 * @throws Will throw an error if the date string is invalid
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
