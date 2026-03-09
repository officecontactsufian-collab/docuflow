"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  BrainCircuit, 
  Loader2, 
  Copy, 
  Share2, 
  Zap,
  LayoutDashboard,
  Search,
  FileText,
  Bookmark,
  Sparkles,
  Twitter,
  Linkedin,
  MessageCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeBrainSynthesisAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, serverTimestamp, doc, query, limit, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function PersonalBrainPage() {
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

  const handleSynthesize = async () => {
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

      const res = await executeBrainSynthesisAction({ content: input });
      setResult(res);
      
      const logData = { userId: user.uid, toolUsed: 'AI_PERSONAL_BRAIN', requestTimestamp: serverTimestamp(), status: 'SUCCESS' };
      addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'usageLogs'), logData);
      addDocumentNonBlocking(collection(firestore, 'usageLogs'), logData);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Synthesis Failure", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!user || !firestore || !result) return;
    setIsSharing(true);
    try {
      const slug = `brain-${Math.random().toString(36).substring(2, 8)}`;
      const formattedContent = `SUMMARY: ${result.summary}\n\nINDEX:\n${result.index.map((i: any) => `- ${i.category}: ${i.keyPoints.join(', ')}`).join('\n')}`;
      
      const publicRef = doc(firestore, 'public_ai_results', slug);
      await setDocumentNonBlocking(publicRef, {
        creatorId: user.uid,
        toolName: 'AI Personal Brain',
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
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="section-label mx-auto">
              <BrainCircuit className="h-3 w-3 text-primary" />
              <span>Cognitive Knowledge Hub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic">Personal <span className="text-primary not-italic">Brain.</span></h1>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto">
              Index raw information into a structured, searchable cognitive framework.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-8">
                <CardContent className="p-0 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/40">Knowledge Payload</Label>
                    <Textarea 
                      placeholder="Paste your notes, research, transcript, or link content here..." 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[300px] bg-muted/20 border-accent/10 rounded-2xl font-bold text-accent"
                    />
                  </div>
                  <Button onClick={handleSynthesize} disabled={isProcessing || !input.trim()} className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Synthesize Digital Brain
                  </Button>
                </CardContent>
              </Card>
              
              <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tight">
                  The Personal Brain protocol extracts semantic relationships and logical hierarchies from your raw data.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              {result ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 flex items-center gap-2">
                      <LayoutDashboard className="h-3 w-3" /> Cognitive Index
                    </h3>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" onClick={handleShare} size="sm" className="text-[9px] font-black uppercase text-primary">
                            <Share2 className="h-3 w-3 mr-2" /> Share Result
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
                  </div>

                  <Card className="border-none shadow-2xl rounded-[3rem] bg-accent text-white overflow-hidden">
                    <CardHeader className="p-10 pb-4">
                      <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary italic">Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 pt-4">
                      <p className="text-xl font-medium leading-relaxed italic text-white/80">{result.summary}</p>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6">
                    {result.index.map((item: any, i: number) => (
                      <Card key={i} className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 group hover:border-primary/20 border-2 border-transparent transition-all">
                        <div className="flex items-start gap-6">
                          <div className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                            <Bookmark className="h-6 w-6" />
                          </div>
                          <div className="space-y-4 flex-1">
                            <h4 className="text-lg font-black uppercase italic tracking-tighter text-accent">{item.category}</h4>
                            <div className="space-y-2">
                              {item.keyPoints.map((kp: string, j: number) => (
                                <div key={j} className="flex items-center gap-3 text-[11px] font-bold text-accent/60 uppercase">
                                  <div className="h-1 w-1 rounded-full bg-primary" /> {kp}
                                </div>
                              ))}
                            </div>
                            {item.actionItems && item.actionItems.length > 0 && (
                              <div className="pt-4 border-t border-accent/5">
                                <p className="text-[8px] font-black uppercase text-primary tracking-widest mb-2">Suggested Actions</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.actionItems.map((ai: string, k: number) => (
                                    <span key={k} className="text-[9px] font-bold bg-primary/5 text-primary px-2 py-1 rounded-lg"># {ai}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[3rem] opacity-20 bg-white/50">
                  <BrainCircuit className="h-16 w-16 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-center max-w-xs leading-relaxed">
                    Initialize synthesis to reconstruct your knowledge into a cognitive index.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
