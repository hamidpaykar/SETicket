"use client"

import { FilteredTicketsView } from "@/features/procurement/components/FilteredTicketsView";

export default function InProgressPage() {
  return <FilteredTicketsView statuses={["in-progress"]} title="In Progress Tickets" />;
} 