import Link from "next/link"
import { Anchor, Calendar, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">BoatFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Manage Your Boat Rental Business Effortlessly
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              BoatFlow is the all-in-one platform for boat rental companies. Track inventory, manage bookings, and
              maximize your fleet utilization with real-time availability.
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-12 flex items-center justify-center min-h-96">
            <div className="text-center">
              <Anchor className="w-24 h-24 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Boat Fleet Management Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Why Choose BoatFlow?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description: "Real-time availability tracking and automated booking management",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Enterprise-grade security for your business data",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Instant booking confirmations and updates",
              },
              {
                icon: Anchor,
                title: "Built for Boats",
                description: "Purpose-built for the marine rental industry",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-background rounded-lg p-6 border border-border hover:border-primary transition-colors"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Boat Rental Business?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of boat rental companies using BoatFlow to streamline their operations.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Anchor className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">BoatFlow</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2025 BoatFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
