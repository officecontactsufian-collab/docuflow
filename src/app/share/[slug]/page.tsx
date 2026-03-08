
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
  LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { doc, Timestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

export default function ShareResultPage() {
  const { slug } = useParams();
  const firestore = useFirestore();

  const shareRef = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return doc(firestore, 'public_ai_results', slug as string);
  }, [firestore, slug]);

  const { data: result, isLoading } = useDoc(shareRef);

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
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="h-3 w-3" /> Published Analysis
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic leading-none">
              Intelligence <br />
              <span className="not-italic text-primary">Manifest.</span>
            </h1>
            <div className="flex items-center justify-center gap-6 pt-4">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-accent/40 tracking-widest">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {result.createdAt instanceof Timestamp ? result.createdAt.toDate().toLocaleDateString() : 'Historical Registry'}
               </div>
               <div className="h-1 w-1 rounded-full bg-accent/10" />
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-accent/40 tracking-widest">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Verified Protocol
               </div>
            </div>
          </div>

          {/* Main Result Card */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <CardHeader className="p-10 border-b border-accent/5 bg-muted/5 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black uppercase italic text-accent tracking-tighter flex items-center gap-3">
                  <BrainCircuit className="h-6 w-6 text-primary" /> {result.toolName} Output
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">High-Fidelity AI Synthesis</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-xl border-accent/10 text-[9px] font-black uppercase py-1.5 px-4 bg-white shadow-sm">
                ID: {result.id.substring(0, 8)}
              </Badge>
            </CardHeader>
            <CardContent className="p-10 md:p-16">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-accent/80 selection:bg-primary/20">
                  {result.generatedContent}
                </div>
              </div>
            </CardContent>
            <div className="p-8 bg-accent text-white flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5">
               <div className="space-y-2">
                  <p className="text-xl font-black italic uppercase tracking-tighter leading-none">Ready to generate?</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Execute your own industrial document sequence today.</p>
               </div>
               <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 hover:scale-105 transition-all group">
                  <Link href="/ai-studio" className="flex items-center gap-3">
                    Initialize Protocol <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </Button>
            </div>
          </Card>

          {/* Footer Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 opacity-30 grayscale hover:opacity-100 transition-all duration-1000 cursor-default pb-12">
             <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] italic">
                <LayoutDashboard className="h-3.5 w-3.5" /> Platform Registry
             </div>
             <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] italic text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> AES-256 Hardened
             </div>
             <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] italic">
                <Cpu className="h-3.5 w-3.5" /> Cloud-Edge Tunnel
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
