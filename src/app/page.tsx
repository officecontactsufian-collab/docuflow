import { Navbar } from '@/components/navbar';
import { ToolCard } from '@/components/tool-card';
import { 
  Merge, 
  Scissors, 
  FileText, 
  Maximize, 
  RotateCw, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Signature, 
  Table as TableIcon, 
  Image as ImageIcon,
  ArrowRight,
  Shield,
  Clock,
  Search,
  Type,
  Hash,
  Eraser,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const manipulationTools = [
    {
      title: "Merge PDF",
      description: "Combine multiple volumes into a single archive.",
      icon: Merge,
      href: "/merge",
    },
    {
      title: "Split PDF",
      description: "Granular page extraction and document splitting.",
      icon: Scissors,
      href: "/split",
    },
    {
      title: "Compress PDF",
      description: "Optimize file size while maintaining print quality.",
      icon: Maximize,
      href: "/compress",
    },
    {
      title: "Organize PDF",
      description: "Rotate, reorder, or delete pages with ease.",
      icon: RotateCw,
      href: "/organize",
    },
    {
      title: "Watermark PDF",
      description: "Add professional text overlays to pages.",
      icon: Type,
      href: "/watermark",
    },
    {
      title: "Add Page Numbers",
      description: "Insert page counters in the footer.",
      icon: Hash,
      href: "/numbers",
    }
  ];

  const analysisTools = [
    {
      title: "Document Inspector",
      description: "Extract high-fidelity structural metadata and security profiles.",
      icon: Search,
      href: "/analyze",
    },
    {
      title: "Sanitize PDF",
      description: "Remove hidden metadata and author info for privacy.",
      icon: Eraser,
      href: "/sanitize",
    },
    {
      title: "Repair & Rebuild",
      description: "Fix broken file structures and object indexes.",
      icon: Wrench,
      href: "/repair",
    }
  ];

  const convertTools = [
    {
      title: "Word to PDF",
      description: "Lossless conversion for Microsoft Word documents.",
      icon: FileText,
      href: "/convert?type=word-to-pdf",
    },
    {
      title: "Excel to PDF",
      description: "Preserve grid formatting and cell styling in PDF.",
      icon: TableIcon,
      href: "/convert?type=excel-to-pdf",
    },
    {
      title: "JPG to PDF",
      description: "High-DPI image to professional PDF compilation.",
      icon: ImageIcon,
      href: "/convert?type=jpg-to-pdf",
    },
    {
      title: "PDF to Word",
      description: "Advanced layout reconstruction to DOCX format.",
      icon: FileText,
      href: "/convert?type=pdf-to-word",
    }
  ];

  const securityTools = [
    {
      title: "Digital Sign",
      description: "Secure electronic signature placement.",
      icon: Signature,
      href: "/sign",
    },
    {
      title: "Protect PDF",
      description: "Military-grade 256-bit AES encryption.",
      icon: Lock,
      href: "/protect",
    },
    {
      title: "Unlock PDF",
      description: "Remove security restrictions and passwords.",
      icon: Unlock,
      href: "/protect?mode=unlock",
    },
    {
      title: "Compliance PDF/A",
      description: "ISO-compliant long-term electronic archiving.",
      icon: ShieldCheck,
      href: "/convert?type=pdf-to-pdfa",
    }
  ];

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-40 overflow-hidden hero-gradient">
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Shield className="h-4 w-4" />
                <span>Verified Enterprise Security</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                  Document Power <br />
                  <span className="text-primary">Redefined.</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                  The definitive professional toolkit for high-fidelity document manipulation, conversion, and structural analysis.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <Button asChild size="lg" className="h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1">
                  <Link href="#tools">
                    Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white transition-all duration-300 hover:-translate-y-1">
                  <Link href="/enterprise">
                    Enterprise Solutions
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Dashboard */}
        <section id="tools" className="py-32 bg-slate-50 scroll-mt-20">
          <div className="container mx-auto px-4 space-y-32">
            
            {/* Manipulation */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Document Manipulation</h2>
                <div className="h-1.5 w-20 bg-primary rounded-full" />
                <p className="text-slate-500 text-lg">Granular page control and size optimization.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {manipulationTools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} />
                ))}
              </div>
            </div>

            {/* Analysis */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Intelligence & Privacy</h2>
                <div className="h-1.5 w-20 bg-accent rounded-full" />
                <p className="text-slate-500 text-lg">In-depth metadata analysis and sanitization.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {analysisTools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} />
                ))}
              </div>
            </div>

            {/* Conversion */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">High-Fidelity Conversion</h2>
                <div className="h-1.5 w-20 bg-primary rounded-full" />
                <p className="text-slate-500 text-lg">Industrial-grade conversion engines for every document format.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {convertTools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} />
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Security & Compliance</h2>
                <div className="h-1.5 w-20 bg-slate-900 rounded-full" />
                <p className="text-slate-500 text-lg">Military-grade protection and regulatory compliance tools.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {securityTools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Brand Proof */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <h2 className="text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">Trusted by the world's <br /> leading organizations.</h2>
                <div className="space-y-8">
                  <div className="flex gap-6 items-start">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                      <Lock className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-slate-900">Zero-Retention Policy</h4>
                      <p className="text-slate-500 leading-relaxed">Your documents are processed in-memory and destroyed immediately after the session. We never see your data.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shadow-inner">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-slate-900">Local-First Processing</h4>
                      <p className="text-slate-500 leading-relaxed">Where possible, all manipulation occurs within your local environment to ensure maximum speed and compliance.</p>
                    </div>
                  </div>
                </div>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary transition-all">
                  Download Security Whitepaper
                </Button>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 bg-slate-50">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                    alt="DocuFlow Pro Interface" 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-24 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">Solutions</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/merge" className="hover:text-primary transition-colors">Merge & Split</Link></li>
                <li><Link href="/compress" className="hover:text-primary transition-colors">Optimization</Link></li>
                <li><Link href="/analyze" className="hover:text-primary transition-colors">Inspection</Link></li>
                <li><Link href="/convert" className="hover:text-primary transition-colors">Conversion</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">Trust</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/security" className="hover:text-primary transition-colors">Security Policy</Link></li>
                <li><Link href="/protect" className="hover:text-primary transition-colors">Privacy Controls</Link></li>
                <li><Link href="/enterprise" className="hover:text-primary transition-colors">Compliance</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/enterprise" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Developer API</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic">DocuFlow</span>
              </div>
              <p className="text-sm leading-relaxed">The definitive standard for professional document intelligence and secure manipulation.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-800">
            <p className="text-xs font-medium tracking-wide">
              &copy; {new Date().getFullYear()} DocuFlow Professional. ISO 27001 Certified Infrastructure.
            </p>
            <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-widest">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}