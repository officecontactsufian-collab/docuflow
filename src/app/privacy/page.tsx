"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { ShieldCheck, Lock, EyeOff, Server, Cpu, RefreshCcw, Globe, AlertCircle } from 'lucide-react';

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
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
              Industrial Data Standard v2.5. Zero-retention architecture engineered for the most sensitive document flows.
            </p>
          </div>

          <div className="grid gap-12">
            {/* Core Philosophy */}
            <section className="space-y-6">
              <div className="section-label">
                <Lock className="h-3 w-3 text-primary" />
                <span>Zero-Retention Philosophy</span>
              </div>
              <h2 className="text-2xl font-black text-accent uppercase italic tracking-tighter">We've eliminated the data layer.</h2>
              <p className="text-accent/60 font-bold leading-relaxed text-lg">
                DOCFLOW operates as a stateless bridge between your hardware and document architecture. 
                Unlike standard cloud converters, we do not store, log, or index the content of your assets. 
                Once a transformation sequence is complete, the memory buffer is auto-shredded.
              </p>
            </section>

            {/* Technical Pillars */}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Local Sandboxing",
                  desc: "Binary streams are isolated within your browser's private memory pool. No cloud-persistence protocol exists for your document data.",
                  icon: Server
                },
                {
                  title: "Memory-Level AES",
                  desc: "256-bit encryption hardening applied to all active document buffers during the transformation sequence.",
                  icon: Cpu
                },
                {
                  title: "Automated Shredding",
                  desc: "Zero-latency purging. Every memory bit utilized during your session is overwritten upon process completion or tab closure.",
                  icon: RefreshCcw
                },
                {
                  title: "ISO Standard Archival",
                  desc: "Reconstructions adhere to ISO 32000 and 19005 standards, ensuring structural integrity without tracking meta-data.",
                  icon: Globe
                }
              ].map((item) => (
                <div key={item.title} className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-accent/5 space-y-4 group hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-accent uppercase italic">{item.title}</h3>
                  <p className="text-[11px] font-bold text-accent/40 uppercase leading-relaxed tracking-tight">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Privacy Shield Specifics */}
            <section className="p-10 bg-white rounded-[3rem] shadow-2xl space-y-8 border border-accent/5">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-accent uppercase italic tracking-tighter">Detailed Privacy Specs</h2>
                <div className="h-px w-full bg-accent/5" />
              </div>
              
              <div className="grid gap-10">
                {[
                  {
                    label: "Data Ingress",
                    val: "Files are processed entirely client-side via WebAssembly when possible. For AI-assisted tasks, data is tunnelled via secure ephemeral API calls."
                  },
                  {
                    label: "Meta-Data Hardening",
                    val: "Our Privacy Shield tool permanently strips hidden tracking tags, author ID, and modification history from the document catalog."
                  },
                  {
                    label: "Third-Party Tunnels",
                    val: "We utilize Genkit and Google Gemini for AI analysis. These tunnels are configured for zero-training and data privacy."
                  },
                  {
                    label: "Audit Logs",
                    val: "We log technical telemetry (process success/fail) to improve stability, but never the content, filenames, or identity of your documents."
                  }
                ].map(item => (
                  <div key={item.label} className="flex flex-col md:flex-row gap-4 md:items-start">
                    <div className="md:w-1/3 shrink-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{item.label}</p>
                    </div>
                    <p className="text-sm font-bold text-accent/60 leading-relaxed italic">{item.val}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* GDPR Badge */}
            <div className="flex flex-wrap gap-6 items-center justify-center pt-8 opacity-40 grayscale hover:opacity-100 transition-opacity">
              {["GDPR COMPLIANT", "ISO 27001 SECURE", "SOC2 READY", "HIPAA ALIGNED"].map(badge => (
                <div key={badge} className="px-6 py-2 border border-accent/20 rounded-full text-[10px] font-black tracking-widest text-accent uppercase">{badge}</div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
