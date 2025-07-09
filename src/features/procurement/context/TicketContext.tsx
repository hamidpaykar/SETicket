"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { toast } from "sonner"
import { mockTickets } from "@/components/data/mock-tickets"
import type {
  ProcurementTicket,
  TicketStatus,
  Comment,
} from "@/types/procurement"
import { useUser } from "@clerk/nextjs"

interface TicketContextType {
  tickets: ProcurementTicket[]
  addTicket: (ticket: Omit<ProcurementTicket, "id" | "createdAt" | "status">) => void
  updateTicket: (ticket: ProcurementTicket) => void
  deleteTicket: (ticketId: string) => void
  updateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void
  addComment: (ticketId: string, comment: Comment) => void
  getTicketById: (ticketId: string) => ProcurementTicket | undefined
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function TicketProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [tickets, setTickets] = useState<ProcurementTicket[]>(mockTickets)

  const addTicket = useCallback(
    (ticket: Omit<ProcurementTicket, "id" | "createdAt" | "status">) => {
      if (!user) {
        toast.error("You must be logged in to create a ticket.")
        return
      }

      const newTicket: ProcurementTicket = {
        ...ticket,
        id: `PRO-${Date.now()}`,
        ticketId: `PRO-${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
        requester: {
          id: user.id,
          fullName: user.fullName || "Unknown User",
          email: user.primaryEmailAddress?.emailAddress || "no-email@example.com",
          profileImage: user.imageUrl,
        },
      }

      setTickets((prev) => [newTicket, ...prev])
      toast.success("Ticket Created", {
        description: `Procurement ticket ${newTicket.id} has been successfully created.`,
      })
    },
    [user]
  )

  const updateTicket = useCallback((updatedTicket: ProcurementTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    )
    toast.success("Ticket Updated", {
      description: `Ticket ${updatedTicket.id} has been successfully updated.`,
    })
  }, [])

  const deleteTicket = useCallback((ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId))
    toast.success("Ticket Deleted", {
      description: `Ticket ${ticketId} has been permanently removed.`,
    })
  }, [])

  const updateTicketStatus = useCallback(
    (ticketId: string, newStatus: TicketStatus) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      )
      toast.success("Status Updated", {
        description: `Ticket ${ticketId} status changed to ${newStatus}.`,
      })
    },
    []
  )

  const addComment = useCallback((ticketId: string, comment: Comment) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, comments: [...(t.comments || []), comment] }
          : t
      )
    )
  }, [])

  const getTicketById = useCallback(
    (ticketId: string) => {
      return tickets.find((ticket) => ticket.id === ticketId)
    },
    [tickets]
  )

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        deleteTicket,
        updateTicketStatus,
        addComment,
        getTicketById,
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
} 