"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Trash2, Save, X, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react"
import type { ProcurementTicket, MaterialItem } from "@/types"
import { toast } from "sonner"

interface ProcurementFormProps {
  onCancel: () => void
  onReset?: () => void
}

export function ProcurementForm({ onCancel, onReset }: ProcurementFormProps) {
  const [formData, setFormData] = useState<Partial<ProcurementTicket>>({
    ticketId: `PRO-${Date.now()}`,
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    materials: [],
  })

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

  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      salesCurrency: "EUR",
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
    setMaterials(materials.filter((m) => m.id !== id))
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
      date: new Date().toISOString().split("T")[0],
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
    setShowSuccessAlert(false)
    setShowErrorAlert(false)
    setErrorMessage("")
    toast.success("Form has been reset successfully!")
    if (onReset) onReset()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowSuccessAlert(false)
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
        
        // Show error toast
        toast.error("Form validation failed", {
          description: `Please fill in all required fields: ${missingFields.join(", ")}`,
          duration: 5000,
        })
        return
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save ticket
      const ticket: ProcurementTicket = {
        ...formData,
        materials,
        comments: [],
        createdAt: new Date().toISOString(),
      } as ProcurementTicket

      const existingTickets = JSON.parse(localStorage.getItem("procurement-tickets") || "[]")
      const updatedTickets = [...existingTickets, ticket]
      localStorage.setItem("procurement-tickets", JSON.stringify(updatedTickets))

      setShowSuccessAlert(true)
      setIsSubmitting(false)
      
      // Show success toast
      toast.success("Procurement ticket created successfully!", {
        description: `Ticket ID: ${formData.ticketId} has been saved.`,
        duration: 4000,
      })

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        onCancel()
      }, 3000)
    } catch (error) {
      setErrorMessage("An error occurred while creating the ticket. Please try again.")
      setShowErrorAlert(true)
      setIsSubmitting(false)
      
      // Show error toast
      toast.error("Failed to create ticket", {
        description: "An error occurred while creating the ticket. Please try again.",
        duration: 5000,
      })
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground truncate">
                Create Procurement Ticket
              </h2>
              <p className="text-muted-foreground text-sm lg:text-base mt-1">
                Fill in the procurement request details
              </p>
          </div>
            <div className="flex flex-col sm:flex-row lg:flex-shrink-0">
              <Button
                type="submit"
                className="bg-[#009999] hover:bg-[#007777] text-white w-full sm:w-auto whitespace-nowrap mb-3 sm:mb-0 sm:mr-4"
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
                className="w-full sm:w-auto bg-transparent border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950/20 whitespace-nowrap mb-3 sm:mb-0 sm:mr-4"
              >
                <RotateCcw className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Reset</span>
            </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-transparent whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Cancel</span>
            </Button>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertTitle className="text-emerald-800 dark:text-emerald-200">
              Success! Your procurement ticket has been created
            </AlertTitle>
            <AlertDescription className="text-emerald-700 dark:text-emerald-300">
              Ticket ID: {formData.ticketId} has been successfully saved. You will be redirected to the dashboard in a
              few seconds.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {showErrorAlert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to create procurement ticket</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <Card className="border-border bg-card">
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
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleInputChange("date", e.target.value)}
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

        {/* Customer Information */}
        <Card className="border-border bg-card">
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
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Sales Information</CardTitle>
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
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card className="border-border bg-card">
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
        <Card className="border-border bg-card">
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
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Materials</CardTitle>
            <CardDescription className="text-muted-foreground">
              Add materials and products for this procurement request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                type="button"
                onClick={addMaterial}
                disabled={isSubmitting}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Add Material
              </Button>

              {/* Mobile-friendly materials list */}
              <div className="space-y-4 sm:hidden">
                {materials.map((material, index) => (
                  <Card key={material.id} className="border-border bg-muted/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Material {material.position}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(material.id)}
                          disabled={materials.length === 1 || isSubmitting}
                          className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Description</Label>
                        <Input
                          value={material.description}
                          onChange={(e) => updateMaterial(material.id, "description", e.target.value)}
                          placeholder="Material description"
                          disabled={isSubmitting}
                          className="bg-background border-border text-foreground text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Material Number</Label>
                          <Input
                            value={material.materialNumber}
                            onChange={(e) => updateMaterial(material.id, "materialNumber", e.target.value)}
                            placeholder="Material #"
                            disabled={isSubmitting}
                            className="bg-background border-border text-foreground text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Quantity</Label>
                          <Input
                            value={material.quantity}
                            onChange={(e) => updateMaterial(material.id, "quantity", e.target.value)}
                            placeholder="Qty"
                            disabled={isSubmitting}
                            className="bg-background border-border text-foreground text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Currency</Label>
                          <Select
                            value={material.currency}
                            onValueChange={(value) => updateMaterial(material.id, "currency", value)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className="bg-background border-border text-foreground text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="DKK">DKK</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Cost Price</Label>
                          <Input
                            value={material.costPrice}
                            onChange={(e) => updateMaterial(material.id, "costPrice", e.target.value)}
                            placeholder="Cost price"
                            disabled={isSubmitting}
                            className="bg-background border-border text-foreground text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Sales Price</Label>
                          <Input
                            value={material.salesPrice}
                            onChange={(e) => updateMaterial(material.id, "salesPrice", e.target.value)}
                            placeholder="Sales price"
                            disabled={isSubmitting}
                            className="bg-background border-border text-foreground text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Vendor</Label>
                          <Input
                            value={material.vendor}
                            onChange={(e) => updateMaterial(material.id, "vendor", e.target.value)}
                            placeholder="Vendor"
                            disabled={isSubmitting}
                            className="bg-background border-border text-foreground text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop table view */}
              <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                      <TableHead className="text-foreground">Pos.</TableHead>
                      <TableHead className="text-foreground">Description</TableHead>
                      <TableHead className="text-foreground">Material Number</TableHead>
                      <TableHead className="text-foreground">Quantity</TableHead>
                      <TableHead className="text-foreground">Currency</TableHead>
                      <TableHead className="text-foreground">Cost Price</TableHead>
                      <TableHead className="text-foreground">Sales Price</TableHead>
                      <TableHead className="text-foreground">Vendor</TableHead>
                      <TableHead className="text-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((material) => (
                        <TableRow key={material.id} className="border-border">
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border-border bg-card">
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
      </form>
    </div>
  )
}
