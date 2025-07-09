import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { Separator } from '../ui/separator';

export default function Header() {
  return (
    <>
      <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <div className='mx-2 h-6 w-px bg-gray-300 dark:bg-gray-700' />
          <Breadcrumbs />
        </div>

        <div className='flex items-center gap-2 px-4'>
          <div className='hidden md:flex'>
            <SearchInput />
          </div>
          <UserNav />
          <ModeToggle />
        </div>
      </header>
      <div className='px-4'>
        <Separator />
      </div>
    </>
  );
}
