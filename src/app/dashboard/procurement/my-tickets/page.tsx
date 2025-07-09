"use client"

import { FilteredTicketsView } from "@/features/procurement/components/FilteredTicketsView";

export default function MyTicketsPage() {
  return <FilteredTicketsView title="My Tickets" filterByCurrentUser />;
} 