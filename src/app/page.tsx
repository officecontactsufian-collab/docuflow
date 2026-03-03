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
  Info, 
  Table as TableIcon, 
  Image as ImageIcon,
  ArrowRight,
  Shield,
  Clock,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const analysisTools = [
    {
      title: "Document Inspector",
      description: "Extract high-fidelity structural metadata and security profiles.",
      icon: Search,
      href: "/analyze",
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
    }
  ];

  const securityTools = [
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
      title: "PDF to PDF/A",
      description: "ISO-compliant long-term electronic archiving.",
      icon: ShieldCheck,
      href: "/convert?type=pdf-to-pdfa",
    },
    {
      title: "Digital Sign",
      description: "Legally binding electronic signatures.",
      icon: Signature,
      href: "#",
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden border-b bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(59,130,246,0.05)_0%,rgba(255,255,255,0)_100%)]" />
          <div className="container relative mx-auto px-4 text-center">
            <div className="flex flex-col items-center space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider border border-primary/10 animate-in fade-in slide-in-from-bottom-2">
                <Shield className="h-3.5 w-3.5" />
                <span>Enterprise Verified Solution</span>
              </div>
              
              <div className="max-w-4xl space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground font-headline leading-[1.1]">
                  Professional Document <br />
                  <span className="text-primary italic">Workflow</span> Simplified
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  DocuFlow Pro provides high-fidelity manipulation, deterministic structural analysis, and secure conversion tools for the modern enterprise.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20 group">
                  Get Started <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white/50 backdrop-blur-sm">
                  View Features
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Dashboard */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 space-y-24">
            
            {/* Analysis */}
            <div className="space-y-8">
              <div className="flex items-end justify-between border-b pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-headline">Document Intelligence</h2>
                  <p className="text-muted-foreground text-sm">In-depth structural and metadata processing.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysisTools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} />
                ))}
                <div className="md:col-span-2 p-8 rounded-2xl bg-primary text-primary-foreground flex flex-col justify-center space-y-4 shadow-xl shadow-primary/20">
                  <h3 className="text-2xl font-bold font-headline">Enterprise Feature: Batch Processing</h3>
                  <p className="opacity-90 max-w-md">Process thousands of documents simultaneously with custom scripting and high-throughput local engines.</p>
                  <Button variant="secondary" className="w-fit text-primary font-bold">Request Demo</Button>
                </div>
              </div>
            </div>

            {/* Conversion Suite */}
            <div className="space-y-8">
              <div className="flex items-end justify-between border-b pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-headline">High-Fidelity Conversion</h2>
                  <p className="text-muted-foreground text-sm">Industrial-grade conversion engines for every format.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {convertTools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} />
                ))}
              </div>
            </div>

            {/* Manipulation Suite */}
            <div className="space-y-8">
              <div className="flex items-end justify-between border-b pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-headline">Document Manipulation</h2>
                  <p className="text-muted-foreground text-sm">Fast and efficient page management tools.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {manipulationTools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} />
                ))}
              </div>
            </div>

            {/* Security Suite */}
            <div className="space-y-8">
              <div className="flex items-end justify-between border-b pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-headline">Security & Compliance</h2>
                  <p className="text-muted-foreground text-sm">Military-grade protection and archival tools.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {securityTools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} />
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Value Prop */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold font-headline leading-tight">Built for Professionals, <br /> Trusted by Enterprises.</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">Zero-Retention Policy</h4>
                      <p className="text-muted-foreground text-sm">Your documents are processed in-memory and never stored on our servers.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">Lightning Fast Processing</h4>
                      <p className="text-muted-foreground text-sm">Proprietary engines optimized for high-volume local document manipulation.</p>
                    </div>
                  </div>
                </div>
                <Button size="lg" variant="outline" className="h-12 border-primary text-primary hover:bg-primary/5">Download Security Whitepaper</Button>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-muted ring-8 ring-muted/20">
                 <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                  alt="DocuFlow Interface" 
                  className="object-cover w-full h-full"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/50 border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/merge">Merge PDF</Link></li>
                <li><Link href="/compress">Compress PDF</Link></li>
                <li><Link href="/analyze">Document Inspector</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Security</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/protect">Protect PDF</Link></li>
                <li><Link href="/protect?mode=unlock">Unlock PDF</Link></li>
                <li><Link href="#">Compliance</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">API</Link></li>
                <li><Link href="#">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">LinkedIn</Link></li>
                <li><Link href="#">Twitter</Link></li>
                <li><Link href="#">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-8">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-bold text-sm tracking-tighter uppercase text-primary font-headline">DocuFlow Professional</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} DocuFlow Professional. Empowering global teams with secure document intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
