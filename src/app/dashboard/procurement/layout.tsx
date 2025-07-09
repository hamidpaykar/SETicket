'use client';

import { TicketProvider } from "@/features/procurement/context/TicketContext";

export default function ProcurementLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <TicketProvider>{children}</TicketProvider>;
} 