"use client"

import { FilteredTicketsView } from "@/features/procurement/components/FilteredTicketsView";

export default function ApprovedPage() {
  return <FilteredTicketsView statuses={["approved"]} title="Approved Tickets" />;
} 