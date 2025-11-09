"use client"

import { Star, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface BoatCardProps {
  boat: {
    id: number
    name: string
    type: string
    capacity: number
    price: number
    image: string
    location: string
    rating: number
    reviews: number
    available: boolean
    features: string[]
  }
  onBook: () => void
}

export default function BoatCard({ boat, onBook }: BoatCardProps) {
  return (
    <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <img src={boat.image || "/placeholder.svg"} alt={boat.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          ${boat.price}/day
        </div>
      </div>

      {/* Content */}
      <CardContent className="pt-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground">{boat.name}</h3>
          <p className="text-sm text-muted-foreground">{boat.type}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">{boat.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({boat.reviews} reviews)</span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Up to {boat.capacity} people</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{boat.location}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {boat.features.slice(0, 2).map((feature, idx) => (
            <span key={idx} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
              {feature}
            </span>
          ))}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <Button onClick={onBook} className="w-full">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  )
}
