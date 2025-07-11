"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Trash2, Save, ArrowLeft, AlertCircle, RotateCcw, Upload, ClipboardCopy } from "lucide-react"
import type { ProcurementTicket, MaterialItem } from "@/types/procurement"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { motion, AnimatePresence } from "framer-motion"
import { FileUpload } from "@/components/ui/file-upload"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProcurementFormProps {
  onCancel: () => void
  onSave?: (ticket: ProcurementTicket) => void
  onReset?: () => void
}

export function ProcurementForm({ onCancel, onSave, onReset }: ProcurementFormProps) {
  const [formData, setFormData] = useState<Partial<ProcurementTicket>>({
    ticketId: `PRO-${Date.now()}`,
    status: "pending",
    date: new Date().toLocaleDateString("en-GB"),
    materials: [],
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: "1",
      position: "A1",
      description: "",
      materialNumber: "",
      quantity: "",
      currency: "EUR",
      costPrice: "",
      salesCurrency: "EUR",
      salesPrice: "",
      vendor: "",
      vendorNumber: "",
      offerNumber: "",
      requestedDeliveryDate: "",
      confirmedDeliveryDate: "",
      purchaseOrderNo: "",
    },
  ])

  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const excelFileRef = useRef<HTMLInputElement>(null)

  const handleBulkCopy = async (columnKey: keyof MaterialItem) => {
    if (materials.length === 0) {
      toast.info("No materials available to copy.")
      return
    }

    const columnDisplayNames: Record<string, string> = {
      description: "Description",
      materialNumber: "Material Number",
      quantity: "Quantity",
      currency: "Currency",
      costPrice: "Cost Price",
      salesPrice: "Sales Price",
      vendor: "Vendor",
    }

    const values = materials.map((material) => material[columnKey])
    const textToCopy = values.join("\n")
    const displayName = columnDisplayNames[columnKey] || String(columnKey)

    if (!textToCopy.trim()) {
      toast.info(`Column "${displayName}" is empty.`)
      return
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      toast.success(`Copied "${displayName}" column to clipboard!`)
    } catch (err) {
      console.error("Failed to copy:", err)
      toast.error("Could not copy to clipboard.")
    }
  }

  const handleConfirmResetMaterials = () => {
    setMaterials([
      {
        id: "1",
        position: "A1",
        description: "",
        materialNumber: "",
        quantity: "",
        currency: "EUR",
        costPrice: "",
        salesCurrency: "EUR",
        salesPrice: "",
        vendor: "",
        vendorNumber: "",
        offerNumber: "",
        requestedDeliveryDate: "",
        confirmedDeliveryDate: "",
        purchaseOrderNo: "",
      },
    ])
    toast.success("Materials Reset", {
      description: "The materials list has been reset.",
    })
  }

  const handleExcelImportClick = () => {
    excelFileRef.current?.click()
  }

  const handleExcelFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const toastId = toast.loading("Importing materials from Excel file...")

    try {
      const materials = await new Promise<MaterialItem[]>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const data = e.target?.result
            if (!data) {
              return reject(new Error("Failed to read file data."))
            }
            const workbook = XLSX.read(data, { type: "array" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]

            // Validate headers
            const expectedHeaders = [
              "position",
              "description",
              "material number",
              "quantity",
              "currency",
              "cost price",
              "sales price",
              "vendor",
            ]
            const headerRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0 })
            if (headerRows.length === 0) {
              return reject(new Error("The Excel file appears to be empty."))
            }
            const actualHeaders = (headerRows[0] as any[]).map((h) => String(h || "").trim().toLowerCase())

            const areHeadersValid =
              expectedHeaders.length === actualHeaders.length &&
              expectedHeaders.every((expectedHeader, i) => expectedHeader === actualHeaders[i])

            if (!areHeadersValid) {
              const missing = expectedHeaders.filter((h) => !actualHeaders.includes(h))
              const extra = actualHeaders.filter((h) => !expectedHeaders.includes(h))
              const errorParts = []
              if (missing.length > 0) {
                errorParts.push(`Missing: ${missing.join(", ")}`)
              }
              if (extra.length > 0) {
                errorParts.push(`Extra: ${extra.join(", ")}`)
              }
              let finalMessage = "Invalid Excel format. Check column order."
              if (errorParts.length > 0) {
                finalMessage = errorParts.join(". ")
              }
              return reject(new Error(finalMessage))
            }

            const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, {
              header: [
                "position",
                "description",
                "materialNumber",
                "quantity",
                "currency",
                "costPrice",
                "salesPrice",
                "vendor",
              ],
              range: 1, // Skip header row
            })

            const filteredData = jsonData.filter(
              (row) =>
                row.description ||
                row.materialNumber ||
                row.quantity ||
                row.currency ||
                row.costPrice ||
                row.salesPrice ||
                row.vendor
            )

            if (filteredData.length === 0) {
              return reject(new Error("No data found in the Excel file. Please ensure it is formatted correctly."))
            }

            let processedData = filteredData
            if (filteredData.length > 30) {
              toast.warning("Import Limit Reached", {
                description: "The Excel file contains more than 30 items. Only the first 30 have been imported.",
              })
              processedData = filteredData.slice(0, 30)
            }

            const newMaterials: MaterialItem[] = processedData.map((row, index) => ({
              id: `${Date.now()}-${index}`,
              position: `A${index + 1}`,
              description: row.description?.toString() ?? "",
              materialNumber: row.materialNumber?.toString() ?? "",
              quantity: row.quantity?.toString() ?? "",
              currency: row.currency?.toString() ?? "EUR",
              costPrice: row.costPrice?.toString() ?? "",
              salesPrice: row.salesPrice?.toString() ?? "",
              vendor: row.vendor?.toString() ?? "",
              salesCurrency: "EUR", // Default value
              vendorNumber: "", // Default value
              offerNumber: "", // Default value
              requestedDeliveryDate: "", // Default value
              confirmedDeliveryDate: "", // Default value
              purchaseOrderNo: "", // Default value
            }))

            resolve(newMaterials)
          } catch (error) {
            reject(error instanceof Error ? error : new Error("An unknown error occurred during file processing."))
          }
        }

        reader.onerror = (error) => {
          console.error("File reading error:", error)
          reject(new Error("Failed to read the file."))
        }

        reader.readAsArrayBuffer(file)
      })

      setMaterials(materials)

      toast.success(`Successfully imported ${materials.length} material items.`, {
        id: toastId,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred."
      toast.error(message, {
        id: toastId,
        duration: 8000,
      })
    }

    // Reset file input to allow re-uploading the same file
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addMaterial = () => {
    const newMaterial: MaterialItem = {
      id: Date.now().toString(),
      position: `A${materials.length + 1}`,
      description: "",
      materialNumber: "",
      quantity: "",
      currency: "EUR",
      costPrice: "",
      salesCurrency: "",
      salesPrice: "",
      vendor: "",
      vendorNumber: "",
      offerNumber: "",
      requestedDeliveryDate: "",
      confirmedDeliveryDate: "",
      purchaseOrderNo: "",
    }
    setMaterials([...materials, newMaterial])
  }

  const removeMaterial = (id: string) => {
    const updatedMaterials = materials
      .filter((m) => m.id !== id)
      .map((material, index) => ({
        ...material,
        position: `A${index + 1}`,
      }))
    setMaterials(updatedMaterials)
  }

  const updateMaterial = (id: string, field: string, value: string) => {
    setMaterials(materials.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const handleResetClick = () => {
    toast("Reset Form?", {
      description: "This will clear all form data and reset all fields to their default values.",
      action: {
        label: "Reset",
        onClick: () => handleResetConfirm(),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    })
  }

  const handleResetConfirm = () => {
    setFormData({
      ticketId: `PRO-${Date.now()}`,
      status: "pending",
      date: new Date().toLocaleDateString("en-GB"),
      materials: [],
    })
    setMaterials([
      {
        id: "1",
        position: "A1",
        description: "",
        materialNumber: "",
        quantity: "",
        currency: "EUR",
        costPrice: "",
        salesCurrency: "",
        salesPrice: "",
        vendor: "",
        vendorNumber: "",
        offerNumber: "",
        requestedDeliveryDate: "",
        confirmedDeliveryDate: "",
        purchaseOrderNo: "",
      },
    ])
    setShowErrorAlert(false)
    setErrorMessage("")
    toast.success("Form Reset", {
      description: "All form fields have been reset to their default values.",
    })
    if (onReset) onReset()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowErrorAlert(false)

    try {
      // Validate required fields
      const requiredFields = [
        "salesManager",
        "telefon",
        "profitcenter",
        "date",
        "customerName",
        "customerCVR",
        "customerOrderNumber",
        "salesOrg",
        "distributionChannel",
        "salesOffice",
        "salesGroup",
        "localReportingCode",
        "prodHierarchy",
        "company",
        "attention",
        "department",
        "roadNumber",
      ]

      const missingFields = requiredFields.filter((field) => !formData[field as keyof ProcurementTicket])

      if (missingFields.length > 0) {
        setErrorMessage(`Please fill in all required fields: ${missingFields.join(", ")}`)
        setShowErrorAlert(true)
        setIsSubmitting(false)
        toast.error("Form Validation Failed", {
          description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        })
        return
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create ticket with all data
      const ticket: ProcurementTicket = {
        ...formData,
        id: formData.ticketId || `PRO-${Date.now()}`,
        title: `${formData.customerName} - ${formData.department}` || "New Procurement Request",
        amount: materials.reduce((sum, m) => sum + (Number.parseFloat(m.salesPrice) || 0), 0),
        priority: "medium",
        createdDate: formData.date || new Date().toISOString().split("T")[0],
        description: formData.purchaseMessage || "Procurement request",
        materials,
        comments: [], // Initialize with empty comments array
        attachments: uploadedFiles, // Add uploaded files
        createdAt: new Date().toISOString(),
      } as ProcurementTicket

      setIsSubmitting(false)

      // Show success toast
      toast.success("Ticket Created!", {
        description: `Procurement ticket ${formData.ticketId} has been successfully created.`,
      })

      // Call onSave callback if provided
      if (onSave) {
        onSave(ticket)
      }
    } catch (error) {
      setErrorMessage("An error occurred while creating the ticket. Please try again.")
      setShowErrorAlert(true)
      setIsSubmitting(false)
      toast.error("Creation Failed", {
        description: "Unable to create the procurement ticket. Please check your information and try again.",
      })
    }
  }

  return (
    <div className="w-full h-full animate-in slide-in-from-right-4 duration-500">
      <form onSubmit={handleSubmit} className="space-y-6 w-full h-full flex flex-col">
        {/* Header with Back Button */}
        <div className="flex-shrink-0">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Overview
                </Button>
                <div className="h-6 w-px bg-border" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground truncate">
                    Create New Ticket
                  </h2>
                  <p className="text-muted-foreground text-sm lg:text-base mt-1">
                    Fill in the procurement request details
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-shrink-0 gap-2">
                <Button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white w-full sm:w-auto whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{isSubmitting ? "Creating..." : "Save Ticket"}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetClick}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700 whitespace-nowrap"
                >
                  <RotateCcw className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Reset</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {showErrorAlert && (
            <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unable to create procurement ticket</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Form Content - Scrollable with staggered animations */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-6">
          {/* Basic Information */}
          <Card className="border-border bg-card animate-in slide-in-from-bottom-4 duration-700 delay-100">
            <CardHeader>
              <CardTitle className="text-foreground">Basic Information</CardTitle>
              <CardDescription className="text-muted-foreground">Required fields are marked with *</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salesManager" className="text-foreground text-sm font-medium">
                  Sales Manager (Init.) *
                </Label>
                <Input
                  id="salesManager"
                  value={formData.salesManager || ""}
                  onChange={(e) => handleInputChange("salesManager", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personnelNumber" className="text-foreground text-sm font-medium">
                  Personnel Number
                </Label>
                <Input
                  id="personnelNumber"
                  value={formData.personnelNumber || ""}
                  onChange={(e) => handleInputChange("personnelNumber", e.target.value)}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefon" className="text-foreground text-sm font-medium">
                  Telefon (Local) *
                </Label>
                <Input
                  id="telefon"
                  value={formData.telefon || ""}
                  onChange={(e) => handleInputChange("telefon", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profitcenter" className="text-foreground text-sm font-medium">
                  Profitcenter *
                </Label>
                <Input
                  id="profitcenter"
                  value={formData.profitcenter || ""}
                  onChange={(e) => handleInputChange("profitcenter", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground text-sm font-medium">
                  Date *
                </Label>
                <Input
                  id="date"
                  type="text"
                  value={formData.date || ""}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                  disabled
                  className="bg-background border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-border bg-card animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <CardHeader>
              <CardTitle className="text-foreground">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-foreground text-sm font-medium">
                  Customer Name *
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName || ""}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerCVR" className="text-foreground text-sm font-medium">
                  Customer CVR/EAN *
                </Label>
                <Input
                  id="customerCVR"
                  value={formData.customerCVR || ""}
                  onChange={(e) => handleInputChange("customerCVR", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerOrderNumber" className="text-foreground text-sm font-medium">
                  Customer Order Number *
                </Label>
                <Input
                  id="customerOrderNumber"
                  value={formData.customerOrderNumber || ""}
                  onChange={(e) => handleInputChange("customerOrderNumber", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioElement" className="text-foreground text-sm font-medium">
                  Portfolio Element
                </Label>
                <Input
                  id="portfolioElement"
                  value={formData.portfolioElement || ""}
                  onChange={(e) => handleInputChange("portfolioElement", e.target.value)}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sales Information */}
          <Card className="border-border bg-card animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <CardHeader>
              <CardTitle className="text-foreground">Siemens Energy A/S Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salesOrg" className="text-foreground text-sm font-medium">
                  Sales Organization *
                </Label>
                <Input
                  id="salesOrg"
                  value={formData.salesOrg || ""}
                  onChange={(e) => handleInputChange("salesOrg", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributionChannel" className="text-foreground text-sm font-medium">
                  Distribution Channel *
                </Label>
                <Input
                  id="distributionChannel"
                  value={formData.distributionChannel || ""}
                  onChange={(e) => handleInputChange("distributionChannel", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesOffice" className="text-foreground text-sm font-medium">
                  Sales Office *
                </Label>
                <Input
                  id="salesOffice"
                  value={formData.salesOffice || ""}
                  onChange={(e) => handleInputChange("salesOffice", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesGroup" className="text-foreground text-sm font-medium">
                  Sales Group *
                </Label>
                <Input
                  id="salesGroup"
                  value={formData.salesGroup || ""}
                  onChange={(e) => handleInputChange("salesGroup", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localReportingCode" className="text-foreground text-sm font-medium">
                  Local Reporting Code *
                </Label>
                <Input
                  id="localReportingCode"
                  value={formData.localReportingCode || ""}
                  onChange={(e) => handleInputChange("localReportingCode", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prodHierarchy" className="text-foreground text-sm font-medium">
                  Product Hierarchy *
                </Label>
                <Input
                  id="prodHierarchy"
                  value={formData.prodHierarchy || ""}
                  onChange={(e) => handleInputChange("prodHierarchy", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="euTaxonomy" className="text-foreground text-sm font-medium">
                  EU-Taxonomy Code
                </Label>
                <Input
                  id="euTaxonomy"
                  value={formData.euTaxonomy || ""}
                  onChange={(e) => handleInputChange("euTaxonomy", e.target.value)}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="border-border bg-card animate-in slide-in-from-bottom-4 duration-700 delay-[400ms]">
            <CardHeader>
              <CardTitle className="text-foreground">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground text-sm font-medium">
                  Company *
                </Label>
                <Input
                  id="company"
                  value={formData.company || ""}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attention" className="text-foreground text-sm font-medium">
                  Attention *
                </Label>
                <Input
                  id="attention"
                  value={formData.attention || ""}
                  onChange={(e) => handleInputChange("attention", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-foreground text-sm font-medium">
                  Department *
                </Label>
                <Input
                  id="department"
                  value={formData.department || ""}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roadNumber" className="text-foreground text-sm font-medium">
                  Road & Number *
                </Label>
                <Input
                  id="roadNumber"
                  value={formData.roadNumber || ""}
                  onChange={(e) => handleInputChange("roadNumber", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postcode" className="text-foreground text-sm font-medium">
                  Postcode
                </Label>
                <Input
                  id="postcode"
                  value={formData.postcode || ""}
                  onChange={(e) => handleInputChange("postcode", e.target.value)}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cityLand" className="text-foreground text-sm font-medium">
                  City/Land
                </Label>
                <Input
                  id="cityLand"
                  value={formData.cityLand || ""}
                  onChange={(e) => handleInputChange("cityLand", e.target.value)}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-foreground text-sm font-medium">
                  Email for Contact - Delivery
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incoterms" className="text-foreground text-sm font-medium">
                  Incoterms
                </Label>
                <Select
                  value={formData.incoterms || ""}
                  onValueChange={(value) => handleInputChange("incoterms", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select Incoterms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAP">DAP</SelectItem>
                    <SelectItem value="DDP">DDP</SelectItem>
                    <SelectItem value="EXW">EXW</SelectItem>
                    <SelectItem value="FCA">FCA</SelectItem>
                    <SelectItem value="CPT">CPT</SelectItem>
                    <SelectItem value="CIP">CIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Address */}
          <Card className="border-border bg-card animate-in slide-in-from-bottom-4 duration-700 delay-500">
            <CardHeader>
              <CardTitle className="text-foreground">Customer Invoice Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="invoiceAddress" className="text-foreground text-sm font-medium">
                  Invoice Address
                </Label>
                <Textarea
                  id="invoiceAddress"
                  value={formData.invoiceAddress || ""}
                  onChange={(e) => handleInputChange("invoiceAddress", e.target.value)}
                  rows={3}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Materials */}
          <Card className="border-border bg-card animate-in slide-in-from-bottom-4 duration-700 delay-[600ms]">
            <CardHeader>
              <CardTitle className="text-foreground">Materials</CardTitle>
              <CardDescription className="text-muted-foreground">
                Add materials and products for this procurement request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Button
                    type="button"
                    onClick={addMaterial}
                    disabled={isSubmitting}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Material
                  </Button>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={handleExcelImportClick}
                      disabled={isSubmitting}
                      className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Upload className="h-4 w-4" />
                      Import from Excel
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSubmitting}
                          className="text-destructive border-destructive hover:bg-destructive/10 flex items-center gap-2 w-full sm:w-auto"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset Materials
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will clear all material entries and reset to one empty row. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleConfirmResetMaterials}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <input
                      type="file"
                      ref={excelFileRef}
                      onChange={handleExcelFileChange}
                      className="hidden"
                      accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                  </div>
                </div>

                {/* Desktop table view */}
                <div className="overflow-x-auto hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-foreground">Pos.</TableHead>
                        <TableHead className="text-foreground">
                          <div className="flex items-center gap-1">
                            Description
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleBulkCopy("description")}
                            >
                              <ClipboardCopy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground">
                          <div className="flex items-center gap-1">
                            Material Number
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleBulkCopy("materialNumber")}
                            >
                              <ClipboardCopy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground">
                          <div className="flex items-center gap-1">
                            Quantity
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleBulkCopy("quantity")}
                            >
                              <ClipboardCopy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground">
                          <div className="flex items-center gap-1">
                            Currency
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleBulkCopy("currency")}
                            >
                              <ClipboardCopy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground">
                          <div className="flex items-center gap-1">
                            Cost Price
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleBulkCopy("costPrice")}
                            >
                              <ClipboardCopy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground">
                          <div className="flex items-center gap-1">
                            Sales Price
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleBulkCopy("salesPrice")}
                            >
                              <ClipboardCopy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground">
                          <div className="flex items-center gap-1">
                            Vendor
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleBulkCopy("vendor")}
                            >
                              <ClipboardCopy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {materials.map((material) => (
                          <motion.tr
                            key={material.id}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="border-border"
                          >
                            <TableCell className="text-foreground">{material.position}</TableCell>
                            <TableCell>
                              <Input
                                value={material.description}
                                onChange={(e) => updateMaterial(material.id, "description", e.target.value)}
                                placeholder="Material description"
                                disabled={isSubmitting}
                                className="bg-background border-border text-foreground"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={material.materialNumber}
                                onChange={(e) => updateMaterial(material.id, "materialNumber", e.target.value)}
                                placeholder="Material number"
                                disabled={isSubmitting}
                                className="bg-background border-border text-foreground"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={material.quantity}
                                onChange={(e) => updateMaterial(material.id, "quantity", e.target.value)}
                                placeholder="Qty"
                                disabled={isSubmitting}
                                className="bg-background border-border text-foreground"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={material.currency}
                                onValueChange={(value) => updateMaterial(material.id, "currency", value)}
                                disabled={isSubmitting}
                              >
                                <SelectTrigger className="bg-background border-border text-foreground">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="DKK">DKK</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={material.costPrice}
                                onChange={(e) => updateMaterial(material.id, "costPrice", e.target.value)}
                                placeholder="Cost price"
                                disabled={isSubmitting}
                                className="bg-background border-border text-foreground"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={material.salesPrice}
                                onChange={(e) => updateMaterial(material.id, "salesPrice", e.target.value)}
                                placeholder="Sales price"
                                disabled={isSubmitting}
                                className="bg-background border-border text-foreground"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={material.vendor}
                                onChange={(e) => updateMaterial(material.id, "vendor", e.target.value)}
                                placeholder="Vendor"
                                disabled={isSubmitting}
                                className="bg-background border-border text-foreground"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMaterial(material.id)}
                                disabled={materials.length === 1 || isSubmitting}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile card view */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  <AnimatePresence>
                    {materials.map((material, index) => (
                      <motion.div
                        key={material.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <Card
                          className="border-border bg-card/50"
                        >
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-foreground">Material {index + 1}</CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMaterial(material.id)}
                                disabled={materials.length === 1 || isSubmitting}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`desc-${material.id}`} className="text-foreground text-sm font-medium">
                                Description
                              </Label>
                              <Input
                                id={`desc-${material.id}`}
                                value={material.description}
                                onChange={(e) => updateMaterial(material.id, "description", e.target.value)}
                                placeholder="Material description"
                                disabled={isSubmitting}
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`mat-num-${material.id}`} className="text-foreground text-sm font-medium">
                                Material Number
                              </Label>
                              <Input
                                id={`mat-num-${material.id}`}
                                value={material.materialNumber}
                                onChange={(e) => updateMaterial(material.id, "materialNumber", e.target.value)}
                                placeholder="Material number"
                                disabled={isSubmitting}
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`qty-${material.id}`} className="text-foreground text-sm font-medium">
                                  Quantity
                                </Label>
                                <Input
                                  id={`qty-${material.id}`}
                                  value={material.quantity}
                                  onChange={(e) => updateMaterial(material.id, "quantity", e.target.value)}
                                  placeholder="Qty"
                                  disabled={isSubmitting}
                                  className="bg-background border-border text-foreground"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`currency-${material.id}`} className="text-foreground text-sm font-medium">
                                  Currency
                                </Label>
                                <Select
                                  value={material.currency}
                                  onValueChange={(value) => updateMaterial(material.id, "currency", value)}
                                  disabled={isSubmitting}
                                >
                                  <SelectTrigger
                                    id={`currency-${material.id}`}
                                    className="bg-background border-border text-foreground"
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="DKK">DKK</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`cost-${material.id}`} className="text-foreground text-sm font-medium">
                                  Cost Price
                                </Label>
                                <Input
                                  id={`cost-${material.id}`}
                                  value={material.costPrice}
                                  onChange={(e) => updateMaterial(material.id, "costPrice", e.target.value)}
                                  placeholder="Cost price"
                                  disabled={isSubmitting}
                                  className="bg-background border-border text-foreground"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`sales-${material.id}`} className="text-foreground text-sm font-medium">
                                  Sales Price
                                </Label>
                                <Input
                                  id={`sales-${material.id}`}
                                  value={material.salesPrice}
                                  onChange={(e) => updateMaterial(material.id, "salesPrice", e.target.value)}
                                  placeholder="Sales price"
                                  disabled={isSubmitting}
                                  className="bg-background border-border text-foreground"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`vendor-${material.id}`} className="text-foreground text-sm font-medium">
                                Vendor
                              </Label>
                              <Input
                                id={`vendor-${material.id}`}
                                value={material.vendor}
                                onChange={(e) => updateMaterial(material.id, "vendor", e.target.value)}
                                placeholder="Vendor"
                                disabled={isSubmitting}
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-border bg-card animate-in slide-in-from-bottom-4 duration-700 delay-700">
            <CardHeader>
              <CardTitle className="text-foreground">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headerText" className="text-foreground text-sm font-medium">
                  Header Text on Purchase Order
                </Label>
                <Textarea
                  id="headerText"
                  value={formData.headerText || ""}
                  onChange={(e) => handleInputChange("headerText", e.target.value)}
                  rows={2}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmationText" className="text-foreground text-sm font-medium">
                  Header Text on Order Confirmation
                </Label>
                <Textarea
                  id="confirmationText"
                  value={formData.confirmationText || ""}
                  onChange={(e) => handleInputChange("confirmationText", e.target.value)}
                  rows={2}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryNote" className="text-foreground text-sm font-medium">
                  Header Text on Delivery Note
                </Label>
                <Textarea
                  id="deliveryNote"
                  value={formData.deliveryNote || ""}
                  onChange={(e) => handleInputChange("deliveryNote", e.target.value)}
                  rows={2}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseMessage" className="text-foreground text-sm font-medium">
                  Message to Purchase Department
                </Label>
                <Textarea
                  id="purchaseMessage"
                  value={formData.purchaseMessage || ""}
                  onChange={(e) => handleInputChange("purchaseMessage", e.target.value)}
                  rows={3}
                  disabled={isSubmitting}
                  className="bg-background border-border text-foreground resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="border-border bg-card animate-in slide-in-from-bottom-4 duration-700 delay-800">
            <CardHeader>
              <CardTitle className="text-foreground">File Attachments</CardTitle>
              <CardDescription className="text-muted-foreground">
                Upload any relevant documents, quotes, or images.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onChange={setUploadedFiles} />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
