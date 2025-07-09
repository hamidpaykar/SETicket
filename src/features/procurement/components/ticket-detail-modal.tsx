"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  DollarSign,
  User,
  Building2,
  Edit,
  Trash2,
  Package,
  FileText,
  MessageSquare,
  Send,
  Clock,
  Save,
} from "lucide-react"
import { useState, useEffect } from "react"
import type { ProcurementTicket, TicketStatus, Comment } from "@/types/procurement"
import { toast } from "sonner"

interface TicketDetailModalProps {
  ticket: ProcurementTicket | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (ticket: ProcurementTicket) => void
  onDelete?: (ticket: ProcurementTicket) => void
  onStatusChange?: (ticket: ProcurementTicket, newStatus: TicketStatus) => void
  onCommentAdd?: (ticket: ProcurementTicket, comment: Comment) => void
}

export function TicketDetailModal({
  ticket,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onStatusChange,
  onCommentAdd,
}: TicketDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<TicketStatus>(ticket?.status || "pending")
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentRole, setCommentRole] = useState<"admin" | "user">("admin")

  useEffect(() => {
    if (ticket) {
      setCurrentStatus(ticket.status)
    }
  }, [ticket, open])

  if (!ticket) return null

  const handleStatusSelect = (newStatus: TicketStatus) => {
    setCurrentStatus(newStatus)
  }

  const handleSaveChanges = () => {
    if (onStatusChange) {
      onStatusChange(ticket, currentStatus)
      toast.success("Changes Saved", {
        description: `Ticket status has been updated to ${currentStatus}.`,
      })
    }
    onOpenChange(false)
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.error("Empty Comment", {
        description: "Please enter a message before submitting your comment.",
      })
      return
    }

    setIsSubmittingComment(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const comment: Comment = {
        id: `c${Date.now()}`,
        author: commentRole === "admin" ? "Admin User" : "Current User",
        role: commentRole,
        message: newComment.trim(),
        timestamp: new Date().toISOString(),
      }

      console.log("Adding comment:", comment)

      if (onCommentAdd) {
        onCommentAdd(ticket, comment)
      }

      setNewComment("")
      toast.success("Comment Added", {
        description: "Your comment has been successfully posted to this ticket.",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Comment Failed", {
        description: "Unable to post your comment. Please try again.",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleCommentSubmit()
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    }
  }

  const getCommentRoleBadge = (role: Comment["role"]) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
            Admin
          </Badge>
        )
      case "user":
        return (
          <Badge variant="outline" className="text-xs">
            User
          </Badge>
        )
      case "system":
        return (
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
            System
          </Badge>
        )
      default:
        return null
    }
  }

  const getAuthorInitials = (author: string) => {
    return author
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">{ticket.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <span className="font-medium">Ticket ID:</span>
                <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{ticket.ticketId || ticket.id}</span>
                <span className="text-muted-foreground">•</span>
                <span className="font-medium">Created:</span>
                <span>
                  {new Date(ticket.createdDate || ticket.date || ticket.createdAt || "").toLocaleString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="h-4 w-4 text-muted-foreground" />
                Sales Manager
              </div>
              <p className="text-sm text-muted-foreground pl-6">{ticket.salesManager || ticket.requester}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Department
              </div>
              <p className="text-sm text-muted-foreground pl-6">{ticket.department}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Amount
              </div>
              <p className="text-sm text-muted-foreground pl-6">${ticket.amount?.toLocaleString() || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                Created
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {new Date(ticket.createdDate || ticket.date || "").toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          {(ticket.customerName || ticket.customerCVR || ticket.customerOrderNumber) && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_1fr_auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
                  {ticket.customerName && (
                    <>
                      <span className="font-medium text-foreground">Customer Name:</span>
                      <p className="text-muted-foreground">{ticket.customerName}</p>
                    </>
                  )}
                  {ticket.customerCVR && (
                    <>
                      <span className="font-medium text-foreground md:pl-4">CVR/EAN:</span>
                      <p className="text-muted-foreground">{ticket.customerCVR}</p>
                    </>
                  )}
                  {ticket.customerOrderNumber && (
                    <>
                      <span className="font-medium text-foreground md:pl-4">Order Number:</span>
                      <p className="text-muted-foreground">{ticket.customerOrderNumber}</p>
                    </>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Sales Information */}
          {(ticket.salesOrg || ticket.distributionChannel || ticket.salesOffice) && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Sales Information
                </h4>
                <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_1fr_auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
                  {ticket.salesOrg && (
                    <>
                      <span className="font-medium text-foreground">Sales Org:</span>
                      <p className="text-muted-foreground">{ticket.salesOrg}</p>
                    </>
                  )}
                  {ticket.distributionChannel && (
                    <>
                      <span className="font-medium text-foreground md:pl-4">Distribution:</span>
                      <p className="text-muted-foreground">{ticket.distributionChannel}</p>
                    </>
                  )}
                  {ticket.salesOffice && (
                    <>
                      <span className="font-medium text-foreground md:pl-4">Sales Office:</span>
                      <p className="text-muted-foreground">{ticket.salesOffice}</p>
                    </>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Delivery Information */}
          {(ticket.company || ticket.attention || ticket.roadNumber || ticket.contactEmail) && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Delivery Information
                </h4>
                <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_1fr] items-start gap-x-4 gap-y-2 text-sm">
                  {ticket.company && (
                    <>
                      <span className="font-medium text-foreground">Company:</span>
                      <p className="text-muted-foreground">{ticket.company}</p>
                    </>
                  )}
                  {ticket.attention && (
                    <>
                      <span className="font-medium text-foreground md:pl-4">Attention:</span>
                      <p className="text-muted-foreground">{ticket.attention}</p>
                    </>
                  )}
                  {ticket.roadNumber && (
                    <>
                      <span className="font-medium text-foreground">Address:</span>
                      <p className="text-muted-foreground">
                        {ticket.roadNumber}
                        {ticket.postcode && `, ${ticket.postcode}`}
                        {ticket.cityLand && `, ${ticket.cityLand}`}
                      </p>
                    </>
                  )}
                  {ticket.contactEmail && (
                    <>
                      <span className="font-medium text-foreground md:pl-4">Contact Email:</span>
                      <p className="text-muted-foreground">{ticket.contactEmail}</p>
                    </>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Materials */}
          {ticket.materials && ticket.materials.length > 0 && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Materials ({ticket.materials.length})
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Material #</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Cost Price</TableHead>
                        <TableHead>Sales Price</TableHead>
                        <TableHead>Vendor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ticket.materials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">{material.position}</TableCell>
                          <TableCell>{material.description}</TableCell>
                          <TableCell>{material.materialNumber}</TableCell>
                          <TableCell>{material.quantity}</TableCell>
                          <TableCell>{material.currency}</TableCell>
                          <TableCell>{material.costPrice}</TableCell>
                          <TableCell>{material.salesPrice}</TableCell>
                          <TableCell>{material.vendor}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Attachments ({ticket.attachments.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {ticket.attachments.map((file, index) => (
                    <a
                      key={index}
                      href={URL.createObjectURL(file)}
                      download={file.name}
                      className="group flex items-center gap-3 bg-muted/50 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-foreground truncate group-hover:underline">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Description */}
          {ticket.description && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg">
                  {ticket.description}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Additional Information */}
          {(ticket.headerText || ticket.confirmationText || ticket.deliveryNote || ticket.purchaseMessage) && (
            <>
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Additional Information
                </h4>
                <div className="space-y-3 text-sm">
                  {ticket.headerText && (
                    <div>
                      <span className="font-medium">Header Text (Purchase Order):</span>
                      <p className="text-muted-foreground bg-muted/50 p-2 rounded mt-1">{ticket.headerText}</p>
                    </div>
                  )}
                  {ticket.confirmationText && (
                    <div>
                      <span className="font-medium">Header Text (Order Confirmation):</span>
                      <p className="text-muted-foreground bg-muted/50 p-2 rounded mt-1">{ticket.confirmationText}</p>
                    </div>
                  )}
                  {ticket.deliveryNote && (
                    <div>
                      <span className="font-medium">Header Text (Delivery Note):</span>
                      <p className="text-muted-foreground bg-muted/50 p-2 rounded mt-1">{ticket.deliveryNote}</p>
                    </div>
                  )}
                  {ticket.purchaseMessage && (
                    <div>
                      <span className="font-medium">Message to Purchase Department:</span>
                      <p className="text-muted-foreground bg-muted/50 p-2 rounded mt-1">{ticket.purchaseMessage}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Comments Section - Chat Interface Style */}
          <div>
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({ticket.comments?.length || 0})
            </h4>

            {/* Comments List - Chat Style */}
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto bg-gray-50 rounded-lg p-4">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment, index) => {
                  const isAdmin = comment.role === "admin" || comment.role === "system"
                  const isUser = comment.role === "user"

                  return (
                    <div
                      key={comment.id}
                      className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Avatar */}
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback
                          className={`text-xs ${isAdmin ? "bg-blue-100 text-blue-700" : "bg-gray-800 text-white"}`}
                        >
                          {getAuthorInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Message Bubble */}
                      <div className={`flex flex-col max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
                        {/* Author and Time */}
                        <div className={`flex items-center gap-2 mb-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                          <span className="text-xs font-medium text-gray-600">{comment.author}</span>
                          {getCommentRoleBadge(comment.role)}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(comment.timestamp)}
                          </div>
                        </div>

                        {/* Message Content */}
                        <div
                          className={`px-4 py-3 rounded-2xl max-w-full break-words ${
                            isUser
                              ? "bg-gray-800 text-white rounded-br-md"
                              : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{comment.message}</p>
                          {comment.edited && (
                            <p className={`text-xs mt-1 italic ${isUser ? "text-gray-300" : "text-gray-500"}`}>
                              Edited {comment.editedAt && formatTimestamp(comment.editedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Add Comment */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback
                    className={`text-xs ${
                      commentRole === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-800 text-white"
                    }`}
                  >
                    {commentRole === "admin" ? "AU" : "CU"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-600">Comment as:</span>
                    <Select value={commentRole} onValueChange={(value: "admin" | "user") => setCommentRole(value)}>
                      <SelectTrigger className="w-24 h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Type your message... (Ctrl+Enter to send)"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isSubmittingComment}
                    className="min-h-[80px] resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">Press Ctrl+Enter to send</p>
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim() || isSubmittingComment}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmittingComment ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-between items-center gap-2 p-4 bg-muted/50 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select value={currentStatus} onValueChange={handleStatusSelect}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(ticket)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={() => onDelete(ticket)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button
              onClick={handleSaveChanges}
              disabled={currentStatus === ticket.status}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
