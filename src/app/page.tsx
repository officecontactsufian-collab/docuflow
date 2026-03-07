
"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { ToolCard } from '@/components/tool-card';
import { 
  Merge, 
  RotateCw, 
  ShieldCheck, 
  Shield,
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
  Search,
  ArrowRight,
  Play,
  Lock,
  Cpu,
  RefreshCcw,
  Zap,
  Globe,
  Activity,
  MessageSquare,
  Scale,
  Info,
  BrainCircuit,
  Mail,
  Languages,
  CheckCircle2,
  BookOpen,
  Briefcase,
  FileBadge,
  FileText,
  ArrowRightLeft,
  Image as ImageIcon,
  Scissors
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
      label: "AI Intelligence Suite",
      description: "Generative protocols for structural content evolution.",
      items: [
        { title: "Paraphraser", desc: "Re-engineer text.", icon: RefreshCcw, href: "/ai-studio" },
        { title: "AI Summarizer", desc: "Executive distillation.", icon: Activity, href: "/ai-studio" },
        { title: "Grammar Check", desc: "Industrial proofing.", icon: CheckCircle2, href: "/ai-studio" },
        { title: "Essay Writer", desc: "Structured drafts.", icon: BookOpen, href: "/ai-studio" },
      ]
    },
    {
      label: "Transformation Hub",
      description: "Lossless conversion between industrial formats.",
      items: [
        { title: "Transformation Engine", desc: "Category Gateway.", icon: ArrowRightLeft, href: "/convert" },
        { title: "PDF to Word", desc: "Editable DOCX export.", icon: FileText, href: "/convert?type=pdf-to-word" },
        { title: "Word to PDF", desc: "Standardize Word.", icon: FilePenLine, href: "/convert?type=word-to-pdf" },
        { title: "PDF to Excel", desc: "Table reconstruction.", icon: FileText, href: "/convert?type=pdf-to-excel" },
      ]
    },
    {
      label: "Professional Identity",
      description: "AI-powered protocols for career advancement.",
      items: [
        { title: "Resume Builder", desc: "Profile engineering.", icon: Briefcase, href: "/ai-studio" },
        { title: "Cover Letter", desc: "Intro architect.", icon: FileBadge, href: "/ai-studio" },
        { title: "Email Architect", desc: "Structural synthesis.", icon: Mail, href: "/ai-studio" },
        { title: "Digital Sign", desc: "Apply identity anchors.", icon: Signature, href: "/sign" },
      ]
    },
    {
      label: "Modify & Capture",
      description: "Direct page and structural modifications.",
      items: [
        { title: "Scan to PDF", desc: "Direct camera capture.", icon: Camera, href: "/scan-to-pdf" },
        { title: "Crop PDF", desc: "Trim page margins.", icon: Crop, href: "/crop" },
        { title: "Visual Organizer", desc: "Reorder & Rotate.", icon: RotateCw, href: "/organize" },
        { title: "Add Numbers", desc: "Sequential counters.", icon: Hash, href: "/numbers" },
      ]
    },
    {
      label: "Security & Trust",
      description: "Industrial grade metadata protection.",
      items: [
        { title: "Password Protect", desc: "Encrypt PDF with key.", icon: Lock, href: "/secure" },
        { title: "Privacy Shield", desc: "Metadata erasure.", icon: ShieldCheck, href: "/protect" },
        { title: "Unlock PDF", desc: "Strip restrictions.", icon: Unlock, href: "/protect?mode=unlock" },
        { title: "Translator", desc: "Linguistic shift.", icon: Languages, href: "/ai-studio" },
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
                  <BrainCircuit className="h-3 w-3 text-primary" />
                  <span>Generative Document Intelligence</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent leading-[1] italic uppercase text-gradient">
                  Intelligent <br />
                  <span className="not-italic text-accent">Document</span> <br />
                  Flow.
                </h1>
                
                <p className="text-lg md:text-xl text-accent/60 max-w-xl mx-auto leading-relaxed font-bold">
                  High-performance document intelligence for professionals. 
                  AI-powered, private, and processed entirely within secure tunnels.
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
                    {cat.items.map((tool) => (
                      <ToolCard key={tool.title} title={tool.title} description={tool.desc} icon={tool.icon} href={tool.href} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
              <div className="section-label mx-auto">
                <Layers className="h-3 w-3 text-primary" />
                <span>Operational Excellence</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-accent uppercase italic tracking-tighter">Pure Precision.</h2>
              <p className="text-accent/40 font-black uppercase text-[10px] tracking-[0.4em]">High-Fidelity Transformation Pipeline</p>
            </div>
            
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="grid md:grid-cols-3 gap-8 relative">
                {[
                  { 
                    icon: FileUp, 
                    title: "Stage", 
                    desc: "Select your assets securely. Local staging occurs instantly within your browser with zero latency. No files are uploaded to our servers during this phase.",
                    tip: "Accepts PDF, JPG, PNG, and DOCX."
                  },
                  { 
                    icon: Settings2, 
                    title: "Process", 
                    desc: "Our high-fidelity engine reconstructs your document architecture with industrial accuracy. Apply rotations, crops, signatures, or AI analysis locally.",
                    tip: "256-bit AES memory hardening active."
                  },
                  { 
                    icon: Download, 
                    title: "Deploy", 
                    desc: "Save your optimized document instantly. Verified, private, and ready for professional deployment. All session data is auto-shredded upon completion.",
                    tip: "Direct browser-to-disk transmission."
                  }
                ].map((step, idx) => (
                  <div key={step.title} className="relative group">
                    <div className="p-10 rounded-[3rem] bg-white border border-accent/5 shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-primary/20 h-full flex flex-col items-center text-center space-y-6">
                      <div className="w-20 h-20 bg-accent text-white rounded-[2rem] flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-3">
                        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Sequence 0{idx + 1}</div>
                        <h3 className="text-2xl font-black text-accent uppercase italic">{step.title}</h3>
                        <p className="text-accent/60 font-bold leading-relaxed text-sm">{step.desc}</p>
                        <div className="pt-4 border-t border-accent/5 w-full">
                           <p className="text-[8px] font-black uppercase text-accent/30 tracking-widest italic">{step.tip}</p>
                        </div>
                      </div>
                    </div>
                    {idx < 2 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                        <ArrowRight className="h-8 w-8 text-accent/10" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Button size="lg" className="h-16 px-12 rounded-[2rem] bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20 hover:scale-105 transition-all group" asChild>
                  <Link href="#tools">
                    <Play className="mr-3 h-4 w-4 fill-primary text-primary group-hover:translate-x-1 transition-transform" />
                    Initialize Protocol
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-accent text-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[9px]">
                    <Shield className="h-3 w-3" /> Industrial Security Registry
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-[1] tracking-tighter">Secure <br />By Nature.</h2>
                  <p className="text-xl text-white/60 leading-relaxed font-bold max-w-lg">
                    We've eliminated the data-retention layer. DOCFLOW operates as an encrypted bridge between your hardware and your document architecture.
                  </p>
                </div>

                <div className="grid gap-8">
                  {[
                    { title: "Local Sandboxing", desc: "All document binary streams are isolated within your browser's private memory pool. No cloud-persistence protocol exists.", icon: Cpu },
                    { title: "Memory-Level AES", desc: "256-bit encryption hardening applied to all active document buffers during the transformation sequence.", icon: Lock },
                    { title: "Automated Shredding", desc: "Zero-latency purging. Every memory bit utilized during your session is overwritten upon process completion or tab closure.", icon: RefreshCcw },
                    { title: "ISO Standard Archival", desc: "Reconstructions adhere to ISO 32000 and 19005 standards, ensuring structural integrity without tracking meta-data.", icon: Globe }
                  ].map((item) => (
                    <div key={item.title} className="flex gap-5 group">
                      <div className="w-12 h-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary transition-all">
                        <item.icon className="h-5 w-5 text-primary group-hover:text-white" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-black text-xs uppercase tracking-widest">{item.title}</h4>
                          <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-tight max-w-md">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/10">
                   <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20 mb-6">Global Compliance Registry</p>
                   <div className="flex flex-wrap gap-6 items-center opacity-40 grayscale hover:opacity-100 transition-opacity">
                      {["GDPR", "ISO 27001", "SOC2", "HIPAA", "PCI DSS"].map(badge => (
                        <div key={badge} className="px-4 py-1.5 border border-white/20 rounded-full text-[9px] font-black tracking-widest">{badge}</div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="aspect-square bg-white/5 rounded-[4rem] flex items-center justify-center p-20 backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                   <ShieldCheck className="w-full h-full text-primary/20 group-hover:scale-110 transition-transform duration-[2000ms]" />
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/20 pointer-events-none" />
                   <div className="absolute inset-x-0 h-1 bg-primary/20 blur-sm animate-scan" />
                </div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-accent text-white py-24 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8 col-span-1 md:col-span-1">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-primary brand-glow" />
                <span className="text-3xl font-black tracking-tighter uppercase italic">DOCFLOW</span>
              </div>
              <p className="text-[10px] leading-relaxed font-bold opacity-40 uppercase tracking-[0.2em] max-w-xs">
                The industrial benchmark for local-first document intelligence. Engineered for high-fidelity assets and mission-critical privacy.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Core Protocols</h4>
                <div className="h-px w-8 bg-primary/30" />
              </div>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-[0.2em] italic">
                <li><Link href="/ai-studio" className="hover:text-primary transition-colors flex items-center gap-2 group text-primary"><div className="w-1 h-1 bg-primary/40 rounded-full group-hover:bg-primary" /> AI Intelligence Suite</Link></li>
                <li><Link href="/merge" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Structural Merge</Link></li>
                <li><Link href="/convert" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Asset Transformation</Link></li>
                <li><Link href="/split" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Range Extraction</Link></li>
                <li><Link href="/organize" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Visual Mapping</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Identity & Security</h4>
                <div className="h-px w-8 bg-primary/30" />
              </div>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-[0.2em] italic">
                <li><Link href="/secure" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Password Protect</Link></li>
                <li><Link href="/sign" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Identity Synthesis</Link></li>
                <li><Link href="/protect" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Privacy Shield</Link></li>
                <li><Link href="/analyze" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Deep Inspection</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">System Support</h4>
                <div className="h-px w-8 bg-primary/30" />
              </div>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-[0.2em] italic">
                <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> About Mission</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Contact Gateway</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Privacy Shield</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary" /> Terms of Operation</Link></li>
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
