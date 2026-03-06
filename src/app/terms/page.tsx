"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Gavel, ShieldCheck, Scale, FileWarning, AlertCircle, Info } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Scale className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Terms of Operation</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
              Industrial Usage Framework v1.2. Protocol standards for professional document intelligence and transformation.
            </p>
          </div>

          <div className="grid gap-12">
            {[
              {
                title: "01. Protocol Acceptance",
                icon: ShieldCheck,
                content: "By initializing any DOCFLOW transformation sequence, you agree to these Terms of Operation. These terms constitute a legally binding agreement between the legal entity (User) and DOCFLOW Professional."
              },
              {
                title: "02. Responsible Intelligence",
                icon: AlertCircle,
                content: "DOCFLOW provides high-fidelity tools for document manipulation. Users are strictly prohibited from using the platform to facilitate forgery, fraudulent document alteration, or the structural manipulation of unauthorized legal assets."
              },
              {
                title: "03. Asset Ownership",
                icon: Gavel,
                content: "DOCFLOW claims zero ownership over the output of any transformation sequence. You maintain 100% intellectual property rights and liability for all processed assets. Our platform operates as a stateless processor."
              },
              {
                title: "04. Limitation of Liability",
                icon: FileWarning,
                content: "While we utilize industry-standard reconstruction engines (pdf-lib, Jimp), DOCFLOW provides no guarantee of bit-perfect archival fidelity for corrupted or non-standard source assets. Use for mission-critical legal filing at your own discretion."
              }
            ].map((item) => (
              <section key={item.title} className="p-10 bg-white rounded-[3rem] shadow-xl border border-accent/5 space-y-6 group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black text-accent uppercase italic tracking-tighter">{item.title}</h2>
                </div>
                <p className="text-sm font-bold text-accent/60 leading-relaxed italic">
                  {item.content}
                </p>
              </section>
            ))}

            <div className="p-8 bg-accent/5 rounded-[2rem] border border-accent/10 flex items-start gap-6">
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                 <Info className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-widest text-accent italic">Administrative Enforcement</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-tight">
                  DOCFLOW reserves the right to terminate session access for users detected attempting to bypass 
                  security hardening or executing automated scraping sequences against the intelligence registry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
