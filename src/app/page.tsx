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
  Search,
  Hash,
  CheckCircle2,
  FileUp,
  Settings2,
  Download,
  FilePenLine,
  Table
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const tools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDF files into one single document in seconds.",
      icon: Merge,
      href: "/merge",
    },
    {
      title: "Split PDF",
      description: "Extract specific pages or split one PDF into multiple files.",
      icon: Scissors,
      href: "/split",
    },
    {
      title: "Compress PDF",
      description: "Reduce file size while maintaining the best possible quality.",
      icon: Maximize,
      href: "/compress",
    },
    {
      title: "PDF to Word",
      description: "Convert PDFs to editable Microsoft Word documents accurately.",
      icon: FileText,
      href: "/convert?type=pdf-to-word",
    },
    {
      title: "Word to PDF",
      description: "Make DOC and DOCX files easy to read by converting them to PDF.",
      icon: FileText,
      href: "/convert?type=word-to-pdf",
    },
    {
      title: "Edit PDF",
      description: "Add text, shapes, and freehand annotations to your PDF documents.",
      icon: FilePenLine,
      href: "/organize",
    },
    {
      title: "PDF to Excel",
      description: "Extract table data from PDF documents into Excel spreadsheets.",
      icon: Table,
      href: "/convert?type=pdf-to-excel",
    },
    {
      title: "JPG to PDF",
      description: "Convert images to PDF files with custom orientation and margins.",
      icon: ImageIcon,
      href: "/convert?type=jpg-to-pdf",
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative py-24 lg:py-32 overflow-hidden border-b border-white/10">
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest border border-accent/20">
                <Shield className="h-4 w-4 text-primary" />
                <span>100% Secure Document Processing</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-accent leading-tight">
                Every Tool You Need <br />
                <span className="text-primary">for PDFs in One Place</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-accent/70 max-w-2xl mx-auto leading-relaxed font-medium">
                Free, easy-to-use, and secure. Merge, split, compress, and convert documents in seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-xl bg-accent hover:bg-accent/90 text-white shadow-xl transition-all">
                  <Link href="#tools">
                    Explore All Tools <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl bg-white/50 backdrop-blur-sm border-accent/20 text-accent hover:bg-white transition-all">
                  <Link href="/enterprise">
                    Try for Free
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-accent/50 font-medium">No installation required. All files deleted automatically after 2 hours.</p>
            </div>
          </div>
        </section>

        {/* TOOLS GRID SECTION */}
        <section id="tools" className="py-24 bg-background/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black text-accent uppercase">Popular PDF Tools</h2>
              <p className="text-accent/60 text-lg max-w-2xl mx-auto">
                Discover our range of easy-to-use tools designed to help you work faster and smarter with your documents.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Button variant="link" className="text-accent font-bold uppercase tracking-widest group">
                View All PDF Solutions <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 bg-card/30 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-accent uppercase">How it Works</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <FileUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-accent">1. Select Files</h3>
                <p className="text-accent/60">Upload your PDF or other documents from your computer or cloud storage.</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Settings2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-accent">2. Process</h3>
                <p className="text-accent/60">Our professional engine handles the heavy lifting in seconds with high precision.</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-accent">3. Download</h3>
                <p className="text-accent/60">Save your new document instantly. Secure and verified for professional use.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY & PRIVACY SECTION */}
        <section className="py-24 bg-accent text-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div className="space-y-8">
                <h2 className="text-4xl font-black uppercase">Your Security is Our Priority</h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  We use military-grade encryption to ensure your documents are handled with the highest level of privacy. Every file is processed in an isolated environment and permanently deleted from our servers.
                </p>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    "End-to-end 256-bit encryption",
                    "Automatic file deletion after 2 hours",
                    "Isolated processing environment",
                    "GDPR & ISO compliant standards"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/5 rounded-3xl flex items-center justify-center p-12">
                   <Lock className="w-48 h-48 text-primary/40" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-2xl shadow-2xl">
                   <ShieldCheck className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE DOCUFLOW SECTION */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-accent uppercase">Why Choose DocuFlow?</h2>
              <p className="text-xl text-accent/60 leading-relaxed">
                DocuFlow is the preferred choice for millions because we combine industrial-grade performance with a clean, simple interface that works everywhere.
              </p>
              <div className="grid md:grid-cols-3 gap-8 pt-8">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-accent uppercase">Lightning Fast</h4>
                  <p className="text-sm text-accent/60">Optimized processing engines that deliver results in seconds.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-accent uppercase">Works on Any Device</h4>
                  <p className="text-sm text-accent/60">Fully responsive web application that works on mobile, tablet, and desktop.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-accent uppercase">High Quality</h4>
                  <p className="text-sm text-accent/60">Advanced layout reconstruction for flawless document fidelity.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OPTIONAL STATS SECTION */}
        <section className="py-20 bg-muted/50 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-black text-accent">50M+</p>
                <p className="text-sm font-bold uppercase text-accent/50 tracking-widest">Files Processed</p>
              </div>
              <div>
                <p className="text-4xl font-black text-accent">100%</p>
                <p className="text-sm font-bold uppercase text-accent/50 tracking-widest">Secure & Private</p>
              </div>
              <div>
                <p className="text-4xl font-black text-accent">4.9/5</p>
                <p className="text-sm font-bold uppercase text-accent/50 tracking-widest">Average Rating</p>
              </div>
              <div>
                <p className="text-4xl font-black text-accent">25+</p>
                <p className="text-sm font-bold uppercase text-accent/50 tracking-widest">Pro PDF Tools</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-accent text-white py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-2xl font-black tracking-tighter uppercase italic">DocuFlow</span>
              </div>
              <p className="text-sm leading-relaxed font-medium opacity-60">
                The simple, secure, and professional way to manage your documents online. Helping millions of users every day.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-widest">Solutions</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link href="/merge" className="hover:text-primary transition-colors">Merge PDF</Link></li>
                <li><Link href="/split" className="hover:text-primary transition-colors">Split PDF</Link></li>
                <li><Link href="/compress" className="hover:text-primary transition-colors">Compress PDF</Link></li>
                <li><Link href="/convert" className="hover:text-primary transition-colors">PDF to Word</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/enterprise" className="hover:text-primary transition-colors">Enterprise</Link></li>
                <li><Link href="/security" className="hover:text-primary transition-colors">Security Hub</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
              &copy; {new Date().getFullYear()} DocuFlow Professional. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest opacity-40">
              <span>Made for Professionals</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
