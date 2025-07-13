import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/font';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import './theme.css';
import { Analytics } from '@vercel/analytics/next';

/**
 * Theme color configuration for different color schemes.
 * Used for browser theme-color meta tag and progressive web app theming.
 */
const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

/**
 * Application metadata configuration.
 * Defines the app title, description, and favicon for SEO and browser display.
 */
export const metadata: Metadata = {
  title: 'Siemens Energy',
  description: 'Procurement Dashboard for Siemens Energy',
  icons: {
    icon: '/favicon.png'
  }
};

/**
 * Viewport configuration for responsive design and theming.
 * Sets default theme color for light mode (will be updated by client-side script for dark mode).
 */
export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

/**
 * Root Layout Component
 * 
 * The main layout wrapper for the entire Next.js application. This component:
 * - Sets up the HTML document structure
 * - Configures theme providers and color scheme handling
 * - Initializes global providers (auth, toast, etc.)
 * - Handles server-side theme detection and client hydration
 * - Manages font loading and CSS variables
 * 
 * @param children - The page content to render within the layout
 * @returns The complete HTML document structure with providers
 * 
 * @features
 * - **Theme Management**: Automatic dark/light mode detection and switching
 * - **Font Optimization**: Next.js font optimization with custom variables
 * - **Progressive Enhancement**: Works without JavaScript for basic functionality
 * - **Toast Notifications**: Global toast notification system
 * - **Authentication**: Clerk authentication provider integration
 * - **URL State**: Query string state management with nuqs
 * - **Loading States**: Top loading bar for navigation
 * 
 * @example
 * ```tsx
 * // This layout automatically wraps all pages
 * // Page components receive the layout automatically:
 * 
 * // app/dashboard/page.tsx
 * export default function DashboardPage() {
 *   return <div>Dashboard content</div>
 * }
 * // Will be wrapped with RootLayout automatically
 * ```
 * 
 * @architecture
 * The layout follows this provider hierarchy:
 * 1. HTML/Body with theme classes
 * 2. NextTopLoader for navigation feedback
 * 3. NuqsAdapter for URL state management
 * 4. ThemeProvider for theme switching
 * 5. Providers (auth, etc.)
 * 6. Toaster for notifications
 * 7. Page content
 */
export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Read theme preference from server-side cookies
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Client-side script to update theme-color meta tag for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={cn(
          'bg-background overflow-hidden overscroll-none font-sans antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
          fontVariables
        )}
      >
        {/* Loading bar for page transitions */}
        <NextTopLoader showSpinner={false} />
        
        {/* URL state management provider */}
        <NuqsAdapter>
          {/* Theme management provider */}
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            {/* Application providers (auth, context, etc.) */}
            <Providers activeThemeValue={activeThemeValue as string}>
              {/* Global toast notification system */}
              <Toaster />
              {/* Page content */}
              {children}
              <Analytics />
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
