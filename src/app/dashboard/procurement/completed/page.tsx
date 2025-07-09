"use client"

import { FilteredTicketsView } from "@/features/procurement/components/FilteredTicketsView";

export default function CompletedPage() {
  return <FilteredTicketsView statuses={["completed"]} title="Completed Tickets" />;
} 