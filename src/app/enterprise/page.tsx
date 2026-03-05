"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Building2, ShieldCheck, Users, Globe, Lock, Workflow, BarChart4, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function EnterprisePage() {
  const features = [
    {
      title: "Advanced Security",
      description: "Enterprise-grade encryption, SOC 2 compliance, and advanced threat protection for all document workflows.",
      icon: Lock
    },
    {
      title: "User Management",
      description: "Centralized control with SCIM provisioning and detailed permission levels for teams of any size.",
      icon: Users
    },
    {
      title: "Custom Workflows",
      description: "Tailor DOCFLOW to your business processes with custom API endpoints and automated integrations.",
      icon: Workflow
    },
    {
      title: "Compliance & Audit",
      description: "Full visibility into document access and modifications with comprehensive audit logs and reporting.",
      icon: BarChart4
    },
    {
      title: "Global Scalability",
      description: "Deploy across global regions with localized data residency options to meet regional regulations.",
      icon: Globe
    },
    {
      title: "Priority Support",
      description: "24/7 access to dedicated solutions engineers and technical account managers for your team.",
      icon: MessageSquare
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-24 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                <Building2 className="h-3.5 w-3.5" />
                <span>DOCFLOW Enterprise</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-headline">Scale Your Document Workflows with Confidence</h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Empower your global organization with secure, high-fidelity document intelligence and enterprise-grade controls.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-base shadow-xl">Request Enterprise Demo</Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/30 hover:bg-white/10">Download Capabilities Brief</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold font-headline">Built for the Modern Enterprise</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Everything you need to manage, secure, and automate documents at scale.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.map((feature) => (
                <div key={feature.title} className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold font-headline">Ready to transform your document workspace?</h2>
              <p className="text-muted-foreground text-lg">Join 500+ global enterprises using DOCFLOW Professional to secure their critical assets.</p>
              <Button size="lg" className="h-14 px-12 text-base shadow-xl shadow-primary/20">Get in Touch</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
