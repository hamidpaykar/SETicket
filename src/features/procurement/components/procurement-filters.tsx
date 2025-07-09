"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Filter, Search, X } from "lucide-react"
import type { StatusCounts } from "@/types/procurement"
import { toast } from "sonner"

interface ProcurementFiltersProps {
  statusFilter: string
  setStatusFilter: (status: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusCounts: StatusCounts
}

export function ProcurementFilters({
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  statusCounts,
}: ProcurementFiltersProps) {
  const handleFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter)
    const filterLabel = newFilter === "all" ? "All Tickets" : newFilter.replace("-", " ")
    toast.info("Filter Applied", {
      description: `Now showing ${filterLabel.toLowerCase()}.`,
    })
  }

  const handleSearchClear = () => {
    setSearchTerm("")
    toast.info("Search Cleared", {
      description: "Search filter has been removed.",
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full sm:w-[300px] pr-8"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearchClear}
            className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            {statusFilter === "all"
              ? "All Status"
              : statusFilter === "in-progress"
                ? "In Progress"
                : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]" align="end">
          <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleFilterChange}>
            <DropdownMenuRadioItem value="all">All Tickets ({statusCounts.all})</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pending">Pending ({statusCounts.pending})</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="in-progress">
              In Progress ({statusCounts["in-progress"]})
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="approved">Approved ({statusCounts.approved})</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="rejected">Rejected ({statusCounts.rejected})</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
