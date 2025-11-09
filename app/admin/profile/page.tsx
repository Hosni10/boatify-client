"use client"

import { useState, useEffect } from "react"
import { Anchor, Save, MapPin, Phone, Mail, Globe, Clock, Shield, FileText, Camera, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useLogout } from "@/hooks/use-logout"
import type { CompanyProfile } from "@/lib/types"

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<Partial<CompanyProfile>>({
    companyName: "",
    description: "",
    about: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    website: "",
    operatingHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "18:00", closed: false },
      sunday: { open: "09:00", close: "18:00", closed: false },
    },
    services: [],
    location: {
      marina: "",
      directions: "",
    },
    policies: {
      booking: "",
      cancellation: "",
      refund: "",
    },
    safetyMeasures: [],
    socialMedia: {},
    photos: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newService, setNewService] = useState("")
  const [newSafetyMeasure, setNewSafetyMeasure] = useState("")
  const [newPhoto, setNewPhoto] = useState("")
  const { toast } = useToast()
  const { handleLogout } = useLogout()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const userData = localStorage.getItem("user")
      if (!userData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to view your profile",
        })
        window.location.href = "/login"
        return
      }

      const user = JSON.parse(userData)
      const response = await fetch(`/api/company/profile?companyId=${user.companyId}`)
      const data = await response.json()

      if (data.success && data.data) {
        setProfile(data.data)
      } else {
        // Initialize with user data if profile doesn't exist
        setProfile((prev) => ({
          ...prev,
          companyId: user.companyId,
          companyName: user.companyName || "",
          email: user.email || "",
        }))
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load company profile",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const userData = localStorage.getItem("user")
      if (!userData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to save your profile",
        })
        return
      }

      const user = JSON.parse(userData)
      const response = await fetch("/api/company/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profile,
          companyId: user.companyId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Company profile saved successfully",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to save company profile",
        })
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save company profile",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addService = () => {
    if (newService.trim()) {
      setProfile((prev) => ({
        ...prev,
        services: [...(prev.services || []), newService.trim()],
      }))
      setNewService("")
    }
  }

  const removeService = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index) || [],
    }))
  }

  const addSafetyMeasure = () => {
    if (newSafetyMeasure.trim()) {
      setProfile((prev) => ({
        ...prev,
        safetyMeasures: [...(prev.safetyMeasures || []), newSafetyMeasure.trim()],
      }))
      setNewSafetyMeasure("")
    }
  }

  const removeSafetyMeasure = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      safetyMeasures: prev.safetyMeasures?.filter((_, i) => i !== index) || [],
    }))
  }

  const addPhoto = () => {
    if (newPhoto.trim()) {
      setProfile((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), newPhoto.trim()],
      }))
      setNewPhoto("")
    }
  }

  const removePhoto = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || [],
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">BoatFlow Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => (window.location.href = "/admin")}>
              Boats
            </Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/admin/reservations")}>
              Reservations
            </Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/admin/rentals")}>
              Rentals
            </Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/admin/profile")}>
              Profile
            </Button>
            <Button variant="ghost">Settings</Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Company Profile</h1>
            <p className="text-muted-foreground">Manage your company information and details</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your company's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Company Name</label>
                  <Input
                    value={profile.companyName || ""}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    placeholder="Your Boat Rental Company"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="contact@company.com"
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Short Description</label>
                <Input
                  value={profile.description || ""}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  placeholder="Brief description of your company"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">About Us</label>
                <Textarea
                  value={profile.about || ""}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                  placeholder="Tell customers about your company..."
                  rows={5}
                  className="bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <Input
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Website</label>
                  <Input
                    value={profile.website || ""}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://www.company.com"
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address</label>
                <Input
                  value={profile.address || ""}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="123 Marina Street"
                  className="bg-background border-border"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">City</label>
                  <Input
                    value={profile.city || ""}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="City"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">State</label>
                  <Input
                    value={profile.state || ""}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    placeholder="State"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Zip Code</label>
                  <Input
                    value={profile.zipCode || ""}
                    onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                    placeholder="12345"
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Country</label>
                <Input
                  value={profile.country || ""}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  placeholder="Country"
                  className="bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Marina */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location & Marina
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Marina Name</label>
                <Input
                  value={profile.location?.marina || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      location: { ...profile.location, marina: e.target.value },
                    })
                  }
                  placeholder="Marina Bay"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Directions</label>
                <Textarea
                  value={profile.location?.directions || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      location: { ...profile.location, directions: e.target.value },
                    })
                  }
                  placeholder="How to reach the marina..."
                  rows={3}
                  className="bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(profile.operatingHours || {}).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-foreground capitalize">{day}</div>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={hours.open || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          operatingHours: {
                            ...profile.operatingHours,
                            [day]: { ...hours, open: e.target.value },
                          },
                        })
                      }
                      disabled={hours.closed}
                      className="bg-background border-border"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={hours.close || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          operatingHours: {
                            ...profile.operatingHours,
                            [day]: { ...hours, close: e.target.value },
                          },
                        })
                      }
                      disabled={hours.closed}
                      className="bg-background border-border"
                    />
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={hours.closed}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            operatingHours: {
                              ...profile.operatingHours,
                              [day]: { ...hours, closed: e.target.checked },
                            },
                          })
                        }
                        className="rounded"
                      />
                      Closed
                    </label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
              <CardDescription>List the services your company provides</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Add a service (e.g., Hourly boat rentals)"
                  className="bg-background border-border"
                  onKeyPress={(e) => e.key === "Enter" && addService()}
                />
                <Button onClick={addService} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.services?.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-md px-3 py-1"
                  >
                    <span className="text-sm text-foreground">{service}</span>
                    <button
                      onClick={() => removeService(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Measures */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safety Measures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSafetyMeasure}
                  onChange={(e) => setNewSafetyMeasure(e.target.value)}
                  placeholder="Add a safety measure"
                  className="bg-background border-border"
                  onKeyPress={(e) => e.key === "Enter" && addSafetyMeasure()}
                />
                <Button onClick={addSafetyMeasure} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.safetyMeasures?.map((measure, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-md px-3 py-1"
                  >
                    <span className="text-sm text-foreground">{measure}</span>
                    <button
                      onClick={() => removeSafetyMeasure(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Booking Policy</label>
                <Textarea
                  value={profile.policies?.booking || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      policies: { ...profile.policies, booking: e.target.value },
                    })
                  }
                  placeholder="Your booking policy..."
                  rows={3}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cancellation Policy</label>
                <Textarea
                  value={profile.policies?.cancellation || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      policies: { ...profile.policies, cancellation: e.target.value },
                    })
                  }
                  placeholder="Your cancellation policy..."
                  rows={3}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Refund Policy</label>
                <Textarea
                  value={profile.policies?.refund || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      policies: { ...profile.policies, refund: e.target.value },
                    })
                  }
                  placeholder="Your refund policy..."
                  rows={3}
                  className="bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Your social media links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Facebook</label>
                  <Input
                    value={profile.socialMedia?.facebook || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socialMedia: { ...profile.socialMedia, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/yourcompany"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Instagram</label>
                  <Input
                    value={profile.socialMedia?.instagram || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socialMedia: { ...profile.socialMedia, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/yourcompany"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Twitter</label>
                  <Input
                    value={profile.socialMedia?.twitter || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socialMedia: { ...profile.socialMedia, twitter: e.target.value },
                      })
                    }
                    placeholder="https://twitter.com/yourcompany"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">YouTube</label>
                  <Input
                    value={profile.socialMedia?.youtube || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socialMedia: { ...profile.socialMedia, youtube: e.target.value },
                      })
                    }
                    placeholder="https://youtube.com/yourcompany"
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Company Photos
              </CardTitle>
              <CardDescription>Add URLs to your company photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  placeholder="Photo URL"
                  className="bg-background border-border"
                  onKeyPress={(e) => e.key === "Enter" && addPhoto()}
                />
                <Button onClick={addPhoto} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {profile.photos?.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Company photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md border border-border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg"
                      }}
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

