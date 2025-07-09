import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

const approvalsData = [
  {
    name: 'Office Supplies - Staples',
    category: 'Facility Management',
    avatar: '/placeholder.svg',
    fallback: 'OS',
    amount: '€1,999.00'
  },
  {
    name: 'IT Equipment - Dell',
    category: 'Technology',
    avatar: '/placeholder.svg',
    fallback: 'IT',
    amount: '€3,299.00'
  },
  {
    name: 'Maintenance Contract - Siemens',
    category: 'Operations',
    avatar: '/placeholder.svg',
    fallback: 'MC',
    amount: '€12,599.00'
  },
  {
    name: 'Facility Repairs - Johnson Controls',
    category: 'Facility Management',
    avatar: '/placeholder.svg',
    fallback: 'FR',
    amount: '€2,199.00'
  },
  {
    name: 'Software License - Microsoft',
    category: 'Technology',
    avatar: '/placeholder.svg',
    fallback: 'SL',
    amount: '€4,399.00'
  }
];

export function RecentSales() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Approvals</CardTitle>
        <CardDescription>You processed 265 tickets this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {approvalsData.map((approval, index) => (
            <div key={index} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={approval.avatar} alt='Avatar' />
                <AvatarFallback>{approval.fallback}</AvatarFallback>
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>{approval.name}</p>
                <p className='text-muted-foreground text-sm'>{approval.category}</p>
              </div>
              <div className='ml-auto font-medium'>{approval.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
