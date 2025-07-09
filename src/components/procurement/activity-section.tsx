import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, MessageSquare } from 'lucide-react';

export function ActivitySection() {
  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Recent Procurement Activity</CardTitle>
          <CardDescription>Latest updates on your procurement requests</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between p-4 border rounded-lg'>
            <div className='space-y-1'>
              <p className='text-sm font-medium'>No recent activity</p>
              <p className='text-xs text-muted-foreground'>
                Your procurement activities will appear here
              </p>
            </div>
            <Badge variant="secondary">New</Badge>
          </div>
          
          <div className='text-center py-8 text-muted-foreground'>
            <ShoppingCart className='mx-auto h-12 w-12 mb-2 opacity-50' />
            <p className='text-sm'>No procurement requests yet</p>
            <p className='text-xs'>Start by creating your first procurement request</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Latest system updates and alerts</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-center py-8 text-muted-foreground'>
            <MessageSquare className='mx-auto h-12 w-12 mb-2 opacity-50' />
            <p className='text-sm'>No notifications</p>
            <p className='text-xs'>System alerts will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 