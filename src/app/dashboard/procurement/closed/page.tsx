"use client"

import { FilteredTicketsView } from "@/features/procurement/components/FilteredTicketsView";

export default function ClosedPage() {
  return <FilteredTicketsView statuses={["closed"]} title="Closed Tickets" />;
} 