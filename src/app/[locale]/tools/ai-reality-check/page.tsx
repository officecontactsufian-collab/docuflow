"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Target, 
  Loader2, 
  Share2, 
  AlertCircle,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeRealityCheckAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, serverTimestamp, doc, query, limit, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { ShareDialog } from '@/components/share-dialog';
import { cn } from '@/lib/utils';

export default function RealityCheckPage() {
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

  const handleCheck = async () => {
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

      const res = await executeRealityCheckAction({ projectIdea: input });
      setResult(res);
      
      const logData = { userId: user.uid, toolUsed: 'AI_REALITY_CHECK', requestTimestamp: serverTimestamp(), status: 'SUCCESS' };
      addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'usageLogs'), logData);
      addDocumentNonBlocking(collection(firestore, 'usageLogs'), logData);
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
      const slug = `reality-${Math.random().toString(36).substring(2, 8)}`;
      const formattedContent = `PROJECT: ${input}\nVIABILITY SCORE: ${result.viabilityScore}%\n\nMARKET: ${result.marketAnalysis}\n\nRISK: ${result.competitorRisk}\n\nREVENUE: ${result.revenuePotential}\n\nBRUTAL HONESTY: ${result.brutalHonesty}`;
      
      await setDocumentNonBlocking(doc(firestore, 'public_ai_results', slug), {
        creatorId: user.uid,
        toolName: 'AI Reality Check',
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

  const getShareUrl = () => {
    if (typeof window === 'undefined' || !shareSlug) return '';
    return `${window.location.origin}/share/${shareSlug}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic">Reality <span className="text-primary not-italic">Check.</span></h1>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs">A no-nonsense, brutal analysis of project viability.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-8">
              <CardContent className="p-0 space-y-6">
                <Label className="text-[10px] font-black uppercase tracking-widest">Project Idea Payload</Label>
                <Textarea 
                  placeholder="Describe your project, revenue model, and target market..." 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[250px] bg-muted/20 border-accent/10 rounded-2xl font-bold text-accent"
                />
                <Button onClick={handleCheck} disabled={isProcessing || !input.trim()} className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl">
                  {isProcessing ? <Loader2 className="animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                  Execute Brutal Analysis
                </Button>
              </CardContent>
            </Card>

            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-accent text-white p-10 overflow-hidden relative">
                   <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Viability Protocol</p>
                         <div className="text-4xl font-black italic">{result.viabilityScore}%</div>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${result.viabilityScore}%` }} />
                      </div>
                      <p className="text-lg font-medium leading-relaxed italic text-white/80">"{result.brutalHonesty}"</p>
                   </div>
                   <Activity className="absolute -bottom-10 -right-10 h-48 w-48 text-white/5 pointer-events-none" />
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     { label: "Market Shift", val: result.marketAnalysis, icon: TrendingUp },
                     { label: "Competitive Risk", val: result.competitorRisk, icon: Target },
                     { label: "Revenue Outlook", val: result.revenuePotential, icon: Zap }
                   ].map((stat, i) => (
                     <Card key={i} className="border-none shadow-lg rounded-2xl bg-white p-6">
                        <div className="flex items-center gap-3 mb-3">
                           <stat.icon className="h-4 w-4 text-primary" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-accent/40">{stat.label}</span>
                        </div>
                        <p className="text-xs font-bold text-accent/80 leading-relaxed uppercase">{stat.val}</p>
                     </Card>
                   ))}
                </div>

                <ShareDialog 
                  url={shareSlug ? getShareUrl() : undefined}
                  title="Brutal Analysis Published"
                  description="Industrial viral distribution protocol."
                  trigger={
                    <Button onClick={() => !shareSlug && handleShare()} variant="outline" className="w-full h-14 rounded-2xl border-accent/10 font-black uppercase text-[10px] tracking-widest">
                      {isSharing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Share2 className="h-4 w-4 mr-2" />} 
                      Share Brutal Analysis
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[3rem] opacity-20 bg-white/50 min-h-[400px]">
                <Target className="h-12 w-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-center">Awaiting Project Payload...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
