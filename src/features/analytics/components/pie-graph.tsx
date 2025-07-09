'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

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
  { department: 'it', spending: 275, fill: 'var(--primary)' },
  { department: 'operations', spending: 200, fill: 'var(--primary-light)' },
  { department: 'facilities', spending: 287, fill: 'var(--primary-lighter)' },
  { department: 'finance', spending: 173, fill: 'var(--primary-dark)' },
  { department: 'hr', spending: 190, fill: 'var(--primary-darker)' }
];

const chartConfig = {
  spending: {
    label: 'Spending'
  },
  it: {
    label: 'IT Department',
    color: 'var(--primary)'
  },
  operations: {
    label: 'Operations',
    color: 'var(--primary)'
  },
  facilities: {
    label: 'Facilities',
    color: 'var(--primary)'
  },
  finance: {
    label: 'Finance',
    color: 'var(--primary)'
  },
  hr: {
    label: 'HR',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalSpending = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.spending, 0);
  }, []);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Spending by Department</CardTitle>
            <CardDescription>
              <span className='hidden @[540px]/card:block'>
                Spending by department for the last 6 months
              </span>
              <span className='@[540px]/card:hidden'>Department spending</span>
            </CardDescription>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold'>€{totalSpending.toLocaleString()}K</div>
            <div className='text-sm text-muted-foreground'>Total Spending</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {['it', 'operations', 'facilities', 'finance', 'hr'].map(
                (department, index) => (
                  <linearGradient
                    key={department}
                    id={`fill${department}`}
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='0%'
                      stopColor='var(--primary)'
                      stopOpacity={1 - index * 0.15}
                    />
                    <stop
                      offset='100%'
                      stopColor='var(--primary)'
                      stopOpacity={0.8 - index * 0.15}
                    />
                  </linearGradient>
                )
              )}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.department})`
              }))}
              dataKey='spending'
              nameKey='department'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          IT Department leads with{' '}
          {((chartData[0].spending / totalSpending) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Based on procurement data from January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
