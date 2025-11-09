"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface PaymentFormProps {
  bookingId: string
  amount: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function PaymentForm({ bookingId, amount, onSuccess, onError }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // TODO: Integrate with Stripe or payment processor
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount,
          paymentMethod: "credit_card",
          cardData: formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (onSuccess) onSuccess()
      } else {
        if (onError) onError(data.error)
      }
    } catch (error) {
      if (onError) onError("Payment processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </CardTitle>
        <CardDescription>Enter your payment information to complete the booking</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cardholder Name</label>
            <Input
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="John Doe"
              className="bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Card Number</label>
            <Input
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="bg-background border-border font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Expiry Date</label>
              <Input
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                className="bg-background border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">CVV</label>
              <Input
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                className="bg-background border-border font-mono"
                required
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex gap-2 text-sm">
            <Lock className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-accent">Your payment information is encrypted and secure</p>
          </div>

          {/* Amount Summary */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Booking Amount</span>
              <span className="font-semibold text-foreground">${amount.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">${amount.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
