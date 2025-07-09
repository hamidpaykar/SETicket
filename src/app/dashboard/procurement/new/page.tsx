"use client"

import { FilteredTicketsView } from "@/features/procurement/components/FilteredTicketsView";

export default function NewPage() {
  return <FilteredTicketsView statuses={["New"]} title="New Tickets" />;
} 