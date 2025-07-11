"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"
import { ProcurementForm } from "@/features/procurement/components/procurement-form"
import { Plus } from "lucide-react"
import { useState } from "react"

interface NewProcurementDialogProps {
  trigger?: React.ReactNode
}

export default function NewProcurementDialog({ trigger }: NewProcurementDialogProps) {
  const [open, setOpen] = useState(false)

  const handleCancel = () => {
    setOpen(false)
  }

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      New Ticket
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto p-0 w-full">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Create New Procurement Ticket</DialogTitle>
          <DialogDescription>Fill out the form to create a new ticket.</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <ProcurementForm onCancel={handleCancel} />
        </div>
      </DialogContent>
    </Dialog>
  )
} 