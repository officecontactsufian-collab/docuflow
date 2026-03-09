"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Gavel, ShieldCheck, Scale, FileWarning, Info } from 'lucide-react';

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
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">Industrial Usage Framework v1.2.</p>
          </div>
          <div className="grid gap-12">
            {[
              { title: "01. Protocol Acceptance", icon: ShieldCheck, content: "By initializing any DOCFLOW transformation sequence, you agree to these Terms of Operation." },
              { title: "02. Responsible Intelligence", icon: Info, content: "DOCFLOW provides tools for document manipulation. Users are prohibited from facilitated forgery." },
              { title: "03. Asset Ownership", icon: Gavel, content: "DOCFLOW claims zero ownership over the output of any sequence. You maintain 100% intellectual property rights." },
              { title: "04. Limitation of Liability", icon: FileWarning, content: "DOCFLOW provides no guarantee of bit-perfect archival fidelity for corrupted or non-standard source assets." }
            ].map((item) => (
              <section key={item.title} className="p-10 bg-white rounded-[3rem] shadow-xl border border-accent/5 space-y-6 group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center"><item.icon className="h-6 w-6" /></div>
                  <h2 className="text-2xl font-black text-accent uppercase italic tracking-tighter">{item.title}</h2>
                </div>
                <p className="text-sm font-bold text-accent/60 leading-relaxed italic">{item.content}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
