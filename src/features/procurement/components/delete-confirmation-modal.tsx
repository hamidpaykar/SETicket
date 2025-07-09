"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface DeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  ticketId: string
  ticketTitle: string
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  ticketId,
  ticketTitle,
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)

    // Show confirmation toast
    toast.success("Ticket Deleted", {
      description: `Ticket ${ticketId} has been permanently removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          toast.info("Undo Feature", {
            description: "Undo functionality will be available in a future update.",
          })
        },
      },
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
    toast.info("Delete Cancelled", {
      description: "The ticket deletion has been cancelled.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Delete Ticket</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-700">Are you sure you want to delete the following ticket?</p>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
            <p className="font-medium text-sm">{ticketTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">ID: {ticketId}</p>
          </div>
          <p className="text-xs text-red-600 mt-3">This will permanently remove the ticket and all associated data.</p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
