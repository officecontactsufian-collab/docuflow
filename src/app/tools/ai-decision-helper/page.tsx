"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Scale, 
  Loader2, 
  Copy, 
  Share2, 
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  Twitter,
  Linkedin,
  MessageCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeDecisionAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, serverTimestamp, doc, query, limit, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function DecisionHelperPage() {
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

  const handleAnalyze = async () => {
    if (!input.trim() || !user || !firestore) return;
    setIsProcessing(true);
    setResult(null);
    setShareSlug(null);

    try {
      const logsRef = collection(firestore, 'users', user.uid, 'usageLogs');
      const q = query(logsRef, orderBy('requestTimestamp', 'desc'), limit(10));
      const snap = await getDocs(q);
      
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const logsToday = snap.docs.filter(doc => {
        const data = doc.data();
        const ts = data.requestTimestamp;
        if (!ts) return false;
        const date = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
        return date >= startOfToday;
      });

      if (logsToday.length >= 10) {
        throw new Error("DAILY_LIMIT_REACHED: 10 operations allowed per day. Please return tomorrow.");
      }

      const res = await executeDecisionAction({ decision: input });
      setResult(res);
      
      const logData = { userId: user.uid, toolUsed: 'AI_DECISION_HELPER', requestTimestamp: serverTimestamp(), status: 'SUCCESS' };
      addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'usageLogs'), logData);
      addDocumentNonBlocking(collection(firestore, 'usageLogs'), logData);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Analysis Failure", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!user || !firestore || !result) return;
    setIsSharing(true);
    try {
      const slug = `decision-${Math.random().toString(36).substring(2, 8)}`;
      const formattedContent = `DECISION: ${input}\n\nPROS:\n${result.pros.map((p: string) => `- ${p}`).join('\n')}\n\nCONS:\n${result.cons.map((c: string) => `- ${c}`).join('\n')}\n\nSYNTHESIS:\n${result.synthesis}\n\nRISK LEVEL: ${result.riskLevel}`;
      
      const publicRef = doc(firestore, 'public_ai_results', slug);
      await setDocumentNonBlocking(publicRef, {
        creatorId: user.uid,
        toolName: 'AI Decision Helper',
        generatedContent: formattedContent,
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
            <div className="section-label mx-auto">
              <Scale className="h-3 w-3 text-primary" />
              <span>Logic Analysis Suite</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic">AI Decision <span className="text-primary not-italic">Helper.</span></h1>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto">
              Synthesize complex choices into a structured analytical framework.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-8">
              <CardContent className="p-0 space-y-6">
                <Label className="text-[10px] font-black uppercase tracking-widest text-accent/40">The Decision to Evaluate</Label>
                <Textarea 
                  placeholder="Should I start a new SaaS business or take a high-paying corporate job?" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] bg-muted/20 border-accent/10 rounded-2xl font-bold text-accent"
                />
                <Button onClick={handleAnalyze} disabled={isProcessing || !input.trim()} className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-accent/20">
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Scale className="mr-2 h-4 w-4" />}
                  Execute Logic Analysis
                </Button>
              </CardContent>
            </Card>

            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-none shadow-xl rounded-[2rem] bg-green-50/50 p-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3" /> Pros
                    </h4>
                    <ul className="space-y-2">
                      {result.pros.map((p: string, i: number) => (
                        <li key={i} className="text-[11px] font-bold text-green-800 leading-tight">• {p}</li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="border-none shadow-xl rounded-[2rem] bg-red-50/50 p-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-4 flex items-center gap-2">
                      <AlertCircle className="h-3 w-3" /> Cons
                    </h4>
                    <ul className="space-y-2">
                      {result.cons.map((c: string, i: number) => (
                        <li key={i} className="text-[11px] font-bold text-red-800 leading-tight">• {c}</li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <Card className="border-none shadow-2xl rounded-[3rem] bg-accent text-white p-10 relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary italic">Strategic Synthesis</h4>
                      <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-white/10", 
                        result.riskLevel === 'CRITICAL' ? "text-red-400" : "text-primary")}>
                        Risk: {result.riskLevel}
                      </div>
                    </div>
                    <p className="text-lg font-medium leading-relaxed italic text-white/80 whitespace-pre-wrap">{result.synthesis}</p>
                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" onClick={handleShare} size="sm" className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">
                            <Share2 className="h-3 w-3 mr-2" /> Share Protocol
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] p-8 max-w-sm">
                          <DialogHeader><DialogTitle className="font-black uppercase italic">Share Result</DialogTitle></DialogHeader>
                          {isSharing ? <Loader2 className="animate-spin mx-auto"/> : (
                            <div className="space-y-6 pt-6">
                              <div className="flex justify-center gap-4">
                                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white"><Twitter className="h-5 w-5"/></a>
                                <a href={`https://wa.me/?text=${shareUrl}`} className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white"><MessageCircle className="h-5 w-5"/></a>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white" onClick={() => navigator.clipboard.writeText(result.synthesis)}>
                        <Copy className="h-3 w-3 mr-2" /> Copy Analysis
                      </Button>
                    </div>
                  </div>
                  <BrainCircuit className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 pointer-events-none" />
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[3rem] opacity-20 bg-white/50 min-h-[400px]">
                <Scale className="h-12 w-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-center">Awaiting Decision Payload...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
