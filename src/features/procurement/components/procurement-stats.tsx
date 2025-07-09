import { StatCard } from "@/components/ui/stat-card"
import { CalendarDays, X, Ticket, Users } from "lucide-react"
import type { ProcurementTicket, StatusCounts } from "@/types/procurement"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ProcurementStatsProps {
  tickets: ProcurementTicket[]
  filteredTickets: ProcurementTicket[]
  statusCounts: StatusCounts
}

export function ProcurementStats({ tickets, filteredTickets, statusCounts }: ProcurementStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{statusCounts.all}</div>
          <p className="text-sm text-muted-foreground">{statusCounts.pending} pending review</p>
        </CardContent>
      </StatCard>
      
      <Link href="/dashboard/procurement/rejected" className="block">
        <StatCard className="hover:shadow-md transition-all cursor-pointer hover:bg-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">Rejected Tickets</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{statusCounts.rejected}</div>
            <p className="text-sm text-muted-foreground">
              {statusCounts.all > 0 ? ((statusCounts.rejected / statusCounts.all) * 100).toFixed(1) : 0}% rejection rate
            </p>
          </CardContent>
        </StatCard>
      </Link>
      
      <Link href="/dashboard/procurement/approved" className="block">
        <StatCard className="hover:shadow-md transition-all cursor-pointer hover:bg-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{statusCounts.approved}</div>
            <p className="text-sm text-muted-foreground">
              {statusCounts.all > 0 ? ((statusCounts.approved / statusCounts.all) * 100).toFixed(1) : 0}% approval rate
            </p>
          </CardContent>
        </StatCard>
      </Link>
      
      <Link href="/dashboard/procurement/in-progress" className="block">
        <StatCard className="hover:shadow-md transition-all cursor-pointer hover:bg-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{statusCounts["in-progress"]}</div>
            <p className="text-sm text-muted-foreground">Currently being reviewed</p>
          </CardContent>
        </StatCard>
      </Link>
    </div>
  )
}
