'use client';
import { navItems } from '@/constants/data';
import { NavItem } from '@/types';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch
} from 'kbar';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect, useRef } from 'react';
import RenderResults from './render-result';
import useThemeSwitching from './use-theme-switching';

export default function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // These action are for the navigation
  const actions = useMemo(() => {
    // Define navigateTo inside the useMemo callback to avoid dependency array issues
    const navigateTo = (url: string) => {
      router.push(url);
    };

    const flattenNavItems = (items: NavItem[], parentSection?: string, breadcrumbPath: string[] = []): any[] => {
      return items.flatMap((navItem) => {
        const currentSection = parentSection || 'Navigation';
        const currentBreadcrumb = [...breadcrumbPath, navItem.title];
        
        // Only include base action if the navItem has a real URL and is not just a container
        const baseAction =
          navItem.url !== '#'
            ? {
                id: `${navItem.title.toLowerCase()}Action`,
                name: navItem.title,
                shortcut: navItem.shortcut,
                keywords: navItem.title.toLowerCase(),
                section: currentSection,
                subtitle: breadcrumbPath.length > 0 ? currentBreadcrumb.join(' › ') : `Go to ${navItem.title}`,
                perform: () => navigateTo(navItem.url)
              }
            : null;

        // Process child items recursively
        const childActions = navItem.items && navItem.items.length > 0 
          ? flattenNavItems(navItem.items, navItem.title, currentBreadcrumb)
          : [];

        // Return only valid actions (ignoring null base actions for containers)
        return baseAction ? [baseAction, ...childActions] : childActions;
      });
    };

    return flattenNavItems(navItems);
  }, [router]);

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}
const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();
  
  const router = useRouter();
  const hasPrefetched = useRef(false);

  // Prefetch routes when user interacts with command palette
  const handlePrefetch = () => {
    if (!hasPrefetched.current) {
      hasPrefetched.current = true;
      
      // Only prefetch critical routes that users are likely to visit
      const criticalRoutes = [
        '/dashboard/procurement',
        '/dashboard/procurement/pending-approval',
        '/dashboard/procurement/in-progress',
        '/dashboard/procurement/approved',
        '/dashboard/analytics',
        '/dashboard/kanban'
      ];
      
      // Staggered prefetching to avoid overwhelming the network
      criticalRoutes.forEach((route, index) => {
        setTimeout(() => {
          router.prefetch(route);
        }, index * 50); // 50ms delay between each prefetch
      });
    }
  };

  return (
    <>
      <KBarPortal>
        <KBarPositioner className='bg-background/80 fixed inset-0 z-99999 p-0! backdrop-blur-sm'>
          <KBarAnimator className='bg-card text-foreground relative mt-64! w-full max-w-[600px] -translate-y-12! overflow-hidden rounded-2xl border shadow-lg'>
            <div className='bg-card border-border sticky top-0 z-10 border-b'>
              <KBarSearch 
                className='bg-card text-foreground w-full border-none px-6 py-4 text-lg outline-hidden focus:ring-0 focus:ring-offset-0 focus:outline-hidden' 
                onFocus={handlePrefetch}
              />
            </div>
            <div className='max-h-[400px]'>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
