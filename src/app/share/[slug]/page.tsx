
"use client"

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { 
  useFirestore, 
  useDoc, 
  useMemoFirebase 
} from '@/firebase';
import { 
  Loader2, 
  Sparkles, 
  Share2, 
  ArrowRight, 
  FileText, 
  Calendar, 
  Zap,
  ShieldCheck,
  BrainCircuit,
  LayoutDashboard,
  Copy,
  Printer,
  Download,
  Terminal,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { doc, Timestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function ShareResultPage() {
  const { slug } = useParams();
  const firestore = useFirestore();
  const { toast } = useToast();

  const shareRef = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return doc(firestore, 'public_ai_results', slug as string);
  }, [firestore, slug]);

  const { data: result, isLoading } = useDoc(shareRef);

  const copyToClipboard = () => {
    if (result?.generatedContent) {
      navigator.clipboard.writeText(result.generatedContent);
      toast({ title: "Copied to Buffer", description: "Manifest content shifted to local clipboard." });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 italic">Retrieving Published Result...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 text-center">
          <Card className="max-w-md border-none shadow-2xl rounded-[3rem] p-12 space-y-8">
            <div className="w-20 h-20 bg-muted/20 rounded-[2rem] flex items-center justify-center mx-auto">
              <Zap className="h-10 w-10 text-accent/20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-accent">Protocol Link Invalid</h2>
              <p className="text-[10px] font-bold text-accent/40 uppercase tracking-widest leading-relaxed">
                The requested result has been purged from the registry or the link is incorrect.
              </p>
            </div>
            <Button asChild className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[10px]">
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="h-3 w-3" /> Intelligence Manifest v2.5
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-accent uppercase italic leading-[0.9]">
              Protocol <br />
              <span className="not-italic text-primary">Synthesis Report.</span>
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-accent/40 tracking-widest">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {result.createdAt instanceof Timestamp ? result.createdAt.toDate().toLocaleDateString() : 'Historical Registry'}
               </div>
               <div className="h-1.5 w-1.5 rounded-full bg-accent/10" />
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-accent/40 tracking-widest">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Verified Transmission
               </div>
               <div className="h-1.5 w-1.5 rounded-full bg-accent/10" />
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-accent/40 tracking-widest">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  ID: {result.shareSlug}
               </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Control Sidebar */}
            <aside className="lg:col-span-3 space-y-6 order-2 lg:order-1 print:hidden">
               <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-6 space-y-6">
                  <p className="text-[9px] font-black uppercase tracking-widest text-accent/30 border-b border-accent/5 pb-2">Manifest Actions</p>
                  <div className="grid gap-3">
                    <Button onClick={copyToClipboard} variant="outline" className="w-full justify-start rounded-xl border-accent/5 hover:bg-primary/5 hover:text-primary font-black text-[9px] uppercase tracking-widest h-12">
                      <Copy className="mr-3 h-4 w-4" /> Copy Content
                    </Button>
                    <Button onClick={handlePrint} variant="outline" className="w-full justify-start rounded-xl border-accent/5 hover:bg-primary/5 hover:text-primary font-black text-[9px] uppercase tracking-widest h-12">
                      <Printer className="mr-3 h-4 w-4" /> Print Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-accent/5 hover:bg-primary/5 hover:text-primary font-black text-[9px] uppercase tracking-widest h-12" disabled>
                      <Download className="mr-3 h-4 w-4" /> Export JSON
                    </Button>
                  </div>
               </Card>

               <div className="p-6 bg-accent text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10 space-y-4">
                    <p className="text-[10px] font-black uppercase italic tracking-tighter text-primary">Deploy Your Own</p>
                    <p className="text-[11px] font-bold leading-relaxed opacity-60">Initialize a professional generative sequence with zero cloud retention.</p>
                    <Button asChild className="w-full bg-white text-accent hover:bg-primary hover:text-white transition-all rounded-xl h-10 font-black text-[9px] uppercase tracking-widest">
                      <Link href="/ai-studio">Enter Studio</Link>
                    </Button>
                  </div>
                  <Cpu className="absolute -bottom-6 -right-6 h-24 w-24 text-white/5" />
               </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden animate-in slide-in-from-bottom-8 duration-1000 print:shadow-none print:border">
                <CardHeader className="p-10 md:p-16 border-b border-accent/5 bg-muted/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest mb-2">
                      {result.toolName || 'Protocol Result'}
                    </Badge>
                    <CardTitle className="text-2xl md:text-3xl font-black uppercase italic text-accent tracking-tighter flex items-center gap-4">
                      <BrainCircuit className="h-8 w-8 text-primary" /> Synthesis Stream
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/30 italic">High-Fidelity AI Reconstruction v2.5</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 print:hidden">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-accent/5">
                       <Zap className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 md:p-20">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-lg md:text-xl font-medium leading-relaxed text-accent/80 selection:bg-primary/30 first-letter:text-4xl first-letter:font-black first-letter:text-primary">
                      {result.generatedContent}
                    </div>
                  </div>
                </CardContent>
                
                <div className="p-10 bg-muted/5 border-t border-accent/5 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 italic">Industrial Origin</p>
                      <p className="text-xs font-bold text-accent italic">Generated via DOCFLOW Professional Protocols</p>
                   </div>
                   <div className="flex items-center gap-10 opacity-20 grayscale print:hidden">
                      <div className="text-[8px] font-black uppercase tracking-[0.4em]">ISO-27001 SECURE</div>
                      <div className="text-[8px] font-black uppercase tracking-[0.4em]">AES-256 ENCRYPTED</div>
                   </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Verification Bar */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 opacity-30 grayscale hover:opacity-100 transition-all duration-1000 cursor-default py-12 print:hidden">
             <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] italic transition-colors hover:text-primary">
                <LayoutDashboard className="h-3.5 w-3.5" /> Registry Verification
             </div>
             <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] italic text-primary">
                <ShieldCheck className="h-3.5 w-3.5 animate-pulse" /> Asset Authenticated
             </div>
             <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] italic transition-colors hover:text-primary">
                <Cpu className="h-3.5 w-3.5" /> Bit-Perfect Manifest
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
