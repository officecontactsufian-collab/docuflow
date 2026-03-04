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
      description: "Add text, shapes, and freehand annotations to your documents.",
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
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
          <div className="container relative mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 text-accent text-[10px] font-black uppercase tracking-[0.2em] border border-accent/10">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>100% Private Processing</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-accent leading-[0.9] italic uppercase">
                Powerful PDF <br />
                <span className="text-primary not-italic">Workflow</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-accent/70 max-w-2xl mx-auto leading-relaxed font-semibold">
                DocuFlow is the professional workspace for document intelligence. 
                Fast, secure, and built for your browser.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                <Button asChild size="lg" className="h-16 px-10 text-xs font-black uppercase tracking-[0.2em] rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-2xl transition-all hover:scale-105">
                  <Link href="#tools">
                    Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-16 px-10 text-xs font-black uppercase tracking-[0.2em] rounded-2xl bg-white/40 backdrop-blur-sm border-accent/10 text-accent hover:bg-white transition-all">
                  <Link href="/enterprise">
                    Try For Free
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-8 pt-8 opacity-40 grayscale pointer-events-none">
                 <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest italic">ISO-27001</div>
                 <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest italic">GDPR-READY</div>
                 <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest italic">SOC2-TYPE-II</div>
              </div>
            </div>
          </div>
          
          {/* Abstract background elements */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
          </div>
        </section>

        {/* TOOLS GRID SECTION */}
        <section id="tools" className="py-32 bg-card/40 border-y border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black text-accent uppercase italic">Core Solutions</h2>
                <p className="text-accent/60 text-lg font-semibold">
                  Industrial-grade document manipulation tools designed to help you work faster and smarter.
                </p>
              </div>
              <Button variant="link" className="text-primary font-black uppercase tracking-widest text-[10px] group">
                View All PDF Solutions <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black text-accent uppercase italic">Effortless Flow</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center shadow-xl">
                  <FileUp className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-accent uppercase italic">1. Select Files</h3>
                  <p className="text-accent/60 font-medium leading-relaxed">Securely upload your documents directly from your desktop or preferred cloud storage.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center shadow-xl">
                  <Settings2 className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-accent uppercase italic">2. Process</h3>
                  <p className="text-accent/60 font-medium leading-relaxed">Our advanced processing engine reconstructions layouts with pixel-perfect precision in seconds.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center shadow-xl">
                  <Download className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-accent uppercase italic">3. Download</h3>
                  <p className="text-accent/60 font-medium leading-relaxed">Save your optimized document instantly. Verified, secured, and ready for professional delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY & PRIVACY SECTION */}
        <section className="py-32 bg-accent text-white overflow-hidden relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                  <Shield className="h-4 w-4" /> Security Standard
                </div>
                <h2 className="text-5xl md:text-6xl font-black uppercase italic leading-tight">Your Data. <br />Your Privacy.</h2>
                <p className="text-xl text-white/60 leading-relaxed font-medium">
                  We use military-grade 256-bit encryption for all transfers. Every file is processed in an isolated in-memory buffer and permanently deleted from our infrastructure.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "End-to-end 256-bit AES",
                    "Automatic file purging",
                    "Isolated browser execution",
                    "Privacy-first architecture"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest opacity-80">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/5 rounded-[4rem] flex items-center justify-center p-20 backdrop-blur-3xl border border-white/10">
                   <Lock className="w-full h-full text-primary/30" />
                </div>
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary rounded-full blur-[100px] opacity-20" />
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE DOCUFLOW SECTION */}
        <section className="py-48 bg-background">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <div className="space-y-12">
              <h2 className="text-5xl md:text-7xl font-black text-accent uppercase italic tracking-tighter">Engineered For Professionals</h2>
              <p className="text-2xl text-accent/60 leading-relaxed font-semibold">
                DocuFlow combines high-performance processing with an intuitive interface that simplifies document complexity.
              </p>
              <div className="grid md:grid-cols-3 gap-12 pt-16">
                <div className="space-y-4 p-8 rounded-[3rem] bg-card/50 border border-white/10">
                  <Cpu className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h4 className="text-lg font-black text-accent uppercase italic">Low Latency</h4>
                  <p className="text-sm font-medium text-accent/50 leading-relaxed">Optimized algorithms that deliver complex processing results in milliseconds.</p>
                </div>
                <div className="space-y-4 p-8 rounded-[3rem] bg-card/50 border border-white/10">
                  <Globe className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h4 className="text-lg font-black text-accent uppercase italic">Cross-Device</h4>
                  <p className="text-sm font-medium text-accent/50 leading-relaxed">Fully responsive workspace that works flawlessly across all devices and platforms.</p>
                </div>
                <div className="space-y-4 p-8 rounded-[3rem] bg-card/50 border border-white/10">
                  <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h4 className="text-lg font-black text-accent uppercase italic">High Fidelity</h4>
                  <p className="text-sm font-medium text-accent/50 leading-relaxed">Advanced reconstruction logic ensures your document layout remains identical.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STATS SECTION */}
        <section className="py-24 bg-accent/5 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <p className="text-5xl font-black text-accent italic">12M+</p>
                <p className="text-[10px] font-black uppercase text-accent/40 tracking-[0.3em] mt-2">Files Processed</p>
              </div>
              <div>
                <p className="text-5xl font-black text-accent italic">100%</p>
                <p className="text-[10px] font-black uppercase text-accent/40 tracking-[0.3em] mt-2">Data Secure</p>
              </div>
              <div>
                <p className="text-5xl font-black text-accent italic">4.9/5</p>
                <p className="text-[10px] font-black uppercase text-accent/40 tracking-[0.3em] mt-2">User Rating</p>
              </div>
              <div>
                <p className="text-5xl font-black text-accent italic">0ms</p>
                <p className="text-[10px] font-black uppercase text-accent/40 tracking-[0.3em] mt-2">Retention Rate</p>
              </div>
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
              <p className="text-sm leading-relaxed font-bold opacity-50 uppercase tracking-widest">
                The intelligent standard for professional document processing. Built for high-volume workflows.
              </p>
            </div>
            <div className="space-y-8">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Capabilities</h4>
              <ul className="space-y-5 text-xs font-black uppercase tracking-widest">
                <li><Link href="/merge" className="hover:text-primary transition-colors">Merge PDF</Link></li>
                <li><Link href="/split" className="hover:text-primary transition-colors">Split PDF</Link></li>
                <li><Link href="/compress" className="hover:text-primary transition-colors">Compress PDF</Link></li>
                <li><Link href="/convert" className="hover:text-primary transition-colors">Convert PDF</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Corporate</h4>
              <ul className="space-y-5 text-xs font-black uppercase tracking-widest">
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Premium Plans</Link></li>
                <li><Link href="/enterprise" className="hover:text-primary transition-colors">Team Solutions</Link></li>
                <li><Link href="/security" className="hover:text-primary transition-colors">Compliance Hub</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Support Center</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Legal Trace</h4>
              <ul className="space-y-5 text-xs font-black uppercase tracking-widest">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Data Processing</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-16 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
              &copy; {new Date().getFullYear()} DocuFlow Intelligence. Finality in documents.
            </p>
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
              <span>Secure Connection Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
