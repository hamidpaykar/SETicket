'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', approved: 186, pending: 80 },
  { month: 'February', approved: 305, pending: 200 },
  { month: 'March', approved: 237, pending: 120 },
  { month: 'April', approved: 73, pending: 190 },
  { month: 'May', approved: 209, pending: 130 },
  { month: 'June', approved: 214, pending: 140 }
];

const chartConfig = {
  tickets: {
    label: 'Total Requests'
  },
  approved: {
    label: 'Approved',
    color: 'var(--primary)'
  },
  pending: {
    label: 'Pending',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Ticket Status Trends</CardTitle>
        <CardDescription>
          Showing ticket trends for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillApproved' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-approved)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-approved)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillPending' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-pending)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-pending)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='pending'
              type='natural'
              fill='url(#fillPending)'
              stroke='var(--color-pending)'
              stackId='a'
            />
            <Area
              dataKey='approved'
              type='natural'
              fill='url(#fillApproved)'
              stroke='var(--color-approved)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Procurement activity increased{' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Based on procurement data from January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
