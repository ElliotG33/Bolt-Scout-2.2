// app/pricing/page.tsx
"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    price: "$10",
    description: "Perfect for individuals and small projects",
    features: [
      "50 searches per month",
      "Basic keyword tracking",
      "Email notifications",
      "Reddit and YouTube monitoring",
      "24/7 support"
    ],
    stripeLink: "https://buy.stripe.com/28o9Eh3GC5O4few000"
  },
  {
    name: "Professional",
    id: "tier-professional",
    price: "$30",
    description: "Ideal for growing businesses",
    features: [
      "250 searches per month",
      "Advanced keyword analytics",
      "Priority email notifications",
      "All platform monitoring",
      "Custom alert frequencies",
      "API access",
      "Priority support"
    ],
    mostPopular: true,
    stripeLink: "https://buy.stripe.com/8wM6s5cd83FWaYgbIJ"
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    price: "$100",
    description: "For large organizations and agencies",
    features: [
      "Unlimited searches",
      "Real-time monitoring",
      "Advanced analytics dashboard",
      "Custom integrations",
      "Dedicated account manager",
      "White-label reports",
      "Custom API solutions",
      "24/7 priority support",
      "Team collaboration tools"
    ],
    stripeLink: "https://buy.stripe.com/cN26s5dhc1xOgiA6oq"
  }
]

export default function PricingPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-lexend text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the perfect plan for your needs. All plans include our core features with different usage limits.
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative flex flex-col justify-between p-8 ${
                tier.mostPopular ? 'border-primary/50 bg-primary/5' : ''
              }`}>
                {tier.mostPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most popular
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h2 className="text-lg font-semibold leading-8">{tier.name}</h2>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {tier.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                    <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check className="h-5 w-5 flex-none text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="mt-8"
                  variant={tier.mostPopular ? "default" : "outline"}
                  asChild
                >
                  <Link href={tier.stripeLink} target="_blank">
                    Get Started
                  </Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}