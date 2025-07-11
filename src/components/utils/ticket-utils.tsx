import { Badge } from "@/components/ui/badge"
import type {
  ProcurementTicket,
  TicketStatus,
  StatusCounts,
} from "@/types/procurement"
import {
  IconLoader,
  IconCircleCheckFilled,
  IconClock,
  IconCircleXFilled,
  IconLock,
  IconFile,
} from "@tabler/icons-react"

/**
 * Filter tickets based on status and search term
 */
export function filterTickets(
  tickets: ProcurementTicket[],
  statusFilter: string,
  searchTerm: string
): ProcurementTicket[] {
  let filtered = tickets

  // Filter by status
  if (statusFilter !== "all") {
    filtered = filtered.filter((ticket) => ticket.status === statusFilter)
  }

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(
      (ticket) =>
        (ticket.id && ticket.id.toLowerCase().includes(term)) ||
        (ticket.title && ticket.title.toLowerCase().includes(term)) ||
        (ticket.description && ticket.description.toLowerCase().includes(term)) ||
        (ticket.requester?.fullName &&
          ticket.requester.fullName.toLowerCase().includes(term)) ||
        (ticket.department && ticket.department.toLowerCase().includes(term))
    )
  }

  return filtered
}

/**
 * Get status counts for all ticket statuses
 */
export function getStatusCounts(tickets: ProcurementTicket[]): StatusCounts {
  const counts = tickets.reduce(
    (acc, ticket) => {
      acc.all++
      acc[ticket.status]++
      return acc
    },
    {
      all: 0,
      New: 0,
      pending: 0,
      "in-progress": 0,
      approved: 0,
      rejected: 0,
      declined: 0,
      completed: 0,
      closed: 0,
    } as StatusCounts
  )

  return counts
}

/**
 * Get status badge component for a given status
 */
export function getStatusBadge(status: TicketStatus) {
  switch (status) {
    case "New":
      return (
        <Badge variant="outline" className="text-muted-foreground font-normal">
          <IconFile className="mr-1 h-3 w-3" style={{ color: "#60a5fa" }} />
          New
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="text-muted-foreground font-normal">
          <IconClock className="mr-1 h-3 w-3" style={{ color: "#eab308" }} />
          Pending
        </Badge>
      )
    case "in-progress":
      return (
        <Badge variant="outline" className="text-muted-foreground font-normal">
          <IconLoader className="mr-1 h-3 w-3 text-blue-500" />
          In Progress
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="outline" className="text-muted-foreground font-normal">
          <IconCircleCheckFilled className="mr-1 h-3 w-3 fill-green-500 text-green-500" />
          Approved
        </Badge>
      )
    case "rejected":
    case "declined":
      return (
        <Badge variant="destructive" className="text-white">
          <IconCircleXFilled className="mr-1 h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="font-normal text-green-800 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/50 dark:border-green-800">
          <IconCircleCheckFilled className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      )
    case "closed":
      return (
        <Badge variant="outline" className="font-normal text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700">
          <IconLock className="mr-1 h-3 w-3" />
          Closed
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
} 