import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/main',
    icon: 'dashboard',
    isActive: true,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: 'analytics',
    isActive: false,
    shortcut: ['a', 'a'],
    items: [] // Empty array as there are no child items for Analytics
  },
  {
    title: 'Procurement',
    url: '/dashboard/procurement', // Direct link to procurement management
    icon: 'billing',
    isActive: false,
    shortcut: ['r', 'r'],
    items: [
      {
        title: 'All Tickets',
        url: '/dashboard/procurement',
        icon: 'billing'
      },
      {
        title: 'New Ticket',
        url: '/dashboard/procurement/new',
        icon: 'add'
      },
      {
        title: 'My Tickets',
        url: '/dashboard/procurement/my-tickets',
        icon: 'billing'
      },
      {
        title: 'By Status',
        url: '#', // Placeholder, this is a section title
        icon: 'billing',
        items: [
          {
            title: 'Pending Approval',
            url: '/dashboard/procurement/pending-approval',
            icon: 'billing'
          },
          {
            title: 'In Progress',
            url: '/dashboard/procurement/in-progress',
            icon: 'billing'
          },
          {
            title: 'Approved',
            url: '/dashboard/procurement/approved',
            icon: 'billing'
          },
          {
            title: 'Completed',
            url: '/dashboard/procurement/completed',
            icon: 'billing'
          },
          {
            title: 'Rejected',
            url: '/dashboard/procurement/rejected',
            icon: 'billing'
          },
          {
            title: 'Closed',
            url: '/dashboard/procurement/closed',
            icon: 'billing'
          }
        ]
      }
    ]
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: false,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Messages',
    url: '#',
    icon: 'message',
    shortcut: ['m', 's'],
    isActive: false,
    items: []
  },
  {
    title: 'Settings',
    url: '#',
    icon: 'settings',
    shortcut: ['s', 't'],
    isActive: false,
    items: []
  },
  {
    title: 'Help',
    url: '#',
    icon: 'help',
    shortcut: ['h', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Projects',
    url: '#',
    icon: 'projects',
    shortcut: ['p', 'j'],
    isActive: false,
    items: []
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
