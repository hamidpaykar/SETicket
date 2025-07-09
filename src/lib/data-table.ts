import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant
} from '@/types/data-table';
import type { Column } from '@tanstack/react-table';

import { dataTableConfig } from '@/config/data-table';

/**
 * Generates CSS styles for pinned columns in a data table.
 * Handles left and right pinning with proper positioning, shadows, and visual indicators.
 * 
 * @template TData - The type of data in the table rows
 * @param options - Configuration options for pinning styles
 * @param options.column - The table column to generate styles for
 * @param options.withBorder - Whether to add border shadows for visual separation (default: false)
 * @returns CSS properties object for the pinned column
 * 
 * @example
 * ```tsx
 * // In a table cell component
 * const pinnedStyles = getCommonPinningStyles({
 *   column: column,
 *   withBorder: true
 * });
 * 
 * return (
 *   <td style={pinnedStyles}>
 *     {cell.getValue()}
 *   </td>
 * );
 * ```
 */
export function getCommonPinningStyles<TData>({
  column,
  withBorder = false
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px hsl(var(--border)) inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px hsl(var(--border)) inset'
          : undefined
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'hsl(var(--background))' : 'hsl(var(--background))',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0
  };
}

/**
 * Retrieves the available filter operators for a specific filter variant.
 * Returns an array of operator options based on the data type being filtered.
 * 
 * @param filterVariant - The type of filter (text, number, date, boolean, etc.)
 * @returns Array of filter operators with label and value properties
 * 
 * @example
 * ```tsx
 * // Get operators for text filtering
 * const textOperators = getFilterOperators('text');
 * // Returns: [{ label: 'Contains', value: 'iLike' }, { label: 'Equals', value: 'eq' }, ...]
 * 
 * // Get operators for number filtering
 * const numberOperators = getFilterOperators('number');
 * // Returns: [{ label: 'Equals', value: 'eq' }, { label: 'Greater than', value: 'gt' }, ...]
 * 
 * // Use in a filter dropdown
 * {getFilterOperators(column.filterVariant).map(op => (
 *   <option key={op.value} value={op.value}>{op.label}</option>
 * ))}
 * ```
 */
export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators
  };

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

/**
 * Gets the default filter operator for a specific filter variant.
 * Returns the most commonly used operator for each filter type.
 * 
 * @param filterVariant - The type of filter to get the default operator for
 * @returns The default filter operator value
 * 
 * @example
 * ```tsx
 * // Get default operator for text filtering
 * const defaultTextOp = getDefaultFilterOperator('text'); // Returns: 'iLike'
 * 
 * // Get default operator for number filtering  
 * const defaultNumberOp = getDefaultFilterOperator('number'); // Returns: 'eq'
 * 
 * // Use when initializing filter state
 * const [filterOperator, setFilterOperator] = useState(
 *   getDefaultFilterOperator(column.filterVariant)
 * );
 * ```
 */
export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant);

  return operators[0]?.value ?? (filterVariant === 'text' ? 'iLike' : 'eq');
}

/**
 * Filters an array of column filters to only include valid, non-empty filters.
 * Removes filters with empty values except for 'isEmpty' and 'isNotEmpty' operators.
 * 
 * @template TData - The type of data in the table rows
 * @param filters - Array of column filters to validate
 * @returns Array of valid filters with non-empty values
 * 
 * @example
 * ```tsx
 * const allFilters = [
 *   { id: 'name', value: 'John', operator: 'iLike' },
 *   { id: 'age', value: '', operator: 'eq' }, // Invalid - empty value
 *   { id: 'email', value: null, operator: 'isEmpty' }, // Valid - isEmpty operator
 *   { id: 'status', value: ['active'], operator: 'in' }
 * ];
 * 
 * const validFilters = getValidFilters(allFilters);
 * // Returns: [
 * //   { id: 'name', value: 'John', operator: 'iLike' },
 * //   { id: 'email', value: null, operator: 'isEmpty' },
 * //   { id: 'status', value: ['active'], operator: 'in' }
 * // ]
 * 
 * // Use before sending filters to API
 * const apiFilters = getValidFilters(currentFilters);
 * fetchData({ filters: apiFilters });
 * ```
 */
export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[]
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === 'isEmpty' ||
      filter.operator === 'isNotEmpty' ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== '' &&
          filter.value !== null &&
          filter.value !== undefined)
  );
}
