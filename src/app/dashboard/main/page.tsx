import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowRight, Ticket, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { ActivitySection } from '@/components/procurement/activity-section';
import { mockTickets } from '@/components/data/mock-tickets';
import { getStatusCounts } from '@/components/utils/ticket-utils';
import AnimatedLink from '@/components/ui/animated-link';
import { Badge } from '@/components/ui/badge';
import { IconClock, IconLoader } from '@tabler/icons-react';

export const metadata = {
  title: 'Dashboard : Main'
};

export default function DashboardPage() {
  const statusCounts = getStatusCounts(mockTickets);

  return (
    <PageContainer>
      <div className='w-full space-y-6'>
        <div className='flex items-center justify-between'>
          <Heading 
            title="Dashboard" 
            description="Overview of your procurement activities and key metrics" 
          />
        </div>

        {/* Quick Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.pending + statusCounts["in-progress"]}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="outline" className="text-muted-foreground font-normal">
                  <IconClock className="mr-1 h-3 w-3" />
                  {statusCounts.pending} Pending
                </Badge>
                <Badge variant="outline" className="text-muted-foreground font-normal">
                  <IconLoader className="mr-1 h-3 w-3" />
                  {statusCounts["in-progress"]} In Progress
                </Badge>
              </div>
              <div className='mt-2'>
                <AnimatedLink href='/dashboard/procurement' text='View all' />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusCounts.all > 0 ? ((statusCounts.approved / statusCounts.all) * 100).toFixed(0) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Approval rate this month</p>
              <div className='mt-2'>
                <AnimatedLink href='/dashboard/analytics' text='View details' />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard/procurement">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Ticket
                  </Button>
                </Link>
                <Link href="/dashboard/procurement">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Ticket className="mr-2 h-4 w-4" />
                    Review Pending
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <ActivitySection />

        {/* Procurement Management Link */}
        <Card className="border-dashed mb-8">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Procurement Management</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              Access the full procurement management system to create, view, edit, and manage all procurement tickets with advanced filtering and detailed views.
            </p>
            <Link href="/dashboard/procurement">
              <Button size="lg">
                Open Procurement Manager <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
} 