import { createParser } from 'nuqs/server';
import { z } from 'zod';

import { dataTableConfig } from '@/config/data-table';

import type {
  ExtendedColumnFilter,
  ExtendedColumnSort
} from '@/types/data-table';

/**
 * Zod schema for validating sorting item structure.
 * Ensures each sort item has an id (column identifier) and desc (sort direction).
 */
const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean()
});

/**
 * Creates a URL state parser for table sorting configuration.
 * Handles serialization/deserialization of sorting state to/from URL parameters.
 * 
 * @template TData - The type of data in the table rows
 * @param columnIds - Array or Set of valid column IDs to restrict parsing to
 * @returns A nuqs parser for sorting state management
 * 
 * @example
 * ```tsx
 * // Basic usage in useDataTable hook
 * const columnIds = ['name', 'email', 'created_at'];
 * const sortingParser = getSortingStateParser<User>(columnIds);
 * 
 * const [sorting, setSorting] = useQueryState(
 *   'sort',
 *   sortingParser.withDefault([])
 * );
 * 
 * // URL: ?sort=[{"id":"name","desc":false}]
 * // Parsed: [{ id: 'name', desc: false }]
 * 
 * // Multiple sorts
 * // URL: ?sort=[{"id":"name","desc":false},{"id":"email","desc":true}]
 * // Parsed: [{ id: 'name', desc: false }, { id: 'email', desc: true }]
 * ```
 * 
 * @features
 * - **JSON Serialization**: Converts sorting arrays to URL-safe JSON strings
 * - **Validation**: Validates column IDs against allowed list
 * - **Type Safety**: Full TypeScript support with generics
 * - **Error Handling**: Returns null for invalid data, preventing crashes
 * 
 * @validation
 * - Validates JSON structure matches expected schema
 * - Ensures all column IDs exist in the provided allowlist
 * - Handles malformed JSON gracefully
 */
export const getSortingStateParser = <TData>(
  columnIds?: string[] | Set<string>
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc
      )
  });
};

/**
 * Zod schema for validating filter item structure.
 * Ensures each filter has proper id, value, variant, operator, and filterId.
 */
const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string()
});

/**
 * TypeScript type derived from the filter schema.
 * Represents a single filter item's structure.
 */
export type FilterItemSchema = z.infer<typeof filterItemSchema>;

/**
 * Creates a URL state parser for table filtering configuration.
 * Handles complex filter objects with multiple operators and data types.
 * 
 * @template TData - The type of data in the table rows
 * @param columnIds - Array or Set of valid column IDs to restrict parsing to
 * @returns A nuqs parser for filter state management
 * 
 * @example
 * ```tsx
 * // Basic usage in useDataTable hook
 * const columnIds = ['name', 'email', 'status', 'created_at'];
 * const filtersParser = getFiltersStateParser<User>(columnIds);
 * 
 * const [filters, setFilters] = useQueryState(
 *   'filters',
 *   filtersParser.withDefault([])
 * );
 * 
 * // Simple text filter
 * // URL: ?filters=[{"id":"name","value":"john","variant":"text","operator":"iLike","filterId":"name-1"}]
 * // Parsed: [{ id: 'name', value: 'john', variant: 'text', operator: 'iLike', filterId: 'name-1' }]
 * 
 * // Multiple filters with different operators
 * const complexFilters = [
 *   { id: 'name', value: 'john', variant: 'text', operator: 'iLike', filterId: 'name-1' },
 *   { id: 'status', value: ['active', 'pending'], variant: 'multiSelect', operator: 'in', filterId: 'status-1' },
 *   { id: 'created_at', value: '2024-01-01', variant: 'date', operator: 'gte', filterId: 'date-1' }
 * ];
 * ```
 * 
 * @features
 * - **Advanced Filtering**: Support for multiple filter types (text, select, date, etc.)
 * - **Multiple Operators**: iLike, equals, greater than, in, etc.
 * - **Array Values**: Support for multi-select filters
 * - **Validation**: Validates filter structure and column IDs
 * - **Type Safety**: Full TypeScript support with proper generics
 * 
 * @filterTypes
 * - **text**: String-based filtering with text operators
 * - **number**: Numeric filtering with comparison operators
 * - **date**: Date filtering with date-specific operators
 * - **select**: Single-value selection filtering
 * - **multiSelect**: Multi-value selection filtering
 * - **boolean**: Boolean filtering
 * 
 * @operators
 * - **Text**: iLike, eq, ne, startsWith, endsWith
 * - **Number**: eq, ne, gt, gte, lt, lte
 * - **Date**: eq, ne, gt, gte, lt, lte
 * - **Select**: eq, ne, in, notIn
 * - **Boolean**: eq, ne
 */
export const getFiltersStateParser = <TData>(
  columnIds?: string[] | Set<string>
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(filterItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnFilter<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id &&
          filter.value === b[index]?.value &&
          filter.variant === b[index]?.variant &&
          filter.operator === b[index]?.operator
      )
  });
};
