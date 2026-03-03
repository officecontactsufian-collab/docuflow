
"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { ShieldCheck, Lock, EyeOff, Server, FileCheck, HardDrive, RefreshCcw, ShieldAlert } from 'lucide-react';

export default function SecurityPage() {
  const pillars = [
    {
      title: "Zero-Retention Policy",
      description: "Documents are processed in-memory and never written to permanent storage. Once your session ends, the data is gone forever.",
      icon: EyeOff
    },
    {
      title: "Local-First Processing",
      description: "Whenever possible, document manipulation happens directly in your browser, ensuring sensitive data never even leaves your device.",
      icon: Server
    },
    {
      title: "AES-256 Encryption",
      description: "Military-grade 256-bit AES encryption is applied to all secure document transfers and protection tools.",
      icon: Lock
    },
    {
      title: "Enterprise Compliance",
      description: "Our platform is architected to meet GDPR, HIPAA, and SOC 2 requirements for professional data handling.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 bg-slate-50 border-b overflow-hidden relative">
          <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
             <ShieldCheck className="w-96 h-96" />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider border border-green-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Security First Architecture</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-headline">Privacy by Design. Security by Standard.</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                DocuFlow Professional is built on a "Trust Nothing" architecture. We provide the tools to secure your data without ever seeing it ourselves.
              </p>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="flex gap-6 group">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <pillar.icon className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-headline">{pillar.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Technical Safeguards</h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our infrastructure implements deterministic privacy controls at every layer of document processing.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-lg">Memory Buffers</h4>
                  <p className="text-slate-400 text-sm">All PDF byte arrays are processed within isolated memory buffers that are wiped immediately upon garbage collection.</p>
                </div>
                <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                    <RefreshCcw className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-lg">Zero Persistence</h4>
                  <p className="text-slate-400 text-sm">We do not log document names, metadata, or content. Only anonymous usage telemetry is recorded to improve stability.</p>
                </div>
                <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-lg">Brute Force Protection</h4>
                  <p className="text-slate-400 text-sm">Our unlock tools implement progressive delays to prevent unauthorized access via automated password guessing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
