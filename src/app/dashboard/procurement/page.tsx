"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTickets } from "@/features/procurement/context/TicketContext"
import PageContainer from "@/components/layout/page-container"
import { ProcurementOverview } from "@/features/procurement/components/procurement-overview"
import { ProcurementForm } from "@/features/procurement/components/procurement-form"
import { TicketDetailModal } from "@/features/procurement/components/ticket-detail-modal"
import { DeleteConfirmationModal } from "@/features/procurement/components/delete-confirmation-modal"
import type { ProcurementTicket, Comment } from "@/types/procurement"
import { toast } from "sonner"

type ViewMode = "overview" | "create" | "edit"

export default function ProcurementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get("view")

  const {
    tickets,
    addTicket,
    updateTicket,
    deleteTicket,
    updateTicketStatus,
    addComment,
  } = useTickets()

  const [viewMode, setViewMode] = useState<ViewMode>(
    view === "create" ? "create" : "overview"
  )
  const [selectedTicket, setSelectedTicket] = useState<ProcurementTicket | null>(
    null
  )
  const [editingTicket, setEditingTicket] = useState<ProcurementTicket | null>(
    null
  )
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState<ProcurementTicket | null>(
    null
  )

  useEffect(() => {
    setViewMode(view === "create" ? "create" : "overview")
  }, [view])

  const handleNewTicket = () => {
    router.push("/dashboard/procurement?view=create")
  }

  const handleBackToOverview = () => {
    setEditingTicket(null)
    router.push("/dashboard/procurement")
  }

  const handleTicketSave = (
    ticketData: Omit<ProcurementTicket, "id" | "createdAt" | "status">
  ) => {
    if (viewMode === "create") {
      addTicket(ticketData)
    } else if (viewMode === "edit" && editingTicket) {
      updateTicket({ ...editingTicket, ...ticketData })
    }
    handleBackToOverview()
  }

  const handleTicketView = (ticket: ProcurementTicket) => {
    setSelectedTicket(ticket)
    setShowDetailModal(true)
  }

  const handleTicketEdit = (ticket: ProcurementTicket) => {
    setEditingTicket(ticket)
    setViewMode("edit")
    setShowDetailModal(false)
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
    newStatus: ProcurementTicket["status"]
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

  const handleReset = () => {
    toast.success("Form Reset", {
      description: "All form fields have been reset to their default values.",
    })
  }

  return (
    <PageContainer>
      <div className="w-full h-full">
        {viewMode === "overview" && (
          <ProcurementOverview
            tickets={tickets}
            onNewTicket={handleNewTicket}
            onTicketView={handleTicketView}
            onTicketEdit={handleTicketEdit}
            onTicketDelete={handleTicketDelete}
            onStatusChange={handleStatusChange}
          />
        )}

        {(viewMode === "create" || viewMode === "edit") && (
          <ProcurementForm
            // @ts-ignore
            initialData={editingTicket}
            onCancel={handleBackToOverview}
            onSave={handleTicketSave}
            onReset={handleReset}
          />
        )}

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
    </PageContainer>
  )
} 