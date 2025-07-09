"use client"

import { FilteredTicketsView } from "@/features/procurement/components/FilteredTicketsView";

export default function RejectedPage() {
  return <FilteredTicketsView statuses={["rejected", "declined"]} title="Rejected Tickets" />;
} 