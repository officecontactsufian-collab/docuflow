"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Zap, 
  Target, 
  Layers, 
  Rocket, 
  History,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="premium-hero pt-20 pb-32 border-b border-accent/5 overflow-hidden relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto space-y-8 text-center">
              <div className="section-label mx-auto">
                <Target className="h-3 w-3 text-primary" />
                <span>Our Core Mission</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-accent leading-[1] italic uppercase">
                Redefining <br />
                <span className="not-italic text-primary">Document</span> <br />
                Intelligence.
              </h1>
              <p className="text-xl text-accent/60 leading-relaxed font-bold max-w-2xl mx-auto">
                DOCFLOW is an industrial-grade workspace engineered for the modern professional. 
                We’ve replaced the traditional cloud-storage model with a stateless, local-first 
                architecture designed for absolute privacy.
              </p>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </section>

        {/* Pillars Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                {
                  title: "Privacy by Nature",
                  desc: "We don't just protect your data; we eliminate it. Every document stream is processed in-memory and auto-shredded upon session termination.",
                  icon: ShieldCheck
                },
                {
                  title: "Industrial Precision",
                  desc: "Built on high-fidelity reconstruction engines, DOCFLOW ensures bit-perfect structural integrity for even the most complex legal assets.",
                  icon: Layers
                },
                {
                  title: "Hardware Accelerated",
                  desc: "Leveraging the full power of your machine, our local-first protocols deliver instant processing without server-side latency.",
                  icon: Cpu
                }
              ].map((item) => (
                <div key={item.title} className="space-y-6 group">
                  <div className="w-16 h-16 rounded-[2rem] bg-accent text-white flex items-center justify-center shadow-xl group-hover:bg-primary transition-all duration-500 group-hover:-rotate-6">
                    <item.icon className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-accent uppercase italic tracking-tighter">{item.title}</h3>
                  <p className="text-accent/60 font-bold leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-24 bg-accent text-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="section-label border-white/10 bg-white/5 text-white">
                    <History className="h-3 w-3 text-primary" />
                    <span>Origin Protocol</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-[1] tracking-tighter">Stateless <br />Innovation.</h2>
                  <p className="text-xl text-white/60 leading-relaxed font-bold">
                    DOCFLOW was born from a simple observation: most document tools prioritize data retention over user privacy. 
                    We set out to build a platform that serves as a bridge, not a vault.
                  </p>
                </div>
                <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 space-y-4">
                   <p className="text-sm font-bold leading-relaxed italic opacity-80">
                     "Our goal isn't to store the world's information—it's to provide the world with the most precise tools to manage their own information, privately and securely."
                   </p>
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black italic border border-primary/20">DF</div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest">Engineering Directorate</p>
                         <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">DOCFLOW Professional</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 {[
                   { label: "Global Reach", val: "140+ Countries", icon: Globe },
                   { label: "Daily Ops", val: "850K+ Sequences", icon: Zap },
                   { label: "Uptime", val: "99.99% Core", icon: Rocket },
                   { label: "Security", val: "ISO-27001", icon: ShieldCheck },
                 ].map((stat) => (
                   <div key={stat.label} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-2">
                      <stat.icon className="h-5 w-5 text-primary mb-2" />
                      <p className="text-2xl font-black italic tracking-tighter">{stat.val}</p>
                      <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">{stat.label}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </section>

        {/* CTA */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-10">
              <h2 className="text-3xl md:text-5xl font-black text-accent uppercase italic tracking-tighter">Ready to initialize?</h2>
              <p className="text-accent/60 font-bold uppercase text-xs tracking-[0.2em]">Join the high-fidelity document flow today.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-accent text-white font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-accent/20 hover:scale-105 transition-all" asChild>
                  <Link href="/">Explore Core Protocols</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl border-accent/10 font-black uppercase text-[11px] tracking-widest" asChild>
                  <Link href="/contact">Contact Gateway <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
