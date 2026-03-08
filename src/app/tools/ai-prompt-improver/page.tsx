"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook, 
  MessageCircle,
  BrainCircuit,
  ShieldCheck,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executePromptImprovementAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, query, where, getDocs, limit, serverTimestamp, doc, orderBy, Timestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function PromptImproverPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [input, setInput] = React.useState('');
  const [result, setResult] = React.useState<any>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  const [shareSlug, setShareSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isUserLoading && !user && auth) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, isUserLoading, auth]);

  const handleImprove = async () => {
    if (!input.trim() || !user || !firestore) return;
    setIsProcessing(true);
    setResult(null);
    setShareSlug(null);

    try {
      // Check usage limits locally using the user's private subcollection
      const logsRef = collection(firestore, 'users', user.uid, 'usageLogs');
      // Fetch the last 10 logs to check if limit hit TODAY
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

      const res = await executePromptImprovementAction({ userPrompt: input });
      setResult(res);

      const logData = { userId: user.uid, toolUsed: 'PROMPT_IMPROVER', requestTimestamp: serverTimestamp(), status: 'SUCCESS' };
      addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'usageLogs'), logData);
      addDocumentNonBlocking(collection(firestore, 'usageLogs'), logData);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Protocol Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!user || !firestore || !result) return;
    setIsSharing(true);
    try {
      const slug = `prompt-${Math.random().toString(36).substring(2, 8)}`;
      const publicRef = doc(firestore, 'public_ai_results', slug);
      await setDocumentNonBlocking(publicRef, {
        creatorId: user.uid,
        toolName: 'AI Prompt Improver',
        generatedContent: `IMPROVED PROMPT:\n${result.improvedPrompt}\n\nEXPLANATION:\n${result.explanation}`,
        shareSlug: slug,
        createdAt: serverTimestamp(),
        isPubliclyShareable: true
      }, { merge: true });
      setShareSlug(slug);
      toast({ title: "Shared", description: "Public URL generated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sharing Failed", description: e.message });
    } finally {
      setIsSharing(false);
    }
  };

  const shareUrl = shareSlug ? `${window.location.origin}/share/${shareSlug}` : '';

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="section-label mx-auto">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Prompt Engineering Suite</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic">AI Prompt <br/><span className="text-primary not-italic">Improver.</span></h1>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto">
              Transform simple instructions into high-fidelity structured prompts for professional AI tools.
            </p>
          </div>

          <div className="grid gap-8">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-8">
              <CardContent className="p-0 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-accent/40">Raw Prompt Input</Label>
                  <Textarea 
                    placeholder="Write a blog post about..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[150px] bg-muted/20 border-accent/10 rounded-2xl font-bold text-accent resize-none"
                  />
                </div>
                <Button 
                  onClick={handleImprove} 
                  disabled={isProcessing || !input.trim()}
                  className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-accent/20"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                  Optimize Protocol
                </Button>
              </CardContent>
            </Card>

            {result && (
              <Card className="border-none shadow-2xl rounded-[3rem] bg-accent text-white overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
                <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-primary">Synthesis Complete</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(result.improvedPrompt)} className="text-white/40 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleShare} className="text-white/40 hover:text-white">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2rem] bg-white border-none shadow-2xl p-8 max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black uppercase italic text-accent">Viral Sharing</DialogTitle>
                          <DialogDescription className="text-[10px] font-bold uppercase text-accent/40">Distribute this protocol result</DialogDescription>
                        </DialogHeader>
                        {isSharing ? (
                          <div className="py-12 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                        ) : (
                          <div className="space-y-6 pt-6">
                            <div className="flex justify-center gap-4">
                              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" className="h-12 w-12 rounded-xl bg-[#1DA1F2] flex items-center justify-center text-white shadow-lg"><Twitter className="h-5 w-5" /></a>
                              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" className="h-12 w-12 rounded-xl bg-[#0077B5] flex items-center justify-center text-white shadow-lg"><Linkedin className="h-5 w-5" /></a>
                              <a href={`https://wa.me/?text=${shareUrl}`} target="_blank" className="h-12 w-12 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-lg"><MessageCircle className="h-5 w-5" /></a>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-xl border border-accent/5 text-center">
                              <p className="text-[9px] font-black text-accent truncate">{shareUrl}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-8">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Optimized Payload</p>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 font-bold leading-relaxed selection:bg-primary/30">
                      {result.improvedPrompt}
                    </div>
                  </div>
                  <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20 flex gap-4">
                    <BrainCircuit className="h-6 w-6 text-primary shrink-0" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-primary">Logic Explanation</p>
                      <p className="text-xs font-bold text-white/60 leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
