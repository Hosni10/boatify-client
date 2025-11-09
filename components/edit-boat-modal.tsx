"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface Boat {
  _id?: string
  id?: number | string
  name: string
  type: string
  capacity: number
  price: number
  location: string
  status?: "available" | "rented" | "maintenance"
  features?: string[]
  image?: string
  rating?: number
  reviews?: number
  bookings?: number
  revenue?: number
}

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
  })
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" || name === "price" ? Number(value) : value,
    }))
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
      const boatId = boat._id || boat.id
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
        body: JSON.stringify(formData),
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

      onUpdate({ ...boat, ...formData })
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Edit Boat</CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
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
                  value={formData.price}
                  onChange={handleChange}
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

