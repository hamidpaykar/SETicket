"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo, useState } from "react"
import { mockTickets } from "@/components/data/mock-tickets"
import type { ProcurementTicket, TicketStatus } from "@/types/procurement"
import { filterTickets, getStatusCounts } from "@/components/utils/ticket-utils"
import { ProcurementFilters } from "@/features/procurement/components/procurement-filters"
import { ProcurementHeader } from "@/features/procurement/components/procurement-header"
import { ProcurementStats } from "@/features/procurement/components/procurement-stats"
import { ProcurementTable } from "@/features/procurement/components/procurement-table"
import { TablePagination } from "@/components/ui/table-pagination"
import { toast } from "sonner"

interface ProcurementOverviewProps {
  tickets?: ProcurementTicket[]
  onNewTicket?: () => void
  onTicketView?: (ticket: ProcurementTicket) => void
  onTicketDelete?: (ticket: ProcurementTicket) => void
  onStatusChange?: (ticket: ProcurementTicket, newStatus: TicketStatus) => void
}

export function ProcurementOverview({
  tickets = mockTickets,
  onNewTicket,
  onTicketView,
  onTicketDelete,
  onStatusChange,
}: ProcurementOverviewProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredTickets = useMemo(() => {
    return filterTickets(tickets, statusFilter, searchTerm)
  }, [tickets, statusFilter, searchTerm])

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredTickets.slice(start, end)
  }, [filteredTickets, currentPage, pageSize])

  const statusCounts = getStatusCounts(tickets)

  const handleNewTicket = () => {
    if (onNewTicket) {
      onNewTicket()
      toast.info("New Ticket Form", {
        description: "Opening the procurement ticket creation form.",
      })
    }
  }

  const handleTicketView = (ticket: ProcurementTicket) => {
    if (onTicketView) {
      onTicketView(ticket)
      toast.info("Ticket Details", {
        description: `Opening details for ticket ${ticket.id}.`,
      })
    }
  }

  const handleTicketDelete = (ticket: ProcurementTicket) => {
    if (onTicketDelete) {
      onTicketDelete(ticket)
      toast.warning("Delete Confirmation", {
        description: `Confirm deletion of ticket ${ticket.id}.`,
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <ProcurementHeader onNewTicket={handleNewTicket} />

        {/* Stats Cards */}
        <ProcurementStats tickets={tickets} filteredTickets={filteredTickets} statusCounts={statusCounts} />
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-2xl font-bold">All Tickets ({filteredTickets.length})</CardTitle>
            <ProcurementFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusCounts={statusCounts}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ProcurementTable
            tickets={paginatedTickets}
            onTicketView={handleTicketView}
            onTicketDelete={handleTicketDelete}
          />
          <TablePagination
            totalItems={filteredTickets.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </div>
  )
}
