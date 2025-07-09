"use client"

import { useState, useMemo } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTickets } from "@/features/procurement/context/TicketContext"
import type { ProcurementTicket, TicketStatus, Comment } from "@/types/procurement"
import { TicketDetailModal } from "@/features/procurement/components/ticket-detail-modal"
import { DeleteConfirmationModal } from "@/features/procurement/components/delete-confirmation-modal"
import { ProcurementTable } from "@/features/procurement/components/procurement-table"
import { TablePagination } from "@/components/ui/table-pagination"
import { toast } from "sonner"

interface FilteredTicketsViewProps {
  statuses?: TicketStatus[]
  title: string
  filterByCurrentUser?: boolean
}

export function FilteredTicketsView({
  statuses,
  title,
  filterByCurrentUser = false,
}: FilteredTicketsViewProps) {
  const {
    tickets,
    deleteTicket,
    updateTicketStatus,
    addComment,
  } = useTickets()
  const { user } = useUser()

  const [selectedTicket, setSelectedTicket] = useState<ProcurementTicket | null>(
    null
  )
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState<ProcurementTicket | null>(
    null
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredTickets = useMemo(() => {
    let filtered = tickets
    if (filterByCurrentUser && user) {
      filtered = tickets.filter((ticket) => ticket.requester.id === user.id)
    } else if (statuses) {
      filtered = tickets.filter((ticket) => statuses.includes(ticket.status))
    }
    return filtered
  }, [tickets, statuses, filterByCurrentUser, user])

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredTickets.slice(start, end)
  }, [filteredTickets, currentPage, pageSize])

  const handleTicketView = (ticket: ProcurementTicket) => {
    setSelectedTicket(ticket)
    setShowDetailModal(true)
  }

  const handleTicketEdit = (ticket: ProcurementTicket) => {
    // This should ideally route to the edit page
    toast.info(`Editing ticket ${ticket.id}`)
  }

  const handleTicketDelete = (ticket: ProcurementTicket) => {
    setTicketToDelete(ticket)
    setShowDeleteModal(true)
    setShowDetailModal(false)
  }

  const confirmDelete = () => {
    if (ticketToDelete) {
      deleteTicket(ticketToDelete.id)
    }
    setShowDeleteModal(false)
    setTicketToDelete(null)
  }

  const handleStatusChange = (
    ticket: ProcurementTicket,
    newStatus: TicketStatus
  ) => {
    updateTicketStatus(ticket.id, newStatus)
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus })
    }
  }

  const handleCommentAdd = (ticket: ProcurementTicket, comment: Comment) => {
    addComment(ticket.id, comment)
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket({
        ...selectedTicket,
        comments: [...(selectedTicket.comments || []), comment],
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {title} ({filteredTickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProcurementTable
            tickets={paginatedTickets}
            onTicketView={handleTicketView}
            onTicketEdit={handleTicketEdit}
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

      <TicketDetailModal
        ticket={selectedTicket}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onEdit={handleTicketEdit}
        onDelete={handleTicketDelete}
        onStatusChange={handleStatusChange}
        onCommentAdd={handleCommentAdd}
      />

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={confirmDelete}
        ticketId={ticketToDelete?.id || ""}
        ticketTitle={ticketToDelete?.title || ""}
      />
    </div>
  )
} 