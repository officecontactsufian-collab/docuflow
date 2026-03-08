"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  Loader2, 
  Share2, 
  Zap,
  Twitter,
  Linkedin,
  MessageCircle,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeLifeSimulationAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function LifeSimulatorPage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [input, setInput] = React.useState('');
  const [result, setResult] = React.useState<any>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  const [shareSlug, setShareSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user && auth) signInAnonymously(auth);
  }, [user, auth]);

  const handleSimulate = async () => {
    if (!input.trim() || !user || !firestore) return;
    setIsProcessing(true);
    setResult(null);
    setShareSlug(null);

    try {
      const res = await executeLifeSimulationAction({ decision: input });
      setResult(res);
      addDocumentNonBlocking(collection(firestore, 'usageLogs'), { userId: user.uid, toolUsed: 'AI_LIFE_SIM', requestTimestamp: serverTimestamp(), status: 'SUCCESS' });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!user || !firestore || !result) return;
    setIsSharing(true);
    try {
      const slug = `sim-${Math.random().toString(36).substring(2, 8)}`;
      await setDocumentNonBlocking(doc(firestore, 'public_ai_results', slug), {
        creatorId: user.uid,
        toolName: 'AI Life Simulator',
        generatedContent: JSON.stringify(result),
        shareSlug: slug,
        createdAt: serverTimestamp(),
        isPubliclyShareable: true
      }, { merge: true });
      setShareSlug(slug);
    } finally {
      setIsSharing(false);
    }
  };

  const shareUrl = shareSlug ? `${window.location.origin}/share/${shareSlug}` : '';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic">Life <span className="text-primary not-italic">Simulator.</span></h1>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs">Simulate temporal outcomes for complex decisions.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-8">
              <CardContent className="p-0 space-y-6">
                <Label className="text-[10px] font-black uppercase tracking-widest">Decision or Path</Label>
                <Textarea 
                  placeholder="e.g. What happens if I move to Berlin to start an art gallery?" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] bg-muted/20 border-accent/5 rounded-2xl font-bold"
                />
                <Button onClick={handleSimulate} disabled={isProcessing || !input.trim()} className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px]">
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
                  Deploy Simulation Sequence
                </Button>
              </CardContent>
            </Card>

            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-accent text-white p-8">
                  <p className="text-[10px] font-black uppercase text-primary mb-4 italic">Executive Synthesis</p>
                  <p className="text-lg font-medium leading-relaxed italic opacity-80">"{result.summary}"</p>
                </Card>

                <div className="space-y-4">
                  {result.scenarios.map((s: any, i: number) => (
                    <Card key={i} className="border-none shadow-lg rounded-2xl bg-white p-6 border-l-4 border-primary">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-primary">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{s.timeframe}</span>
                        </div>
                        <span className="text-[9px] font-bold bg-muted px-2 py-1 rounded-full">{s.probability} Probability</span>
                      </div>
                      <p className="text-sm font-medium text-accent/80">{s.outcome}</p>
                    </Card>
                  ))}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={handleShare} variant="outline" className="w-full h-12 rounded-xl border-accent/10 font-black uppercase text-[10px] tracking-widest">
                      <Share2 className="h-3.5 w-3.5 mr-2" /> Publish Simulation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2rem] p-8 max-w-sm">
                    {isSharing ? <Loader2 className="animate-spin mx-auto"/> : (
                      <div className="space-y-6 pt-6 flex flex-col items-center">
                        <div className="flex gap-4">
                          <a href={`https://wa.me/?text=${shareUrl}`} className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg"><MessageCircle className="h-5 w-5"/></a>
                          <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg"><Twitter className="h-5 w-5"/></a>
                        </div>
                        <p className="text-[9px] font-bold truncate opacity-40">{shareUrl}</p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[3rem] opacity-20">
                <Globe className="h-12 w-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-center">Awaiting Temporal Input...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
