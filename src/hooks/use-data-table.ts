'use client';

import {
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  type Parser,
  type UseQueryStateOptions,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates
} from 'nuqs';
import * as React from 'react';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { getSortingStateParser } from '@/lib/parsers';
import type { ExtendedColumnSort } from '@/types/data-table';

// Configuration constants for URL parameters and timing
const PAGE_KEY = 'page';
const PER_PAGE_KEY = 'perPage';
const SORT_KEY = 'sort';
const ARRAY_SEPARATOR = ',';
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

/**
 * Props for the useDataTable hook.
 * Extends TanStack Table options with additional features for URL state management,
 * debouncing, and advanced filtering capabilities.
 * 
 * @template TData - The type of data objects in the table rows
 */
interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  /** Initial table state configuration (pagination, sorting, etc.) */
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  /** Browser history mode for URL updates ('push' or 'replace') */
  history?: 'push' | 'replace';
  /** Debounce delay in milliseconds for filter updates (default: 300ms) */
  debounceMs?: number;
  /** Throttle delay in milliseconds for state updates (default: 50ms) */
  throttleMs?: number;
  /** Whether to clear URL params when they match default values */
  clearOnDefault?: boolean;
  /** Enable advanced filtering capabilities */
  enableAdvancedFilter?: boolean;
  /** Whether to scroll to top on URL changes */
  scroll?: boolean;
  /** Use shallow routing for URL updates */
  shallow?: boolean;
  /** React transition function for state updates */
  startTransition?: React.TransitionStartFunction;
}

/**
 * Advanced data table hook with URL state management and server-side operations.
 * 
 * This hook provides:
 * - URL-synchronized table state (pagination, sorting, filtering)
 * - Debounced filter updates for performance
 * - Server-side pagination, sorting, and filtering
 * - Row selection and column visibility management
 * - Advanced filtering with multiple operators
 * 
 * @template TData - The type of data objects in the table rows
 * @param props - Configuration options for the data table
 * @returns Object containing the configured table instance and metadata
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { table } = useDataTable({
 *   columns: productColumns,
 *   data: products,
 *   pageCount: totalPages,
 *   initialState: {
 *     pagination: { pageSize: 20 }
 *   }
 * });
 * 
 * // With advanced filtering
 * const { table } = useDataTable({
 *   columns: userColumns,
 *   data: users,
 *   pageCount: userPageCount,
 *   enableAdvancedFilter: true,
 *   debounceMs: 500,
 *   history: 'push'
 * });
 * 
 * // Access table state
 * const currentPage = table.getState().pagination.pageIndex + 1;
 * const selectedRows = table.getFilteredSelectedRowModel().rows;
 * ```
 * 
 * @features
 * - **URL State Sync**: All table state is synchronized with URL parameters
 * - **Server-Side Operations**: Designed for server-side pagination/filtering
 * - **Performance Optimized**: Debounced updates prevent excessive API calls
 * - **Flexible Filtering**: Support for various filter types and operators
 * - **Row Management**: Built-in row selection and column visibility
 * 
 * @see https://tanstack.com/table/latest/docs/adapters/react-table
 * @see https://nuqs.47ng.com/ - For URL state management
 */
export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    history = 'replace',
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    enableAdvancedFilter = false,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props;

  // Configure URL state options for consistent behavior
  const queryStateOptions = React.useMemo<
    Omit<UseQueryStateOptions<string>, 'parse'>
> (
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition
    ]
  );

  // Local state for non-URL-synced table features
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  // URL-synced pagination state
  const [page, setPage] = useQueryState(
    PAGE_KEY,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1)
  );
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 10)
  );

  // Convert 1-based page to 0-based pagination state
  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage
    };
  }, [page, perPage]);

  // Handle pagination changes and sync with URL
  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination);
        void setPage(newPagination.pageIndex + 1);
        void setPerPage(newPagination.pageSize);
      } else {
        void setPage(updaterOrValue.pageIndex + 1);
        void setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage]
  );

  // Extract column IDs for sorting state parser
  const columnIds = React.useMemo(() => {
    return new Set(
      columns.map((column) => column.id).filter(Boolean) as string[]
    );
  }, [columns]);

  // URL-synced sorting state
  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    getSortingStateParser<TData>(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? [])
  );

  // Handle sorting changes and sync with URL
  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
      }
    },
    [sorting, setSorting]
  );

  // Determine which columns support filtering
  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    return columns.filter((column) => column.enableColumnFilter);
  }, [columns, enableAdvancedFilter]);

  // Create parsers for filterable columns
  const filterParsers = React.useMemo(() => {
    if (enableAdvancedFilter) return {};

    return filterableColumns.reduce<
      Record<string, Parser<string> | Parser<string[]>>
    >((acc, column) => {
      if (column.meta?.options) {
        acc[column.id ?? ''] = parseAsArrayOf(
          parseAsString,
          ARRAY_SEPARATOR
        ).withOptions(queryStateOptions);
      } else {
        acc[column.id ?? ''] = parseAsString.withOptions(queryStateOptions);
      }
      return acc;
    }, {});
  }, [filterableColumns, queryStateOptions, enableAdvancedFilter]);

  // URL-synced filter state
  const [filterValues, setFilterValues] = useQueryStates(filterParsers);

  // Debounced filter updates to prevent excessive API calls
  const debouncedSetFilterValues = useDebouncedCallback(
    (values: typeof filterValues) => {
      void setPage(1);
      void setFilterValues(values);
    },
    debounceMs
  );

  // Convert URL filter values to TanStack Table format
  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    return Object.entries(filterValues).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        if (value !== null) {
          const processedValue = Array.isArray(value)
            ? value
            : typeof value === 'string' && /[^a-zA-Z0-9]/.test(value)
              ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
              : [value];

          filters.push({
            id: key,
            value: processedValue
          });
        }
        return filters;
      },
      []
    );
  }, [filterValues, enableAdvancedFilter]);

  // Local filter state for immediate UI updates
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  // Handle filter changes with debouncing
  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return;

      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(prev)
            : updaterOrValue;

        const filterUpdates = next.reduce<
          Record<string, string | string[] | null>
        >((acc, filter) => {
          if (filterableColumns.find((column) => column.id === filter.id)) {
            acc[filter.id] = filter.value as string | string[];
          }
          return acc;
        }, {});

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        }

        debouncedSetFilterValues(filterUpdates);
        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns, enableAdvancedFilter]
  );

  // Create the TanStack Table instance with all configurations
  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  return { table, shallow, debounceMs, throttleMs };
}