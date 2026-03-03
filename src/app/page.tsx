import { Navbar } from '@/components/navbar';
import { ToolCard } from '@/components/tool-card';
import { 
  Merge, 
  Scissors, 
  FileImage, 
  RefreshCcw, 
  Sparkles, 
  Lock, 
  Stamp, 
  FileSearch,
  Zap,
  FileText,
  Presentation,
  Table as TableIcon,
  Code,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

export default function Home() {
  const tools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDFs into one unified document.",
      icon: Merge,
      href: "/merge",
    },
    {
      title: "Split PDF",
      description: "Extract specific pages or separate one PDF into several files.",
      icon: Scissors,
      href: "/split",
    },
    {
      title: "AI Analysis",
      description: "Summarize and extract key insights from your documents.",
      icon: Sparkles,
      href: "/analyze",
      accent: true,
    },
    {
      title: "Word to PDF",
      description: "Convert Word documents to high-quality PDF files.",
      icon: FileText,
      href: "/convert?type=word-to-pdf",
    },
    {
      title: "JPG to PDF",
      description: "Transform images into a single PDF document.",
      icon: ImageIcon,
      href: "/convert?type=jpg-to-pdf",
    },
    {
      title: "PDF to Word",
      description: "Convert PDF back to editable Word documents.",
      icon: RefreshCcw,
      href: "/convert?type=pdf-to-word",
    },
    {
      title: "PDF to JPG",
      description: "Extract pages from your PDF as high-quality images.",
      icon: FileImage,
      href: "/convert?type=pdf-to-jpg",
    },
    {
      title: "Excel to PDF",
      description: "Convert Excel spreadsheets to professional PDF reports.",
      icon: TableIcon,
      href: "/convert?type=excel-to-pdf",
    },
    {
      title: "PPT to PDF",
      description: "Turn PowerPoint presentations into PDF documents.",
      icon: Presentation,
      href: "/convert?type=ppt-to-pdf",
    },
    {
      title: "HTML to PDF",
      description: "Convert web pages or HTML files to PDF format.",
      icon: Code,
      href: "/convert?type=html-to-pdf",
    },
    {
      title: "PDF to PDF/A",
      description: "Convert to PDF/A for long-term electronic archiving.",
      icon: ShieldCheck,
      href: "/convert?type=pdf-to-pdfa",
    },
    {
      title: "Protect PDF",
      description: "Secure your documents with professional-grade encryption.",
      icon: Lock,
      href: "#",
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          <div className="container mx-auto px-4 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 animate-in fade-in slide-in-from-bottom-2">
              <Zap className="h-4 w-4" />
              <span>Enterprise-grade Document Intelligence</span>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground font-headline leading-tight">
                Master your Documents with <span className="text-primary">DocuFlow</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The professional standard for high-fidelity PDF manipulation. Secure, accelerated, and powered by next-generation AI processing.
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-12 pb-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool, index) => (
                <div key={tool.title} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
                  <ToolCard {...tool} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-24 border-y">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto md:mx-0">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-headline">Enterprise Security</h3>
                <p className="text-muted-foreground">End-to-end encryption with zero-retention policies. Your intellectual property remains yours.</p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto md:mx-0">
                  <RefreshCcw className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-headline">Seamless Workflow</h3>
                <p className="text-muted-foreground">Optimized for high-volume corporate environments. Cloud-integrated and mobile-ready.</p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto md:mx-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-headline">AI-Enhanced Insights</h3>
                <p className="text-muted-foreground">Beyond manipulation: understand your data with automated summaries and semantic extraction.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DocuFlow Professional. Empowering global teams with intelligent document solutions.
          </p>
        </div>
      </footer>
    </div>
  );
}
