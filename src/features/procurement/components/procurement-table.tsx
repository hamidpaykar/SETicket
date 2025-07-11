"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react"
import type { ProcurementTicket } from "@/types/procurement"
import { getStatusBadge } from "@/components/utils/ticket-utils"

interface ProcurementTableProps {
  tickets: ProcurementTicket[]
  onTicketView?: (ticket: ProcurementTicket) => void
  onTicketEdit?: (ticket: ProcurementTicket) => void
  onTicketDelete?: (ticket: ProcurementTicket) => void
}

export function ProcurementTable({ tickets, onTicketView, onTicketEdit, onTicketDelete }: ProcurementTableProps) {
  const handleViewClick = (ticket: ProcurementTicket) => {
    if (onTicketView) {
      onTicketView(ticket)
    }
  }

  const handleEditClick = (ticket: ProcurementTicket) => {
    if (onTicketEdit) {
      onTicketEdit(ticket)
    }
  }

  const handleDeleteClick = (ticket: ProcurementTicket) => {
    if (onTicketDelete) {
      onTicketDelete(ticket)
    }
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No tickets found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onTicketView && onTicketView(ticket)}
              >
                <TableCell className="font-medium py-3">{ticket.id}</TableCell>
                <TableCell className="py-3">
                  <div>
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">{ticket.description ?? 'No description'}</div>
                  </div>
                </TableCell>
                <TableCell className="py-3">{ticket.requester?.fullName}</TableCell>
                <TableCell className="py-3">{ticket.department}</TableCell>
                <TableCell className="font-medium py-3">${ticket.amount?.toLocaleString() || "0"}</TableCell>
                <TableCell className="py-3">{getStatusBadge(ticket.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground py-3">
                  {ticket.createdDate ? new Date(ticket.createdDate).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewClick(ticket)}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(ticket)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(ticket)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
