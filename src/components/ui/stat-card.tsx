import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StatCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      '@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs',
      className
    )}
    {...props}
  />
));
StatCard.displayName = 'StatCard';

export { StatCard }; 