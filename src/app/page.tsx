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
  Zap
} from 'lucide-react';

export default function Home() {
  const tools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDFs into one unified document with ease.",
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
      title: "Convert PDF",
      description: "Transform PDFs to Word, Image, or Excel formats instantly.",
      icon: RefreshCcw,
      href: "/convert",
    },
    {
      title: "AI Analysis",
      description: "Summarize and extract key insights from your documents using AI.",
      icon: Sparkles,
      href: "/analyze",
      accent: true,
    },
    {
      title: "PDF to Image",
      description: "Extract images from your PDF or save pages as high-quality JPGs.",
      icon: FileImage,
      href: "/convert",
    },
    {
      title: "Protect PDF",
      description: "Secure your documents with professional-grade encryption.",
      icon: Lock,
      href: "#",
    },
    {
      title: "Add Watermark",
      description: "Protect your intellectual property with custom watermarks.",
      icon: Stamp,
      href: "#",
    },
    {
      title: "Searchable PDF",
      description: "Use OCR to make scanned PDF documents searchable.",
      icon: FileSearch,
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
              <span>Now with AI-powered summaries</span>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground font-headline leading-tight">
                Handle PDFs with <span className="text-primary">Intelligence</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to merge, split, convert, and analyze your documents in one professional platform. Secure, fast, and remarkably simple.
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
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-headline">Fast & Secure</h3>
                <p className="text-muted-foreground">We use industry-standard encryption and delete your files automatically after processing.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-headline">Cross-Platform</h3>
                <p className="text-muted-foreground">Works in any web browser, on any device. No software installation required.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-headline">AI-Powered</h3>
                <p className="text-muted-foreground">Leverage the latest Gemini models to extract insights from complex documents.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PDF Spark. All rights reserved. Professional document handling tools.
          </p>
        </div>
      </footer>
    </div>
  );
}