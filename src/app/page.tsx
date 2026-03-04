"use client"

import { Navbar } from '@/components/navbar';
import { ToolCard } from '@/components/tool-card';
import { FileDropzone } from '@/components/file-dropzone';
import { 
  Merge, 
  Scissors, 
  FileText, 
  Maximize, 
  RotateCw, 
  Lock, 
  ShieldCheck, 
  Image as ImageIcon,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  FileUp,
  Settings2,
  Download,
  FilePenLine,
  Table,
  Cpu,
  Globe,
  LayoutDashboard,
  Layers,
  CircleCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const toolCategories = [
    {
      label: "Convert & Export",
      description: "Lossless transformation between formats.",
      items: [
        { title: "PDF to Word", desc: "Editable DOCX documents.", icon: FileText, href: "/convert?type=pdf-to-word" },
        { title: "Word to PDF", desc: "Clean universal standards.", icon: FilePenLine, href: "/convert?type=word-to-pdf" },
        { title: "PDF to Excel", desc: "Extract tables accurately.", icon: Table, href: "/convert?type=pdf-to-excel" },
        { title: "JPG to PDF", desc: "High-res image stitching.", icon: ImageIcon, href: "/convert?type=jpg-to-pdf" },
      ]
    },
    {
      label: "Structure & Flow",
      description: "Advanced page manipulation tools.",
      items: [
        { title: "Merge PDF", desc: "Unify multiple documents.", icon: Merge, href: "/merge" },
        { title: "Split PDF", desc: "Extract specific page ranges.", icon: Scissors, href: "/split" },
        { title: "Organize", desc: "Rotate and reorder pages.", icon: RotateCw, href: "/organize" },
        { title: "Compress", desc: "Optimize for size and speed.", icon: Maximize, href: "/compress" },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* PREMIUM HERO SECTION */}
        <section className="premium-hero pt-24 pb-48 lg:pt-32 lg:pb-64 relative overflow-hidden">
          <div className="container relative mx-auto px-6">
            <div className="max-w-5xl mx-auto space-y-16">
              <div className="text-center space-y-8 animate-in fade-in slide-in-from-top-12 duration-1000">
                <div className="section-label mx-auto brand-glow">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Encrypted 256-bit AES Workspace</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-accent leading-[0.9] italic uppercase text-gradient">
                  Intelligent <br />
                  <span className="not-italic text-accent">Document</span> <br />
                  Flow.
                </h1>
                
                <p className="text-xl md:text-2xl text-accent/60 max-w-2xl mx-auto leading-relaxed font-bold">
                  High-performance document intelligence for modern professionals. 
                  Encrypted, private, and powered by advanced logic.
                </p>
              </div>

              {/* CENTERED ACTION HUB */}
              <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300">
                <FileDropzone 
                  isHero 
                  onFilesSelected={() => {}} 
                  className="max-w-4xl"
                />
              </div>

              <div className="flex items-center justify-center gap-12 pt-12 opacity-30 grayscale filter blur-[0.5px]">
                 <div className="font-black text-[10px] uppercase tracking-[0.4em] italic">ISO-27001 SECURE</div>
                 <div className="font-black text-[10px] uppercase tracking-[0.4em] italic">GDPR READY</div>
                 <div className="font-black text-[10px] uppercase tracking-[0.4em] italic">SOC2 COMPLIANT</div>
              </div>
            </div>
          </div>

          {/* BACKGROUND DECORATION */}
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />
        </section>

        {/* CATEGORIZED TOOLS SECTION */}
        <section id="tools" className="py-48 bg-white/40 border-y border-white/20 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto space-y-32">
              {toolCategories.map((cat, idx) => (
                <div key={cat.label} className="space-y-16">
                  <div className={`flex flex-col md:flex-row items-end justify-between gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`space-y-4 max-w-2xl ${idx % 2 === 1 ? 'md:text-right' : ''}`}>
                      <div className="section-label">
                        <LayoutDashboard className="h-3 w-3 text-primary" />
                        <span>Category 0{idx + 1}</span>
                      </div>
                      <h2 className="text-5xl md:text-6xl font-black text-accent uppercase italic tracking-tighter">{cat.label}</h2>
                      <p className="text-accent/60 text-xl font-bold leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cat.items.map((tool) => (
                      <ToolCard key={tool.title} {...tool} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS: PREMIUM STEPPER */}
        <section className="py-48 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-32 space-y-4">
              <div className="section-label mx-auto">
                <Layers className="h-3 w-3 text-primary" />
                <span>Operational Flow</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-black text-accent uppercase italic tracking-tighter">Pure Precision.</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto relative">
              {[
                { 
                  icon: FileUp, 
                  title: "Stage", 
                  desc: "Select your assets securely. Our encrypted loader handles local staging instantly." 
                },
                { 
                  icon: Settings2, 
                  title: "Process", 
                  desc: "Our high-fidelity engine reconstruction your document with industrial accuracy." 
                },
                { 
                  icon: Download, 
                  title: "Deploy", 
                  desc: "Save your optimized document instantly. Verified, secured, and ready for work." 
                }
              ].map((step, idx) => (
                <div key={step.title} className="space-y-8 text-center relative group">
                  <div className="w-24 h-24 flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <step.icon className="h-16 w-16 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-accent uppercase italic">{idx + 1}. {step.title}</h3>
                    <p className="text-accent/60 font-bold leading-relaxed text-lg">{step.desc}</p>
                  </div>
                </div>
              ))}
              
              {/* CONNECTING LINES (Desktop Only) */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-accent/5 -z-10" />
            </div>
          </div>
        </section>

        {/* SECURITY: INDUSTRIAL GRADE */}
        <section className="py-48 bg-accent text-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-32 items-center max-w-7xl mx-auto">
              <div className="space-y-12">
                <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[11px]">
                  <Shield className="h-4 w-4" /> Global Data Standards
                </div>
                <h2 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.9] tracking-tighter">Secure <br />By Nature.</h2>
                <p className="text-2xl text-white/60 leading-relaxed font-bold max-w-xl">
                  Your privacy is our structural foundation. We use industrial 256-bit AES encryption and guarantee zero-retention for all processed assets.
                </p>
                <div className="grid sm:grid-cols-2 gap-8">
                  {[
                    "Client-Side Logic",
                    "Automated Shredding",
                    "End-to-End Tunneling",
                    "Zero Persistence"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] opacity-80">
                      <CircleCheck className="h-6 w-6 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-accent font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:bg-primary hover:text-white transition-all">
                  Security Whitepaper <ArrowRight className="ml-3 h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/5 rounded-[5rem] flex items-center justify-center p-24 backdrop-blur-3xl border border-white/10 shadow-2xl animate-pulse duration-[4000ms]">
                   <Lock className="w-full h-full text-primary/20" />
                </div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary rounded-full blur-[150px] opacity-20" />
              </div>
            </div>
          </div>
        </section>

        {/* PERFORMANCE STATS */}
        <section className="py-32 bg-accent/5 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
              {[
                { val: "24M+", label: "Assets Optimized" },
                { val: "100%", label: "Encrypted Tunnel" },
                { val: "4.9/5", label: "Professional Score" },
                { val: "0ms", label: "Session Retention" }
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <p className="text-6xl font-black text-accent italic tracking-tighter">{stat.val}</p>
                  <p className="text-[10px] font-black uppercase text-accent/40 tracking-[0.4em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-accent text-white py-48 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
            <div className="col-span-1 md:col-span-1 space-y-10">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-primary" />
                <span className="text-4xl font-black tracking-tighter uppercase italic">DocuFlow</span>
              </div>
              <p className="text-[11px] leading-relaxed font-black opacity-50 uppercase tracking-[0.3em] max-w-[250px]">
                The industrial standard for high-performance document intelligence and secure transformation.
              </p>
            </div>
            <div className="space-y-10">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Workspace</h4>
              <ul className="space-y-5 text-[11px] font-black uppercase tracking-[0.3em] opacity-60">
                <li><Link href="/merge" className="hover:text-primary transition-colors">Merge PDF</Link></li>
                <li><Link href="/split" className="hover:text-primary transition-colors">Split PDF</Link></li>
                <li><Link href="/compress" className="hover:text-primary transition-colors">Optimize PDF</Link></li>
                <li><Link href="/analyze" className="hover:text-primary transition-colors">AI Analysis</Link></li>
              </ul>
            </div>
            <div className="space-y-10">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Enterprise</h4>
              <ul className="space-y-5 text-[11px] font-black uppercase tracking-[0.3em] opacity-60">
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Workspace Plans</Link></li>
                <li><Link href="/enterprise" className="hover:text-primary transition-colors">Governance</Link></li>
                <li><Link href="/security" className="hover:text-primary transition-colors">Audit & Compliance</Link></li>
              </ul>
            </div>
            <div className="space-y-10">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Legal</h4>
              <ul className="space-y-5 text-[11px] font-black uppercase tracking-[0.3em] opacity-60">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Protocol</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Work</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t border-white/5 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">
              &copy; {new Date().getFullYear()} DocuFlow Intelligence. All Protocols Reserved.
            </p>
            <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.5em]">
              <span>SECURE TUNNEL 256-BIT AES</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}