'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { navItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useUser } from '@clerk/nextjs';
import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconUserCircle,
  IconSettings,
  IconFileText,
  IconBarChart3,
  IconUsers,
  IconShoppingCart,
  IconPackage,
  IconTruck,
  IconClock,
  IconCheckCircle,
  IconXCircle,
  IconAlertCircle
} from '@tabler/icons-react';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

// Secondary navigation data based on the current route
const getSecondaryNavItems = (pathname: string) => {
  if (pathname.startsWith('/dashboard/procurement')) {
    return [
      {
        title: 'Overview',
        url: '/dashboard/procurement',
        icon: IconBarChart3,
        description: 'Procurement dashboard'
      },
      {
        title: 'New Request',
        url: '/dashboard/procurement/new',
        icon: IconShoppingCart,
        description: 'Create new procurement'
      },
      {
        title: 'Active Requests',
        url: '/dashboard/procurement/active',
        icon: IconClock,
        description: 'In-progress requests',
        badge: '3'
      },
      {
        title: 'Approved',
        url: '/dashboard/procurement/approved',
        icon: IconCheckCircle,
        description: 'Approved requests',
        badge: '12'
      },
      {
        title: 'Rejected',
        url: '/dashboard/procurement/rejected',
        icon: IconXCircle,
        description: 'Rejected requests'
      },
      {
        title: 'Suppliers',
        url: '/dashboard/procurement/suppliers',
        icon: IconUsers,
        description: 'Manage suppliers'
      },
      {
        title: 'Reports',
        url: '/dashboard/procurement/reports',
        icon: IconFileText,
        description: 'Procurement reports'
      }
    ];
  }

  if (pathname.startsWith('/dashboard/product')) {
    return [
      {
        title: 'All Products',
        url: '/dashboard/product',
        icon: IconPackage,
        description: 'Product catalog'
      },
      {
        title: 'Categories',
        url: '/dashboard/product/categories',
        icon: IconFileText,
        description: 'Product categories'
      },
      {
        title: 'Inventory',
        url: '/dashboard/product/inventory',
        icon: IconTruck,
        description: 'Stock management',
        badge: 'Low'
      },
      {
        title: 'Settings',
        url: '/dashboard/product/settings',
        icon: IconSettings,
        description: 'Product settings'
      }
    ];
  }

  if (pathname.startsWith('/dashboard/overview') || pathname.startsWith('/dashboard/main')) {
    return [
      {
        title: 'Key Metrics',
        url: '/dashboard/main',
        icon: IconBarChart3,
        description: 'Dashboard overview'
      },
      {
        title: 'Analytics',
        url: '/dashboard/overview',
        icon: IconBarChart3,
        description: 'Detailed analytics'
      },
      {
        title: 'Recent Activity',
        url: '/dashboard/activity',
        icon: IconClock,
        description: 'Latest activities'
      },
      {
        title: 'Notifications',
        url: '/dashboard/notifications',
        icon: IconBell,
        description: 'System alerts',
        badge: '2'
      }
    ];
  }

  return [];
};

function MainSidebar() {
  const { state } = useSidebar();
  const [isMounted, setIsMounted] = React.useState(false);
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { user } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Sidebar collapsible="icon" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] data-[state=expanded]:!w-[calc(var(--sidebar-width)_+_1px)]">
      <SidebarHeader>
        <div className='flex h-12 items-center justify-center py-1'>
          {state === 'collapsed' && isMounted ? (
            <Image
              src='/favicon.png'
              alt='Siemens Energy'
              width={32}
              height={32}
              className='h-10 w-10'
              priority
            />
          ) : (
            <Image
              src='/images/siemens-energy-logo.png'
              alt='Siemens Energy'
              width={130}
              height={36}
              className='h-9 w-auto'
              priority
            />
          )}
        </div>
      </SidebarHeader>
      <Separator className="my-2" />
      <SidebarContent className='mt-2 overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const subItemHasChildren = subItem.items && subItem.items.length > 0;
                          return subItemHasChildren ? (
                            <Collapsible key={subItem.title} asChild>
                              <SidebarMenuSubItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton>
                                    <span>{subItem.title}</span>
                                    <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub>
                                    {subItem.items?.map((grandChild) => (
                                      <SidebarMenuSubItem key={grandChild.title}>
                                        <SidebarMenuSubButton asChild isActive={pathname === grandChild.url}>
                                          <Link href={grandChild.url}>
                                            <span>{grandChild.title}</span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuSubItem>
                            </Collapsible>
                          ) : (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  {user && (
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                      user={user}
                    />
                  )}
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    {user && (
                      <UserAvatarProfile
                        className='h-8 w-8 rounded-lg'
                        showInfo
                        user={user}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCreditCard className='mr-2 h-4 w-4' />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconBell className='mr-2 h-4 w-4' />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconLogout className='mr-2 h-4 w-4' />
                  <SignOutButton redirectUrl='/auth/sign-in' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function SecondarySidebar() {
  const pathname = usePathname();
  const secondaryNavItems = getSecondaryNavItems(pathname);

  if (secondaryNavItems.length === 0) {
    return null;
  }

  return (
    <Sidebar
      collapsible="none"
      className="!w-[--sidebar-width] border-r-0 bg-sidebar/50 backdrop-blur-sm"
    >
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-sidebar-foreground">
            {pathname.startsWith('/dashboard/procurement') && 'Procurement'}
            {pathname.startsWith('/dashboard/product') && 'Products'}
            {(pathname.startsWith('/dashboard/overview') || pathname.startsWith('/dashboard/main')) && 'Dashboard'}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup className="px-0">
          <SidebarMenu className="gap-1">
            {secondaryNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="px-4 py-3"
                >
                  <Link href={item.url}>
                    <item.icon className="!size-4" />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {item.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AppSidebarWithInset({ 
  children, 
  defaultOpen 
}: { 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <MainSidebar />
      <SecondarySidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
} 