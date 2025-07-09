"use client"

import { FilteredTicketsView } from "@/features/procurement/components/FilteredTicketsView";

export default function PendingApprovalPage() {
  return <FilteredTicketsView statuses={["pending"]} title="Pending Approval Tickets" />;
} 