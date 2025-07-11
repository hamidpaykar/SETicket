"use client"

import { useRouter } from "next/navigation"
import { ProcurementForm } from "@/features/procurement/components/procurement-form"
import PageContainer from "@/components/layout/page-container"

export default function NewProcurementPage() {
  const router = useRouter()

  const handleCancel = () => {
    router.push("/dashboard/procurement")
  }

  const handleSave = () => {
    // TODO: Add actual save logic
    router.push("/dashboard/procurement")
  }

  return (
    <PageContainer>
      <ProcurementForm onCancel={handleCancel} onSave={handleSave} />
    </PageContainer>
  )
} 