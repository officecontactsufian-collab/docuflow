
"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ShieldCheck, Zap, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals and occasional users.",
      icon: Zap,
      features: [
        "Up to 5 documents / month",
        "Max file size 10MB",
        "Basic manipulation tools",
        "Standard processing speed",
        "Community support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "For power users and small teams.",
      icon: ShieldCheck,
      popular: true,
      features: [
        "Unlimited documents",
        "Max file size 250MB",
        "All advanced tools included",
        "Priority processing speed",
        "Direct email support",
        "Custom watermarks"
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations requiring scale and control.",
      icon: Building2,
      features: [
        "Unlimited everything",
        "SSO & SAML Integration",
        "Audit logs & Compliance reporting",
        "Dedicated account manager",
        "API access & Webhooks",
        "On-premise deployment options"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">Transparent Pricing</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that fits your professional workflow. No hidden fees, cancel any time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative flex flex-col border-border/60 shadow-xl transition-all hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-primary border-primary/20' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-2">
                    <plan.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-headline text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold font-headline">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant={plan.buttonVariant} className="w-full h-11 shadow-lg">
                    <Link href="/login">{plan.buttonText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 border border-border/60 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold font-headline">Need a custom solution?</h3>
              <p className="text-muted-foreground">Our team can design a plan tailored specifically to your organization's needs.</p>
            </div>
            <Button size="lg" variant="outline" className="min-w-[200px] h-12">Talk to an Expert</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
