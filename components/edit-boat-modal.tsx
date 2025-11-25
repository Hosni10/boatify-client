"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { Boat } from "@/lib/types"

interface EditBoatModalProps {
  boat: Boat
  onClose: () => void
  onUpdate: (boat: Boat) => void
}

export default function EditBoatModal({ boat, onClose, onUpdate }: EditBoatModalProps) {
  const [formData, setFormData] = useState({
    name: boat.name || "",
    type: boat.type || "",
    capacity: boat.capacity || 1,
    price: boat.price || 0,
    location: boat.location || "",
    status: boat.status || "available",
    image: boat.image || "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(boat.image || null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Update preview when boat changes
    setImagePreview(boat.image || null)
    setFormData((prev) => ({
      ...prev,
      price: boat.price || 0,
      image: boat.image || "",
    }))
  }, [boat])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" || name === "price" 
        ? value === "" ? 0 : Number(value) 
        : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData((prev) => ({ ...prev, image: base64String }))
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, image: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.type || !formData.location) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields",
      })
      return
    }

    setIsSaving(true)
    try {
      const boatId = boat._id
      if (!boatId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Boat ID is missing",
        })
        setIsSaving(false)
        return
      }

      const response = await fetch(`/api/boats/${boatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: typeof formData.price === "string" && formData.price === "" ? 0 : Number(formData.price),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to update boat",
        })
        setIsSaving(false)
        return
      }

      toast({
        title: "Success",
        description: "Boat updated successfully",
      })

      onUpdate({
        ...boat,
        ...formData,
        price: Number(formData.price),
      })
      onClose()
    } catch (error) {
      console.error("Update boat error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update boat",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md border-border max-h-[90vh] flex flex-col my-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
          <CardTitle>Edit Boat</CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Boat Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Sunset Cruiser"
                className="bg-background border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Boat Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                required
              >
                <option value="">Select type</option>
                <option value="Luxury Yacht">Luxury Yacht</option>
                <option value="Speed Boat">Speed Boat</option>
                <option value="Cabin Cruiser">Cabin Cruiser</option>
                <option value="Fishing Boat">Fishing Boat</option>
                <option value="Sailboat">Sailboat</option>
                <option value="Party Boat">Party Boat</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Capacity</label>
                <Input
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Price/Day ($)</label>
                <Input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Marina Bay"
                className="bg-background border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                required
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Boat Image</label>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-background border-border cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {imagePreview && (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-48 object-contain rounded-md border border-border bg-muted"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? "Saving..." : "Update Boat"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}








