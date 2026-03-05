"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { ToolCard } from '@/components/tool-card';
import { 
  Merge, 
  Scissors, 
  FileText, 
  Maximize, 
  RotateCw, 
  ShieldCheck, 
  Shield,
  CircleCheck,
  FileUp,
  Settings2,
  Download,
  LayoutDashboard,
  Layers,
  Unlock,
  Signature,
  Hash,
  Crop,
  FilePenLine,
  Camera,
  Presentation,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [year, setYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const toolCategories = [
    {
      label: "Modify & Capture",
      description: "Direct page and structural modifications.",
      items: [
        { title: "Scan to PDF", desc: "Direct camera to document stream.", icon: Camera, href: "/scan-to-pdf" },
        { title: "Crop PDF", desc: "Trim page margins with precision.", icon: Crop, href: "/crop" },
        { title: "Reorder & Rotate", desc: "Change page order and orientation.", icon: RotateCw, href: "/organize" },
      ]
    },
    {
      label: "Convert & Export",
      description: "Lossless transformation between industrial formats.",
      items: [
        { title: "PDF to Word", desc: "Convert to editable DOCX documents.", icon: FileText, href: "/convert?type=pdf-to-word" },
        { title: "PDF to PowerPoint", desc: "Export slides for professional use.", icon: Presentation, href: "/convert?type=pdf-to-ppt" },
        { title: "Word to PDF", desc: "Standardize any Word document to PDF.", icon: FilePenLine, href: "/convert?type=word-to-pdf" },
        { title: "PPT to PDF", desc: "Industrial presentation conversion.", icon: FileUp, href: "/convert?type=ppt-to-pdf" },
      ]
    },
    {
      label: "Structure & Flow",
      description: "Advanced page manipulation and optimization.",
      items: [
        { title: "Merge PDF", desc: "Combine multiple files into one.", icon: Merge, href: "/merge" },
        { title: "Split PDF", desc: "Extract specific ranges or pages.", icon: Scissors, href: "/split" },
        { title: "Compress PDF", desc: "Optimize file size for web delivery.", icon: Maximize, href: "/compress" },
        { title: "Add Numbers", desc: "Sequential page counter placement.", icon: Hash, href: "/numbers" },
      ]
    },
    {
      label: "Security & Trust",
      description: "Industrial grade metadata and access protection.",
      items: [
        { title: "Privacy Shield", desc: "Permanent metadata and tracking erasure.", icon: ShieldCheck, href: "/protect" },
        { title: "Unlock PDF", desc: "Recover and strip document restrictions.", icon: Unlock, href: "/protect?mode=unlock" },
        { title: "Digital Sign", desc: "Apply secure electronic signatures.", icon: Signature, href: "/sign" },
        { title: "Document Inspect", desc: "Deep metadata structural analysis.", icon: Search, href: "/analyze" },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="premium-hero pt-16 pb-24 lg:pt-20 lg:pb-32 relative overflow-hidden">
          <div className="container relative mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-8 duration-1000">
                <div className="section-label mx-auto brand-glow">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <span>Encrypted Open Workspace</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent leading-[1] italic uppercase text-gradient">
                  Intelligent <br />
                  <span className="not-italic text-accent">Document</span> <br />
                  Flow.
                </h1>
                
                <p className="text-lg md:text-xl text-accent/60 max-w-xl mx-auto leading-relaxed font-bold">
                  High-performance document intelligence for professionals. 
                  Private, instant, and processed entirely locally.
                </p>

                <div className="flex items-center justify-center pt-4">
                  <Button size="lg" className="h-14 px-10 rounded-xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-accent/30 hover:scale-105 transition-all" asChild>
                    <Link href="#tools">Explore Core Protocols</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-10 pt-8 opacity-20 grayscale filter blur-[0.5px]">
                 <div className="font-black text-[8px] uppercase tracking-[0.4em] italic">ISO-27001 SECURE</div>
                 <div className="font-black text-[8px] uppercase tracking-[0.4em] italic">GDPR READY</div>
                 <div className="font-black text-[8px] uppercase tracking-[0.4em] italic">SOC2 COMPLIANT</div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
        </section>

        <section id="tools" className="py-20 bg-white border-y border-accent/5 relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto space-y-20">
              {toolCategories.map((cat, idx) => (
                <div key={cat.label} className="space-y-10">
                  <div className={`flex flex-col md:flex-row items-end justify-between gap-6 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`space-y-3 max-w-2xl ${idx % 2 === 1 ? 'md:text-right' : ''}`}>
                      <div className="section-label">
                        <LayoutDashboard className="h-3 w-3 text-primary" />
                        <span>Category 0{idx + 1}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-accent uppercase italic tracking-tighter">{cat.label}</h2>
                      <p className="text-accent/60 text-base font-bold leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {toolCategories[idx].items.map((tool) => (
                      <ToolCard key={tool.title} title={tool.title} description={tool.desc} icon={tool.icon} href={tool.href} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20 space-3">
              <div className="section-label mx-auto">
                <Layers className="h-3 w-3 text-primary" />
                <span>Operational Flow</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-accent uppercase italic tracking-tighter">Pure Precision.</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
              {[
                { 
                  icon: FileUp, 
                  title: "Stage", 
                  desc: "Select your assets securely. Local staging occurs instantly within your browser." 
                },
                { 
                  icon: Settings2, 
                  title: "Process", 
                  desc: "Our high-fidelity engine reconstructs your document with industrial accuracy." 
                },
                { 
                  icon: Download, 
                  title: "Deploy", 
                  desc: "Save your optimized document instantly. Verified, private, and ready for use." 
                }
              ].map((step, idx) => (
                <div key={step.title} className="space-y-6 text-center relative group">
                  <div className="w-20 h-20 bg-accent text-white rounded-2xl flex items-center justify-center shadow-xl mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-accent uppercase italic">{idx + 1}. {step.title}</h3>
                    <p className="text-accent/60 font-bold leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-accent text-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[9px]">
                  <Shield className="h-3 w-3" /> Global Data Standards
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-[1] tracking-tighter">Secure <br />By Nature.</h2>
                <p className="text-xl text-white/60 leading-relaxed font-bold max-w-lg">
                  Zero-retention for all assets. We use industrial structural hardening applied locally within your secure session.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Local Processing",
                    "Auto-Shredding",
                    "End-to-End Tunneling",
                    "Zero Persistence"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
                      <CircleCheck className="h-4 w-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/5 rounded-3xl flex items-center justify-center p-16 backdrop-blur-3xl border border-white/10 shadow-2xl animate-pulse duration-[4000ms]">
                   <ShieldCheck className="w-full h-full text-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-accent text-white py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-2xl font-black tracking-tighter uppercase italic">DOCFLOW</span>
              </div>
              <p className="text-[9px] leading-relaxed font-black opacity-50 uppercase tracking-[0.3em] max-w-[200px]">
                The industrial standard for high-performance document intelligence.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-primary text-[9px] font-black uppercase tracking-[0.5em]">Protocols</h4>
              <ul className="space-y-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                <li><Link href="/merge" className="hover:text-primary transition-colors">Merge Assets</Link></li>
                <li><Link href="/compress" className="hover:text-primary transition-colors">Optimization</Link></li>
                <li><Link href="/analyze" className="hover:text-primary transition-colors">Intelligence</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-primary text-[9px] font-black uppercase tracking-[0.5em]">System Support</h4>
              <ul className="space-y-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                <li><Link href="/security" className="hover:text-primary transition-colors">Security Standards</Link></li>
                <li><Link href="/enterprise" className="hover:text-primary transition-colors">Enterprise Grade</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5 opacity-30">
            <p className="text-[8px] font-black uppercase tracking-[0.5em]">
              &copy; {year || "...."} DOCFLOW. All Protocols Reserved.
            </p>
            <div className="flex items-center gap-10 text-[8px] font-black uppercase tracking-[0.5em]">
              <span>SECURE TUNNEL 256-BIT AES</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
