# Next.js Shadcn Dashboard Starter

A modern, fully-featured dashboard starter built with Next.js 15, TypeScript, and shadcn/ui components. Features authentication, data tables, theming, and a comprehensive component library.

## 🚀 Features

### Core Features
- **⚡ Next.js 15** - Latest version with App Router and React 19
- **🔐 Authentication** - Clerk integration with protected routes
- **🎨 Modern UI** - shadcn/ui components with Tailwind CSS
- **🌙 Theme System** - Dark/light mode with custom theme variants
- **📊 Data Tables** - Advanced tables with sorting, filtering, and pagination
- **🔍 Global Search** - Command palette with kbar integration
- **📱 Responsive Design** - Mobile-first approach with responsive layouts

### Advanced Features
- **URL State Management** - Persistent table state in URL parameters
- **File Upload** - Drag & drop file uploader with progress tracking
- **Toast Notifications** - Global notification system with Sonner
- **Performance Optimized** - Debounced filtering and optimized re-renders
- **Type Safe** - Full TypeScript support throughout
- **Accessibility** - WCAG compliant components

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard routes
│   ├── auth/              # Authentication pages
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/                # Base shadcn/ui components
│   ├── layout/            # Layout-specific components
│   ├── data/              # Data display components
│   └── *.tsx              # Feature components
├── features/              # Feature-specific modules
│   ├── analytics/         # Analytics feature
│   ├── kanban/            # Kanban board feature
│   ├── products/          # Product management
│   └── procurement/       # Procurement feature
├── hooks/                 # Custom React hooks
│   ├── use-data-table.ts  # Advanced data table hook
│   ├── use-controllable-state.tsx # Controlled/uncontrolled state
│   └── *.ts               # Other utility hooks
├── lib/                   # Utility functions
│   ├── utils.ts           # Common utilities (cn, formatBytes, etc.)
│   ├── data-table.ts      # Data table utilities
│   ├── format.ts          # Date/string formatting
│   └── parsers.ts         # URL state parsers
├── types/                 # TypeScript type definitions
└── config/                # Configuration files
```

## 🛠 Key Components & Hooks

### Core Utilities (`src/lib/utils.ts`)
```typescript
// Tailwind class merging
cn('px-4', 'py-2', isActive && 'bg-blue-500')

// File size formatting
formatBytes(1024) // "1 KB"
formatBytes(1536, { decimals: 1, sizeType: 'accurate' }) // "1.5 KiB"

// Date formatting
formatDate("2024-01-15") // "Jan 15, 2024"

// ID generation
generateId() // "a7b9c2d"
```

### Data Table Hook (`src/hooks/use-data-table.ts`)
```typescript
const { table } = useDataTable({
  columns: productColumns,
  data: products,
  pageCount: totalPages,
  enableAdvancedFilter: true,
  debounceMs: 300
});

// Access table state
const currentPage = table.getState().pagination.pageIndex + 1;
const selectedRows = table.getFilteredSelectedRowModel().rows;
```

### Search Component (`src/components/search-input.tsx`)
```typescript
// Global search with command palette
<SearchInput />
// Triggers kbar command palette with ⌘K shortcut
```

### File Uploader (`src/components/file-uploader.tsx`)
```typescript
<FileUploader
  value={files}
  onValueChange={setFiles}
  onUpload={handleUpload}
  maxFiles={5}
  maxSize={1024 * 1024 * 2} // 2MB
  accept={{ 'image/*': [] }}
/>
```

## 🔧 Configuration

### Authentication (Middleware)
The application uses Clerk for authentication with route protection:

```typescript
// Protected routes: /dashboard/*
// Public routes: /, /auth/*
```

### Theme System
- **Light/Dark Mode**: Automatic system preference detection
- **Custom Themes**: Multiple theme variants with scaling options
- **CSS Variables**: Dynamic theme switching with CSS custom properties

### URL State Management
Tables automatically sync state with URL parameters:
- **Pagination**: `?page=2&perPage=20`
- **Sorting**: `?sort=[{"id":"name","desc":false}]`
- **Filtering**: `?filters=[{"id":"status","value":"active"}]`

## 🎨 Styling Architecture

### Tailwind CSS + CSS Variables
- **Base Styles**: `globals.css` with CSS custom properties
- **Theme Variants**: `theme.css` with multiple color schemes
- **Component Styles**: Tailwind utility classes with `cn()` helper
- **Responsive Design**: Mobile-first breakpoints

### Component Patterns
```typescript
// Controlled/Uncontrolled pattern
const [value, setValue] = useControllableState({
  prop: controlledValue,
  defaultProp: defaultValue,
  onChange: handleChange
});

// Compound component pattern
<FileUploader>
  <FileUploader.Dropzone />
  <FileUploader.FileList />
</FileUploader>
```

## 📚 Documentation Standards

### JSDoc Comments
All functions, components, and hooks include comprehensive JSDoc documentation:

```typescript
/**
 * Combines multiple class names using clsx and merges Tailwind CSS classes.
 * 
 * @param inputs - Array of class values
 * @returns A string of merged class names
 * 
 * @example
 * ```tsx
 * cn('px-4', 'py-2', isActive && 'bg-blue-500')
 * ```
 */
```

### Type Safety
- **Strict TypeScript**: Full type coverage with strict configuration
- **Generic Components**: Reusable components with proper generics
- **Type Definitions**: Comprehensive type definitions in `src/types/`

## 🚦 Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your Clerk API keys
   ```

3. **Development Server**
   ```bash
   pnpm dev
   ```

4. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```

## 🔍 Key Features Deep Dive

### Advanced Data Tables
- **Server-side Operations**: Pagination, sorting, and filtering
- **URL State Persistence**: Shareable table states via URL
- **Column Management**: Show/hide columns, pinning, resizing
- **Row Selection**: Multi-row selection with actions
- **Filter Operators**: Multiple filter types (text, date, select, etc.)

### Authentication Flow
- **Route Protection**: Middleware-based route protection
- **Sign-in/Sign-up**: Pre-built authentication pages
- **User Management**: Profile management and organization switching
- **Session Handling**: Automatic session management with Clerk

### Performance Optimizations
- **Debounced Filtering**: Prevents excessive API calls
- **Memoized Components**: React.memo for expensive components
- **Optimized Renders**: Proper dependency arrays and state management
- **Code Splitting**: Dynamic imports for large components

## 🤝 Contributing

This codebase follows modern React and Next.js patterns with comprehensive documentation. Each component and utility function includes:

- **Purpose Documentation**: What the component/function does
- **Usage Examples**: How to use it properly
- **Type Definitions**: Complete TypeScript types
- **Error Handling**: Graceful error handling patterns

When adding new features:
1. Follow the existing documentation patterns
2. Add comprehensive JSDoc comments
3. Include usage examples
4. Ensure type safety
5. Test both controlled and uncontrolled modes where applicable

## 📄 License

MIT License - see LICENSE file for details.