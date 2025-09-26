import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Find the right FakeCheck plan for your needs. From our free demo to enterprise-level solutions.",
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For trying out the platform and low-volume personal use.",
    features: [
      "100 API calls/month",
      "Demo watermark on results",
      "Web interface access",
      "Community support",
    ],
    cta: "Try Live Demo",
    href: "/demo",
    variant: "outline",
  },
  {
    name: "Developer",
    price: "$99",
    priceSuffix: "/ month",
    description: "For developers and small teams integrating detection into their apps.",
    features: [
      "10,000 API calls/month",
      "No watermarks",
      "Full API & SDK access",
      "Email support",
    ],
    cta: "Get API Key",
    href: "/contact",
    variant: "default",
    isPrimary: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale platforms, law enforcement, and critical infrastructure.",
    features: [
      "Unlimited API calls",
      "Custom throughput & SLAs",
      "On-premise deployment option",
      "Dedicated 24/7 support & TAM",
    ],
    cta: "Request Trial",
    href: "/contact",
    variant: "outline",
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Find the Right Plan for You
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Scalable pricing for every use case, from individual developers to global enterprises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col glassmorphism ${tier.isPrimary ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
            <CardHeader>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.priceSuffix && <span className="text-muted-foreground">{tier.priceSuffix}</span>}
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className={`w-full ${tier.isPrimary ? 'btn-gradient' : ''}`} variant={tier.isPrimary ? 'default' : 'outline'}>
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
