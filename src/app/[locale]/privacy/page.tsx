"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { ShieldCheck, Lock, Server, Cpu, RefreshCcw, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-xl mb-2">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Privacy Shield Protocol</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">Zero-retention architecture engineered for sensitive document flows.</p>
          </div>
          <div className="grid gap-12">
            <section className="space-y-6">
              <div className="section-label"><Lock className="h-3 w-3 text-primary" /><span>Zero-Retention Philosophy</span></div>
              <h2 className="text-2xl font-black text-accent uppercase italic tracking-tighter">We've eliminated the data layer.</h2>
              <p className="text-accent/60 font-bold leading-relaxed text-lg">DOCFLOW operates as a stateless bridge. We do not store, log, or index the content of your assets.</p>
            </section>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Local Sandboxing", desc: "Binary streams are isolated within your browser's private memory pool.", icon: Server },
                { title: "Memory-Level AES", desc: "256-bit encryption hardening applied during transformation.", icon: Cpu },
                { title: "Automated Shredding", desc: "Memory is overwritten upon process completion or tab closure.", icon: RefreshCcw },
                { title: "ISO Standard Archival", desc: "Reconstructions adhere to ISO 32000 and 19005 standards.", icon: Globe }
              ].map((item) => (
                <div key={item.title} className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-accent/5 space-y-4 group hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><item.icon className="h-6 w-6" /></div>
                  <h3 className="text-xl font-black text-accent uppercase italic">{item.title}</h3>
                  <p className="text-[11px] font-bold text-accent/40 uppercase leading-relaxed tracking-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
