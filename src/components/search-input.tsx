'use client';
import { useKBar } from 'kbar';
import { IconSearch } from '@tabler/icons-react';
import { Button } from './ui/button';

/**
 * SearchInput Component
 * 
 * A styled search button that triggers the global command palette (kbar) when clicked.
 * Displays a search icon, placeholder text, and keyboard shortcut indicator.
 * 
 * Features:
 * - Integrates with kbar for global search functionality
 * - Responsive design with different widths on various screen sizes
 * - Shows ⌘K keyboard shortcut hint on larger screens
 * - Styled as a button but functions as a search trigger
 * 
 * @returns JSX element containing the search input button
 * 
 * @example
 * ```tsx
 * // Basic usage in a header or navigation
 * <SearchInput />
 * 
 * // The component automatically integrates with kbar context
 * // When clicked, opens the command palette for searching
 * ```
 * 
 * @dependencies
 * - `kbar` - For command palette functionality
 * - `@tabler/icons-react` - For search icon
 * - Local Button component from ui library
 * 
 * @styling
 * - Responsive width: w-full → md:w-40 → lg:w-64
 * - Keyboard shortcut badge only visible on sm+ screens
 * - Uses muted colors for subtle appearance
 */
export default function SearchInput() {
  const { query } = useKBar();
  return (
    <div className='w-full space-y-2'>
      <Button
        variant='outline'
        className='bg-background text-muted-foreground relative h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-64'
        onClick={query.toggle}
      >
        <IconSearch className='mr-2 h-4 w-4' />
        Search...
        <kbd className='bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>
    </div>
  );
}
