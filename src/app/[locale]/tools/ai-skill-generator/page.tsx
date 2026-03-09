"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Loader2, 
  Share2, 
  Zap,
  CheckCircle2,
  LayoutDashboard,
  Sparkles,
  Twitter,
  Linkedin,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeSkillGenerationAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, serverTimestamp, doc, query, limit, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SkillGeneratorPage() {
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

  const handleGenerate = async () => {
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

      const res = await executeSkillGenerationAction({ interests: input });
      setResult(res);
      
      const logData = { userId: user.uid, toolUsed: 'AI_SKILL_GEN', requestTimestamp: serverTimestamp(), status: 'SUCCESS' };
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
      const slug = `skill-${Math.random().toString(36).substring(2, 8)}`;
      const formattedContent = `SKILL: ${result.skillName}\nWHY: ${result.rationale}\n\nCURRICULUM:\n${result.curriculum.map((w: any) => `WEEK ${w.week} - ${w.topic}:\n${w.dailyPlan}\nExercise: ${w.exercise}`).join('\n\n')}`;
      
      await setDocumentNonBlocking(doc(firestore, 'public_ai_results', slug), {
        creatorId: user.uid,
        toolName: 'AI Skill Generator',
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
              <BookOpen className="h-3 w-3 text-primary" />
              <span>30-Day Mastery Suite</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic">Skill <span className="text-primary not-italic">Generator.</span></h1>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto">
              Synthesize a professional 30-day learning curriculum tailored to your goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <Card className="lg:col-span-4 border-none shadow-2xl rounded-[3rem] bg-white p-8">
              <CardContent className="p-0 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Goal or Interest</Label>
                  <Input 
                    placeholder="e.g. Prompt Engineering, React, Public Speaking..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    className="h-14 bg-muted/20 border-accent/10 rounded-2xl font-bold"
                  />
                </div>
                <Button onClick={handleGenerate} disabled={isProcessing || !input.trim()} className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl">
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                  Generate 30-Day Plan
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-8">
              {result ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <Card className="border-none shadow-xl rounded-[2.5rem] bg-accent text-white p-10">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-primary mb-2">{result.skillName}</h3>
                    <p className="text-lg font-medium italic opacity-60 leading-relaxed">"{result.rationale}"</p>
                  </Card>

                  <div className="grid gap-6">
                    {result.curriculum.map((week: any, i: number) => (
                      <Card key={i} className="border-none shadow-lg rounded-[2rem] bg-white overflow-hidden group">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 bg-muted/30 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-accent/5">
                            <span className="text-[10px] font-black uppercase text-accent/20 tracking-[0.3em] mb-1">Phase</span>
                            <span className="text-4xl font-black italic text-primary">0{week.week}</span>
                          </div>
                          <div className="flex-1 p-8 space-y-4">
                            <h4 className="text-xl font-black uppercase italic tracking-tighter text-accent">{week.topic}</h4>
                            <div className="p-4 bg-muted/20 rounded-xl space-y-3">
                               <div className="flex items-start gap-3">
                                  <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <p className="text-sm font-medium text-accent/80 leading-relaxed uppercase">{week.dailyPlan}</p>
                               </div>
                               <div className="flex items-start gap-3">
                                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <p className="text-xs font-bold text-accent/40 italic">Mission: {week.exercise}</p>
                               </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={handleShare} className="w-full h-16 rounded-2xl border-accent/10 font-black uppercase text-[11px] tracking-widest shadow-2xl">
                        <Share2 className="h-4 w-4 mr-2" /> Share Protocol
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
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[3rem] opacity-20 bg-white/50">
                  <BookOpen className="h-16 w-16 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-center">Awaiting Learning Payload...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
