"use client"

import { Button } from "@/components/ui/button"
import { Ticket } from "lucide-react"

interface ProcurementHeaderProps {
  onNewTicket?: () => void
}

export function ProcurementHeader({ onNewTicket }: ProcurementHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Procurement Tickets</h1>
        <p className="text-muted-foreground">Manage and track all procurement requests and their approval status</p>
      </div>
      <Button onClick={onNewTicket}>
        <Ticket className="w-4 h-4 mr-2" />
        New Ticket
      </Button>
    </div>
  )
}
