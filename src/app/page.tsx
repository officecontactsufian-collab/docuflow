import { Navbar } from '@/components/navbar';
import { ToolCard } from '@/components/tool-card';
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
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const tools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDF documents into one single file effortlessly.",
      icon: Merge,
      href: "/merge",
    },
    {
      title: "Split PDF",
      description: "Extract specific ranges or split your document into multiple parts.",
      icon: Scissors,
      href: "/split",
    },
    {
      title: "Compress PDF",
      description: "Minimize file size while preserving high-resolution quality.",
      icon: Maximize,
      href: "/compress",
    },
    {
      title: "PDF to Word",
      description: "Turn static PDF files into fully editable Microsoft Word documents.",
      icon: FileText,
      href: "/convert?type=pdf-to-word",
    },
    {
      title: "Word to PDF",
      description: "Convert any Word document into a clean, universally readable PDF.",
      icon: FilePenLine,
      href: "/convert?type=word-to-pdf",
    },
    {
      title: "Edit PDF",
      description: "Add annotations, shapes, and structural changes to your documents.",
      icon: RotateCw,
      href: "/organize",
    },
    {
      title: "PDF to Excel",
      description: "Instantly extract tables and data into clean Excel spreadsheets.",
      icon: Table,
      href: "/convert?type=pdf-to-excel",
    },
    {
      title: "JPG to PDF",
      description: "Transform your high-res images into professional PDF files.",
      icon: ImageIcon,
      href: "/convert?type=jpg-to-pdf",
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-48 overflow-hidden bg-background">
          <div className="container relative mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 text-accent text-[10px] font-black uppercase tracking-[0.2em] border border-accent/10 brand-glow">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Encrypted & Private Processing</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-accent leading-[0.9] italic uppercase">
                The Smart <br />
                <span className="text-primary not-italic">Document</span> <br />
                Workspace
              </h1>
              
              <p className="text-xl md:text-2xl text-accent/70 max-w-2xl mx-auto leading-relaxed font-bold">
                Powerful document intelligence tools for professionals. 
                Fast, secure, and built directly for your browser.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                <Button asChild size="lg" className="h-16 px-10 text-xs font-black uppercase tracking-[0.25em] rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <Link href="#tools">
                    Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-16 px-10 text-xs font-black uppercase tracking-[0.25em] rounded-2xl bg-white/40 backdrop-blur-sm border-accent/10 text-accent hover:bg-white transition-all">
                  <Link href="/login">
                    Get Started Free
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-8 pt-12 opacity-40 grayscale filter blur-[0.5px]">
                 <div className="font-black text-[10px] uppercase tracking-widest italic">ISO-27001 SECURE</div>
                 <div className="font-black text-[10px] uppercase tracking-widest italic">GDPR READY</div>
                 <div className="font-black text-[10px] uppercase tracking-widest italic">SOC2 COMPLIANT</div>
              </div>
            </div>
          </div>
        </section>

        {/* TOOLS GRID SECTION */}
        <section id="tools" className="py-32 border-y border-white/20 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black text-accent uppercase italic">Universal Tools</h2>
                <p className="text-accent/60 text-lg font-bold">
                  High-performance document manipulation for modern workflows.
                </p>
              </div>
              <Button variant="link" className="text-primary font-black uppercase tracking-widest text-[10px] group">
                View All Capabilities <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black text-accent uppercase italic tracking-tighter">Workflow Simplified</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
              {[
                { 
                  icon: FileUp, 
                  title: "1. Upload", 
                  desc: "Select your documents securely from your local machine or cloud storage." 
                },
                { 
                  icon: Settings2, 
                  title: "2. Process", 
                  desc: "Our engine reconstructions your document with pixel-perfect accuracy in seconds." 
                },
                { 
                  icon: Download, 
                  title: "3. Download", 
                  desc: "Save your optimized document instantly. Secure, verified, and ready for delivery." 
                }
              ].map((step) => (
                <div key={step.title} className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center shadow-xl mx-auto">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-accent uppercase italic">{step.title}</h3>
                    <p className="text-accent/60 font-bold leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY & PRIVACY SECTION */}
        <section className="py-32 bg-accent text-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                  <Shield className="h-4 w-4" /> Privacy Standards
                </div>
                <h2 className="text-5xl md:text-6xl font-black uppercase italic leading-tight">Total Privacy. <br />No Compromises.</h2>
                <p className="text-xl text-white/60 leading-relaxed font-bold">
                  Your security is our structural foundation. We use industrial 256-bit encryption and guarantee zero-retention for all processed files.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "End-to-End Encryption",
                    "Automated File Purging",
                    "Client-Side Processing",
                    "No Data Retention"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-80">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/5 rounded-[4rem] flex items-center justify-center p-20 backdrop-blur-3xl border border-white/10">
                   <Lock className="w-full h-full text-primary/20" />
                </div>
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary rounded-full blur-[120px] opacity-20" />
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE DOCUFLOW SECTION */}
        <section className="py-48 bg-background">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <div className="space-y-12">
              <h2 className="text-5xl md:text-7xl font-black text-accent uppercase italic tracking-tighter">Why Professionals Choose Us</h2>
              <p className="text-2xl text-accent/60 leading-relaxed font-black">
                DocuFlow combines industrial performance with an interface that simplifies complexity.
              </p>
              <div className="grid md:grid-cols-3 gap-8 pt-16">
                {[
                  { icon: Cpu, label: "Zero Latency", sub: "Optimized for speed." },
                  { icon: Globe, label: "Cross-Platform", sub: "Works everywhere." },
                  { icon: ShieldCheck, label: "High Fidelity", sub: "Perfect reconstruction." }
                ].map((item) => (
                  <div key={item.label} className="space-y-4 p-10 rounded-[2.5rem] bg-card/60 border border-white/20 shadow-xl">
                    <item.icon className="h-10 w-10 text-primary mx-auto mb-2" />
                    <h4 className="text-lg font-black text-accent uppercase italic">{item.label}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent/40">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-24 bg-accent/5 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { val: "12M+", label: "Files Processed" },
                { val: "100%", label: "Data Secure" },
                { val: "4.9/5", label: "User Rating" },
                { val: "0ms", label: "Data Retention" }
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-5xl font-black text-accent italic">{stat.val}</p>
                  <p className="text-[10px] font-black uppercase text-accent/40 tracking-[0.3em] mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-accent text-white py-32 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-1 space-y-8">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-3xl font-black tracking-tighter uppercase italic">DocuFlow</span>
              </div>
              <p className="text-[10px] leading-relaxed font-black opacity-50 uppercase tracking-widest max-w-[200px]">
                The professional standard for high-performance document processing.
              </p>
            </div>
            <div className="space-y-8">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Tools</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                <li><Link href="/merge" className="hover:text-primary transition-colors">Merge PDF</Link></li>
                <li><Link href="/split" className="hover:text-primary transition-colors">Split PDF</Link></li>
                <li><Link href="/compress" className="hover:text-primary transition-colors">Compress PDF</Link></li>
                <li><Link href="/convert" className="hover:text-primary transition-colors">Convert PDF</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Company</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Plans</Link></li>
                <li><Link href="/enterprise" className="hover:text-primary transition-colors">Enterprise</Link></li>
                <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Legal</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-16 border-t border-white/5 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} DocuFlow Intelligence.
            </p>
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em]">
              <span>SECURE 256-BIT AES CONNECTION</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
